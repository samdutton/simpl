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

document.cancelFullScreen = document.webkitCancelFullScreen ||
  document.mozCancelFullScreen || document.cancelFullScreen;

document.body.requestFullScreen = document.body.webkitRequestFullScreen ||
  document.body.mozRequestFullScreen || document.body.requestFullScreen;

function displayFullScreenStatus() {
  var status = isFullScreen() ? 'Document is now full screen.' :
    'Document is currently not full screen.';
  document.querySelector('#status').innerHTML = status;
}

displayFullScreenStatus(); // on load

document.onfullscreenchange = document.onwebkitfullscreenchange =
  document.onmozfullscreenchange = displayFullScreenStatus;

function isFullScreen() {
  return !!(document.webkitIsFullScreen || document.mozFullScreen ||
    document.isFullScreen); // if any defined and true
}

function fullScreenElement() {
  return document.webkitFullScreenElement ||
      document.webkitCurrentFullScreenElement ||
      document.mozFullScreenElement || document.fullScreenElement;
}

var image = document.querySelector('img');

image.requestFullScreen = image.webkitRequestFullScreen ||
  image.mozRequestFullScreen || image.requestFullScreen;

document.body.onclick = function(e) {
  console.log(fullScreenElement());
  if ((isFullScreen() && e.target !== image) ||
    fullScreenElement() === image) {
    document.cancelFullScreen();
  } else if (e.target === image) {
    image.requestFullScreen();
  } else {
    document.body.requestFullScreen();
  }
};
