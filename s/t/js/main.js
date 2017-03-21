/*

Copyright 2015 Google Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

/*
Copyright 2017 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

var containerDiv = document.getElementById('container');

var videos = {};

var videoId = location.search.split('id=')[1];
if (videoId) {
  var match = videoId.match(/[\w-]{11}/);
  if (match) {
    getAndDisplayTranscript();
  } else {
    window.alert('That doesn\'t seem to be a valid YouTube ID:\n\n ' + videoId);
  }
} else {
  window.alert('No video ID. \n\nThe URL should look like this:\n\n' +
    'simpl.info/s/t?id=ngBy0H_q-GY');
  console.log('No video ID. URL should look like this: ' +
    'simpl.info/s/t?id=ngBy0H_q-GY');
}

function getAndDisplayTranscript() {
  var baseUrl = location.host === 'localhost' ? // to enable testing
  'http://localhost:8080' : 'http://www.shearch.me';
  var url = baseUrl + '/' + videoId;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      var responseText = xhr.responseText;
      if (xhr.status === 200) {
        var data = JSON.parse(responseText);
        handleTranscriptRequest(data);
      } else {
        console.log('Error getting transcript: ', responseText);
      }
    }
  };
  xhr.send();
}

function handleTranscriptRequest(results) {
  for (var i = 0; i !== results.length; ++i) {
    var video = results[i];
    videos[videoId] = {
      currentTime: 0,
      id: videoId,
      startTimes: []
    };

    var h1 = document.createElement('h1');
    h1.textContent = video.title;
    containerDiv.appendChild(h1);

    if (video.speakers) {
      var h2 = document.createElement('h2');
      h2.textContent = video.speakers.join(', ');
      containerDiv.appendChild(h2);
    }
    var iframe = document.createElement('iframe');
    let iframeId = 'yt' + videoId;
    iframe.id = iframeId;
    iframe.src = 'http://www.youtube.com/embed/' +
    videoId + '?enablejsapi=1&html5=1';
    iframe.classList.add('youtube-player');
    iframe.height = 270;
    iframe.width = 480;
    containerDiv.appendChild(iframe);

    iframe.onload = handleIframeLoad.bind(undefined, videos[videoId], iframeId);

    if (video.transcript) {
      var transcript = document.createElement('div');
      transcript.id = 'transcript_' + videoId;
      transcript.classList.add('transcript');
      transcript.innerHTML = video.transcript;
      containerDiv.appendChild(transcript);
      var spans = transcript.querySelectorAll('span[data-start]');
      for (var j = 0; j !== spans.length; ++j) {
        addTranscriptClickHandler(spans[j], videoId);
        videos[videoId].startTimes.push(spans[j].title); // title is start time
      }
    } else {
      var p = document.createElement('p');
      p.textContent = 'No transcript for video ID ' + videoId;
      containerDiv.appendChild(p);
    }
  }
}

function handleIframeLoad(video, iframeId) {
  /* globals YT */
  var player = new YT.Player(iframeId, {
    // events: {
    //   'onReady': function(event) {
    //     console.log('>>>>> ready: ', event, iframeId);
    //   },
    //   'onStateChange': function(event) {
    //     console.log('>>>>> stae change: ', event);
    //   }
    // }
  });
  player.time = 0;
  video.player = player;
  // TODO: something better — seems to need setup time :^\
  setTimeout(function() {
    initPolling(video);
  }, 1000);
}

// function onYouTubeIframeAPIReady() {
//   console.log('>>>>>>>> ready');
// }

function initPolling(video) {
  var player = video.player;
  var startTimes = video.startTimes;
  setInterval(function() {
    var currentTime = player.getCurrentTime();
    if (video.currentTime === currentTime) {
      return;
    }
    video.currentTime = currentTime;
    for (var i = 0; i !== startTimes.length; ++i) {
      if (startTimes[i] <= currentTime && startTimes[i + 1] > currentTime) {
        if (video.currentSpan) {
          video.currentSpan.classList.remove('current');
        }
        var transcript = document.getElementById('transcript_' + video.id);
        var selector = 'span[data-start="' + startTimes[i] + '"]';
        video.currentSpan = transcript.querySelector(selector);
        video.currentSpan.classList.add('current');
      }
    }
  }, 100);
}

function addTranscriptClickHandler(span) {
  var start = span.getAttribute('data-start');
  span.title = start;
  span.onclick = function() {
    videos[videoId].player.seekTo(Math.round(start));
      // tellPlayer(iframe, 'seekTo', [start]);
      // tellPlayer(iframe, 'playVideo');
  };
}
