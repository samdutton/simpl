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

// For testing
var baseUrl = location.host === 'localhost' ?
'http://localhost:8080' : 'https://www.shearch.me';

var infoElement = document.getElementById('info');
var nextPageElement = document.getElementById('nextPage');
var previousPageElement = document.getElementById('previousPage');
var queryInfoElement = document.getElementById('queryInfo');
var resultsElement = document.getElementById('results');

var form = document.querySelector('form');
var qInput = document.querySelector('#q input');
var searchOptionsDetails = document.getElementById('searchOptions');
var valueInputs = document.querySelectorAll('#values input');
var quantityInputs = document.querySelectorAll('#quantities input');
var speakerInput = document.getElementById('speaker');

var orderByFieldSelector = document.getElementById('orderByField');
var lessOrMoreSelector = document.getElementById('lessOrMore');

var stopWords = ['and', 'are', 'but', 'for', 'into', 'not', 'such', 'that',
  'the', 'their', 'then', 'there', 'these', 'they', 'this', 'was', 'will',
  'with'];

var transcriptStyle = '<style>' +
'* {font-family: Roboto, sans-serif}\n' +
'a {color: #77aaff}\n' +
'a.video {border-bottom: 1px dotted #ddd; display: block; ' +
'font-family: Roboto Condensed; margin:0 0 1.5em 0; padding: 0 0 2em 0}\n' +
'body {padding: 2em}\n' +
'div.container {margin: auto; max-width: 42em; width: 100%;}\n' +
'h1 {font-family: Roboto Condensed, sans-serif; font-size: 1.5em}\n' +
'h2 {color: #666; font-family: Roboto Condensed; font-size: 1.2em;}\n' +
'p {color: #444; font-family: Roboto; font-weight: 200; ' +
'line-height: 1.7em; margin: 0; text-indent: 1.5em;}\n' +
'p.speaker {margin: 1em 0 0 0; text-indent: 0;}\n' +
'div#transcript > p:first-child {text-indent: 0;}\n' +
'span.speaker {color: black; font-weight: 900;}\n' +
'</style>\n\n';

var googleTranslate = '<div id="google_translate_element"></div><script>function googleTranslateElementInit() {new google.translate.TranslateElement({pageLanguage: \'en\', layout: google.translate.TranslateElement.InlineLayout.SIMPLE, gaTrack: true, gaId: \'UA-33848682-1\'}, \'google_translate_element\');}; console.log(\'>>>>>>>>>fooo\');</script><script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>';

var startTime;

var currentQuery;
var currentPage = 0;
var bookmark;
var bookmarks = ['']; // empty bookmark to get to first page of results

nextPageElement.onclick = showNextPage;
previousPageElement.onclick = showPreviousPage;
form.onsubmit = buildQueryString;

var search = location.search;
if (search) {
  var matches = search.match(/(q|query)=([^&?\/]+)/);
  if (matches) {
    if (/q|query/.test(matches[1])) {
      qInput.value = matches[2];
      buildQueryString();
    }
  }
}

// Remove qInput value whenever text is entered in a value input
for (var vi = 0; vi !== valueInputs.length; ++vi) {
  valueInputs[vi].onkeydown = handleValueInputKeyDown;
}

function handleValueInputKeyDown() {
  qInput.value = '';
}

// Remove value inputs values whenever text is entered in qInput
qInput.onkeydown = function() {
  for (var i = 0; i !== valueInputs.length; ++i) {
    valueInputs[i].value = '';
  }
  for (i = 0; i !== quantityInputs.length; ++i) {
    quantityInputs[i].value = '';
  }
};

// // Submit query when return is pressed
// for (var i = 0; i !== inputs.length; ++i) {
//   inputs[i].onkeydown = handleInputKeyDown;
// }

// function handleInputKeyDown(event) {
//   if (event.keyCode === 13) {
// //    buildQueryString();
//   }
// }

function buildQueryString() {
  if (!form.checkValidity()) {
    return false; // stop form submission;
  }
  // setSearchEnabled(false);
  currentPage = 0;
  var queries = [];
  currentQuery = '';

  // TODO: add check for qInput and all value inputs
  if (qInput.value !== '') {
    if (qInput.value.length < 3) {
      displayInfo('Please enter a longer query.');
      qInput.focus();
      return;
    } else if (stopWords.indexOf(qInput.value) !== -1) {
      displayInfo('You entered a \'stop word\': a word excluded from search ' +
        'indexing. Try something else.');
      qInput.focus();
      return false;
    } else {
      queries.push('q=' + qInput.value);
    }
  }
  for (var i = 0; i !== valueInputs.length; ++i) {
    var valueInput = valueInputs[i];
    if (valueInput.value !== '') {
      queries.push(valueInput.id + '=' + valueInput.value);
    }
  }
  for (i = 0; i !== quantityInputs.length; ++i) {
    var quantityInput = quantityInputs[i];
    if (quantityInput.value !== '') {
      var operator = document.getElementById(quantityInput.id + 'Operator');
      queries.push(quantityInput.id + operator.value + quantityInput.value);
    }
  }

  currentQuery = queries.join('&'); // global, used by showNextPage()

  console.log('>>>>> currentQuery: ' + currentQuery);

  if (currentQuery === '') {
    displayInfo('Please enter something to search for.');
    qInput.focus();
  } else {
    queryDatabase(currentQuery);
  }
  return false; // stop form submission
}

function queryDatabase(query) {
  //  if (!/[<>]/.test(query)) { // add ordering if not doing quantity match
  query += '&sort=' + lessOrMoreSelector.value +
    orderByFieldSelector.value;
  // }
  console.log('>>>>> query: ' + query);
  startTime = window.performance.now();
  displayInfo('Searching...');
  resultsElement.textContent = '';
  hideNextPrevious();

  var url = baseUrl + '?' + query;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      var responseText = xhr.responseText;
      if (xhr.status === 200) {
        var data = JSON.parse(responseText);
        handleDatabaseResponse(data);
      } else {
        console.log('Error getting data: ', responseText);
        // setSearchEnabled(true);
      }
    }
  };
  xhr.send();

  // waiting for Firefox 39

  // fetch(url).then(function(response) {
  //   if (response.status !== 200) {
  //     console.error('Problematic response status: ' + response.status);
  //     return;se
  //   response.json().then(function(data) {
  //     console.log('>>>>>> data: ', data);
  //     handleDatabaseResponse(data);
  //   });
  // }).catch(function(error) {
  //   console.error('Caught fetch() error: ', error);
  // });
}

function handleDatabaseResponse(response) {
  //  setSearchEnabled(true);
  resultsElement.textContent = '';

  var elapsed = Math.round(window.performance.now() - startTime) / 1000;
  var start = currentPage * response.resultsPerPage + 1;
  var end = (currentPage + 1) * response.resultsPerPage;

  if (end > response.totalResults) {
    end = response.totalResults;
  }

  if (response.totalResults === 0) {
    displayInfo('No matches :^\\');
    queryInfoElement.textContent = '';
    return;
  }

  displayInfo('Showing ' + start + ' to ' + end + ' of ' +
    response.totalResults + ' matching video(s) in ' + elapsed + 's');
  queryInfoElement.textContent =
  'Click on a match or caption to view video';

  var videos = response.videos;

  for (var i = 0; i !== videos.length; ++i) {
    var video = videos[i];
    var videoDiv = document.createElement('div');
    videoDiv.classList.add('video');
    addVideoDetails(videoDiv, video);
    if (video.captions) {
      addMatchesDetails(videoDiv, video);
    }
    if (video.transcript) {
      addTranscriptDetails(videoDiv, video);
    }
    if (!video.captions && !video.transcript) {
      var noCaptionsDiv = document.createElement('div');
      noCaptionsDiv.classList.add('noCaptions');
      noCaptionsDiv.textContent = 'No captions.';
      videoDiv.appendChild(noCaptionsDiv);
    }
    resultsElement.appendChild(videoDiv);
  }

  bookmark = response.bookmark; // global, used by showNextPage()
  if (bookmark && bookmarks.indexOf(bookmark) === -1) {
    bookmarks.push(bookmark);
  }

  // Cloudant responds with a bookmark even if there is no next page :(
  // if there is a next page, videos.length must equal response.resultsPerPage
  if (bookmark && videos.length === response.resultsPerPage) {
    nextPageElement.classList.remove('hidden');
  } else {
    nextPageElement.classList.add('hidden');
  }
  if (currentPage === 0) {
    previousPageElement.classList.add('hidden');
  } else {
    previousPageElement.classList.remove('hidden');
  }
}

function showNextPage() {
  hideNextPrevious();
  queryDatabase(currentQuery + '&bookmark=' + bookmark);
  currentPage++;
}

function showPreviousPage() {
  hideNextPrevious();
  var query = currentPage > 1 ? currentQuery + '&bookmark=' +
  bookmarks[currentPage - 1] : currentQuery;
  queryDatabase(query);
  currentPage--;
}

// create a new details element and add video information
function addVideoDetails(videoDiv, video) {
  var h2 = document.createElement('h2');

  h2.innerHTML = video.title;
  videoDiv.appendChild(h2);

  if (video.speakers) {
    var speakersDiv = document.createElement('div');
    speakersDiv.classList.add('speakers');
    speakersDiv.innerHTML = video.speakers.map(spaceToNonBreaking).
    map(addSpeakerSpanTags).
    join(', ');
    var spans = speakersDiv.querySelectorAll('span');
    for (var i = 0; i !== spans.length; ++i) {
      spans[i].onclick = handleSpeakerClick;
    }
    videoDiv.appendChild(speakersDiv);
  }

  var details = document.createElement('details');
  details.title = 'Click to view video';
  details.id = 'details_' + video.id;
  var summary = document.createElement('summary');
  summary.classList.add('video');
  summary.textContent = 'Video';
  details.appendChild(summary);

  var iframe = document.createElement('iframe');
  iframe.classList.add('youtube-player');
  iframe.id = 'iframe_' + video.id;
  iframe.height = 270;
  iframe.width = 480;
  details.appendChild(iframe);
  details.ontoggle = function() {
    if (iframe.src === '') {
      iframe.src = 'http://www.youtube.com/embed/' + video.id +
      '?enablejsapi=1';
    }
    if (!this.open) {
      tellPlayer(iframe, 'pauseVideo');
    }
  };

  // var videoThumbnail = new Image();
  // videoThumbnail.classList.add('videoThumbnail');
  // videoThumbnail.title = 'Click to view video';
  // videoThumbnail.src = 'http://img.youtube.com/vi/' + video.id +
  //   '/hqdefault.jpg';
  // addClickHandler(videoThumbnail, video.id, 0);
  // details.appendChild(videoThumbnail);

  if (video.description) {
    var descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description');
    descriptionDiv.innerHTML = video.description;
    details.appendChild(descriptionDiv);
  }

  var likeCountDiv = document.createElement('div');
  likeCountDiv.classList.add('count');
  likeCountDiv.innerHTML = '<strong>Likes: </strong>' +
  video.likeCount.toLocaleString();
  details.appendChild(likeCountDiv);

  var dislikeCountDiv = document.createElement('div');
  dislikeCountDiv.classList.add('count');
  dislikeCountDiv.innerHTML = '<strong>Dislikes: </strong>' +
  video.dislikeCount.toLocaleString();
  details.appendChild(dislikeCountDiv);

  // comments are disabled for some videos
  if (video.commentCount) {
    var commentCountDiv = document.createElement('div');
    commentCountDiv.classList.add('count');
    commentCountDiv.innerHTML = '<strong>Comments: </strong>' +
    video.commentCount.toLocaleString();
    details.appendChild(commentCountDiv);
  }

  var viewCountDiv = document.createElement('div');
  viewCountDiv.classList.add('count');
  viewCountDiv.innerHTML = '<strong>View count: </strong>' +
  video.viewCount.toLocaleString();
  details.appendChild(viewCountDiv);

  var publishedAtDiv = document.createElement('div');
  publishedAtDiv.classList.add('publishedAt');
  var publishedAt = new Date(video.publishedAt).toDateString();
  publishedAtDiv.innerHTML = '<strong>Published: </strong>' + publishedAt;
  details.appendChild(publishedAtDiv);

  videoDiv.appendChild(details);
}

function handleSpeakerClick(event) {
  form.reset();
  var speaker = event.target.textContent;
  speakerInput.value = speaker;
  speakerInput.removeAttribute('pattern'); // to cope with form validation ?bug
  searchOptionsDetails.open = true;
  queryDatabase('speaker=' + speaker);
}

// Wrap span tags around speaker names, with a title
function addSpeakerSpanTags(item) {
  return '<span title="Click to find videos featuring ' + item + '">' +
  item + '</span>';
}

function addMatchesDetails(videoDiv, video) {
  var matchesDetails = document.createElement('details');
  matchesDetails.classList.add('matches');
  var summary = document.createElement('summary');
  summary.textContent = 'Matching captions';
  summary.title = 'Click a caption to view video';
  matchesDetails.appendChild(summary);

  for (var i = 0; i !== video.captions.length; ++i) {
    var caption = video.captions[i];
    var start = caption.match(/data-start="([\d\.]+)"/)[1];
    var hms = toHoursMinutesSeconds(start);
    var captionDiv = document.createElement('div');
    var startSpan = '<span class="start">' + hms + '</span>';
    captionDiv.innerHTML = startSpan + caption;
    addClickHandler(captionDiv, video.id, start);
    matchesDetails.appendChild(captionDiv);
  }

  videoDiv.appendChild(matchesDetails);
}

function addTranscriptDetails(videoDiv, video) {
  var details = document.createElement('details');
  details.classList.add('transcript');
  var summary = document.createElement('summary');
  summary.classList.add('transcript');
  summary.title = 'Click to view transcript';
  summary.textContent = 'Transcript';
  details.appendChild(summary);

  var transcriptDiv = document.createElement('div');
  details.appendChild(transcriptDiv);

  var downloadLink = document.createElement('a');
  downloadLink.classList.add('download');
  downloadLink.download = video.title.replace(/ /g, '_').
  replace(/&mdash;/, '-') + '.html';
  downloadLink.textContent = 'download';
  videoDiv.appendChild(downloadLink);

  videoDiv.appendChild(details);

  transcriptDiv.innerHTML = video.transcript;
  var spans = transcriptDiv.querySelectorAll('span[data-start]');
  for (var i = 0; i !== spans.length; ++i) {
    var span = spans[i];
    span.title = toHoursMinutesSeconds(span.getAttribute('data-start'));
    if (!span.onclick) {
      addClickHandler(span, video.id,
        span.dataset.start);
    }
  }

  var downloadHTML = transcriptStyle + '<div class="container">' +
  googleTranslate + '<h1>' + video.title + '</h1>\n\n';
  if (video.speakers) {
    downloadHTML += '<h2>' + video.speakers.join(', ') + '</h2>\n\n';
  }
  downloadHTML += '<a class="video" href="http://youtu.be/' +
  video.id + '">youtu.be/' + video.id + '</a>' +
  '<div id="transcript">' + video.transcript + '</div></div>';

  downloadLink.href = 'data:text/plain;charset=utf-8,' +
  encodeURIComponent(downloadHTML);
}

function addClickHandler(element, videoId, start) {
  element.onclick = function() {
    var iframes = document.querySelectorAll('iframe');
    for (var i = 0; i !== iframes.length; ++i) {
      tellPlayer(iframes[i], 'pauseVideo');
    }
    document.getElementById('details_' + videoId).open = true;
    start = Math.round(start); // has to be integer :(
    var iframe = document.getElementById('iframe_' + videoId);
    // iframe src isn't set until details.video is opened
    if (iframe.src === '') {
      iframe.src = 'http://www.youtube.com/embed/' + videoId +
      '?enablejsapi=1&start=' + start + '&autoplay=1';
    } else {
      tellPlayer(iframe, 'seekTo', [start]);
      tellPlayer(iframe, 'playVideo');
    }
  };
}

function hideNextPrevious() {
  nextPageElement.classList.add('hidden');
  previousPageElement.classList.add('hidden');
}

// Utility functions

function spaceToNonBreaking(item) {
  return item.replace(/ /gm, '&nbsp;');
}

function tellPlayer(iframe, func, args) {
  iframe.contentWindow.postMessage(JSON.stringify({
    event: 'command',
    func: func,
    args: args
  }), '*');
}

function displayInfo(message) {
  infoElement.textContent = message;
}

// function setSearchEnabled(isEnabled) {
//   // document.querySelector('*').style.cursor = isEnabled ? '' : 'wait';
//   // searchButton.disabled = isEnabled ? false : true;
// }

function toHoursMinutesSeconds(decimalSeconds) {
  var hours = Math.floor(decimalSeconds / 3600);
  var mins = Math.floor((decimalSeconds - hours * 3600) / 60);
  var secs = Math.floor(decimalSeconds % 60);
  if (secs < 10) {
    secs = '0' + secs;
  }
  return hours + ':' + mins + ':' + secs;
}
