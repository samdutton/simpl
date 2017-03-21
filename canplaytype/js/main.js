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

var data = document.querySelector('p#data');

function log(message) {
  data.innerHTML += message + '<br />';
}

var mediaElement = document.createElement('video');

log('video/xyz: "' +
  mediaElement.canPlayType('video/xyz') + '"');
log('video/xyz; codecs="avc1.42E01E, mp4a.40.2": "' +
  mediaElement.canPlayType('video/xyz; codecs="avc1.42E01E, mp4a.40.2"') + '"');
log('video/xyz; codecs="nonsense, noise": "' +
  mediaElement.canPlayType('video/xyz; codecs="nonsense, noise"') + '"');
log('video/mp4; codecs="avc1.42E01E, mp4a.40.2": "' +
  mediaElement.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') + '"');
log('video/webm: "' +
  mediaElement.canPlayType('video/webm') + '"');
log('video/webm; codecs="vp8, vorbis": "' +
  mediaElement.canPlayType('video/webm; codecs="vp8, vorbis"') + '"');
