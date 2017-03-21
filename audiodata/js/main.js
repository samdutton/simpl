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

var mediaElement = document.getElementById('mediaElement');
var framebufferLengthInput = document.getElementById('framebufferLengthInput');
var metadataElement = document.getElementById('metadataElement');
var eventTimeElement = document.getElementById('eventTimeElement');
var eventDataElement = document.getElementById('eventDataElement');

framebufferLengthInput.addEventListener('change',
    handleFramebufferLengthChanged, false);
mediaElement.addEventListener('loadedmetadata', handleMetadata, false);

mediaElement.addEventListener('MozAudioAvailable', handleAudioData, false);
mediaElement.addEventListener('seeked', handleSeeked, false); // play pressed

function handleFramebufferLengthChanged() {
  mediaElement.mozFrameBufferLength = framebufferLengthInput.value;
}

// called when the play button is pressed
function handleSeeked() {
  i = 1;
  eventTimeElement.innerHTML = '<p>Time</p>';
  eventDataElement.innerHTML = '<p>frameBuffer[0] data</p>';
  mediaElement.mozFrameBufferLength = framebufferLengthInput.value;
  framebufferLengthInput.value = mediaElement.mozFrameBufferLength;
}

function handleMetadata() {
  framebufferLengthInput.value = mediaElement.mozFrameBufferLength;
  metadataElement.innerHTML +=
    'mozChannels:&nbsp;' + mediaElement.mozChannels + '<br />' +
    'sampleRate:&nbsp;&nbsp;' + mediaElement.mozSampleRate + '<br />';
}

var i = 1;

function handleAudioData(event) {
  eventTimeElement.innerHTML += i + ' ' + event.time + '<br />';
  eventDataElement.innerHTML += event.frameBuffer[0].toFixed(18) + '<br />';
  i++;
}
