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

var video = window.video = document.querySelector('video');

var url = '../video/small.webm';

var rangeLength = 50000; // bytes
var totalBytes = 0;

getVideoHeaders();

function getVideoHeaders() {
  var options = {
    headers: {
      'method': 'HEAD'
    }
  };
  fetch(url, options).then(function(response) {
    // for (var pair of response.headers.entries()) {
    //   console.log(pair[0]+ ': '+ pair[1]);
    // }
    totalBytes = response.headers.get('content-length');
    console.log('Total bytes: ', totalBytes);
    getRanges();
  });
}

function getRanges() {
  for (var i = 1; i !== 2; ++i) {
    var rangeEnd = i * rangeLength;
    // If all the bytes have already been retrieved
    if (rangeEnd - rangeLength > totalBytes) {
      console.log('Got all bytes', rangeEnd, rangeLength, i);
      break;
    }
    getRange(rangeEnd);
  }
}

function getRange(finish) {
  var range = 'bytes=' + 0 + '-' + finish;
  console.log('range: ', range);
  var options = {
    headers: {
      'Range': range
    }
  };
  fetch(url, options).then(function(response) {
    if (totalBytes === 0) {
      totalBytes = response.headers.get('content-range').split('/')[1];
      console.log('Getting totalBytes', totalBytes);
    }
    return response.blob();
  }).then(function(blob) {
    video.src = window.URL.createObjectURL(blob);
  });
}

