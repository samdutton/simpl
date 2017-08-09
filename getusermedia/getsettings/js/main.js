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

var constraints = {
  video: true
};

var video = document.querySelector('video');
var settingsDiv = document.querySelector('div#settings');

function handleSuccess(stream) {
  window.stream = stream; // stream available to console
  video.src = window.URL.createObjectURL(stream);
  var track = stream.getTracks()[0];
  var settings = track.getSettings ? track.getSettings() : null;
  var settingsString;
  if (settings) {
    settingsString = JSON.stringify(settings).
      replace(/,"/g,'\n').
      replace(/":/g, ': ').
      replace(/{"/g, '').
      replace(/[}]/g, '');
  } else {
    settingsString =
        'MediaStreamTrack.getSettings() is not supported by this browser :^(.';
  }
  settingsDiv.textContent = settingsString;
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(constraints).
  then(handleSuccess).catch(handleError);
