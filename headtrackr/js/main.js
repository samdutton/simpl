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

/* globals headtrackr */

// This code is adapted from the headtrackr.js example:
// github.com/auduno/headtrackr

var videoInput = document.getElementById('inputVideo');
var canvasInput = document.createElement('canvas'); // not displayed
var canvasOverlay = document.getElementById('overlay');

var videoWidth = videoInput.offsetWidth;
var videoHeight = videoInput.offsetHeight;
window.onresize = function() {
  videoWidth = videoInput.offsetWidth;
  videoHeight = videoInput.offsetHeight;
  canvasInput.width = videoWidth;
  canvasInput.height = videoHeight;
  canvasOverlay.width = videoWidth;
  canvasOverlay.height = videoHeight;
};

canvasInput.width = videoWidth;
canvasInput.height = videoHeight;
canvasOverlay.width = videoWidth;
canvasOverlay.height = videoHeight;
var overlayContext = canvasOverlay.getContext('2d');

var dataDiv = document.getElementById('data');

function log(message) {
  dataDiv.innerHTML = message;
}

var statusMessages = {
  'whitebalance': 'Checking for stability of camera whitebalance...',
  'detecting': 'Detecting face...',
  'hints': 'Hmmm... Detecting the face is taking a long time.',
  'redetecting': 'Lost track of face, redetecting...',
  'lost': 'Lost track of face :^{.',
  'found': 'Tracking face!'
};

var supportMessages = {
  'no getUserMedia': 'getUserMedia is not supported by your browser',
  'no camera': 'No camera found. Using fallback video for facedetection.'
};

function handleheadtrackrStatusEvent(event) {
  if (event.status in supportMessages) {
    log(supportMessages[event.status]);
  } else if (event.status in statusMessages) {
    log(statusMessages[event.status]);
  }
}

function handleFaceTrackingEvent() {
  overlayContext.clearRect(0, 0, videoWidth, videoHeight);
  // once we have stable tracking, draw rectangle
  if (event.detection === 'CS') {
    overlayContext.translate(event.x, event.y);
    overlayContext.rotate(event.angle - (Math.PI / 2));
    overlayContext.strokeStyle = '#00CC00';
    overlayContext.strokeRect((-(event.width / 2)) >> 0,
        (-(event.height / 2)) >> 0, event.width, event.height);
    overlayContext.rotate((Math.PI / 2) - event.angle);
    overlayContext.translate(-event.x, -event.y);
  }
}

var n = 0;
// requires headPosition : true in Tracker constructor
function handleHeadTrackingEvent(e) {
  console.log('headtrackingEvent: ', n, e.x, e.y, e.z);
  ++n;
}

var htracker = new headtrackr.Tracker({
  calcAngles: true,
  ui: false,
  headPosition: true // whether to calculate the head position
});
document.addEventListener('facetrackingEvent', handleFaceTrackingEvent);
// requires headPosition : true in Tracker constructor
document.addEventListener('headtrackingEvent', handleHeadTrackingEvent);
document.addEventListener('headtrackrStatus', handleheadtrackrStatusEvent,
    true);
htracker.init(videoInput, canvasInput);
htracker.start();
