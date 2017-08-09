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

var dimensions = document.querySelector('p#dimensions');

var constraints = {
  video: {
    width: {exact: 1920},
    height: {exact: 1080},
    facingMode: {exact: 'environment'}
  }
};

var video = document.querySelector('video');

function handleSuccess(stream) {
  window.stream = stream; // stream available to console
  video.src = window.URL.createObjectURL(stream);
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(constraints).
  then(handleSuccess).catch(handleError);

video.onplay = function() {
  dimensions.textContent = 'Actual video dimensions: ' + video.videoWidth +
  'x' + video.videoHeight + 'px.';
};
