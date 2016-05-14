'use strict';

var video = document.querySelector('video');

var url = 'video/chrome.webm';

function getVideo(start, finish) {
  var range = 'bytes=' + start + '-' + finish;
  var options = {
    headers: {
      'Range': range
    }
  };
  fetch(url, options).then(function(response) {
    return response.blob();
  }).then(function(blob) {
    video.src = window.URL.createObjectURL(blob);
  });
}

getVideo(0, 20000);

// var options = {
//   headers: {
//     'Range': 'bytes=0-50000'
//   }
// };
