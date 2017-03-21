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

var container = document.querySelector('div#container');
var smallVideo = document.querySelector('video#small');
var largeVideo = document.querySelector('video#large');

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraints = {
  video: {
    mandatory: {
      minWidth: 1280,
      minHeight: 720
    }
  }
};

function successCallback(stream) {
  window.stream = stream; // stream available to console
  if (window.URL) {
    largeVideo.src = window.URL.createObjectURL(stream);
    smallVideo.src = window.URL.createObjectURL(stream);
  } else {
    largeVideo.src = stream;
    smallVideo.src = stream;
  }
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.getUserMedia(constraints, successCallback, errorCallback);

// To cope with sizing glitches
window.onresize = window.onorientationchange = function() {
  container.classList.add('hidden');
  container.style.display = 'none';
  setTimeout(function() {
    container.style.display = 'inline-block';
  }, 1);
  setTimeout(function() {
    container.classList.remove('hidden');
  }, 500);
};
