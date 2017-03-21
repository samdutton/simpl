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

var button = document.querySelector('button');
var video = document.querySelector('video');

button.onclick = function() {
  if (video.paused) {
    video.play();
    button.textContent = 'Pause';
  } else {
    video.pause();
    button.textContent = 'Play';
  }
};

video.onplay = function() {
  button.textContent = 'Pause';
};

video.onloadedmetadata = function() {
  var fileName = this.currentSrc.replace(/^.*[\\\/]/, '');
  document.querySelector('#videoSrc').innerHTML = 'Playing video: ' + fileName;
};
