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

var video = document.querySelector('video');
var data = document.querySelector('p#data');
var start = Date.now(); // for browsers that don't support window.performance

function handleEvent(e) {
  // e.timeStamp has different precision in Firefox v Chrome
  var time;
  if (window.performance) {
    time = (window.performance.now() / 1000).toFixed(6);
  } else {
    time = ((Date.now() - start) / 1000).toFixed(3);
  }
  data.innerHTML = '<span class = "time">' + time + '</span>' + 's: ' +
    e.type + '<br>' + data.innerHTML;
}

// Getting event names automatically by checking for video element
// properties such as onloadedmetadata doesn't work for Safari :(.
var events = [
  'abort',
  'autocomplete',
  'autocompleteerror',
  'beforecopy ',
  'beforecut',
  'beforepaste',
  'blur',
  'cancel',
  'canplay',
  'canplaythrough',
  'change',
  'click',
  'close',
  'contextmenu',
  'copy',
  'cuechange',
  'cut',
  'dblclick',
  'drag',
  'dragend',
  'dragenter',
  'dragleave',
  'dragover',
  'dragstart',
  'drop',
  'durationchange',
  'emptied',
  'ended',
  'error',
  'focus',
  'input',
  'invalid',
  'keydown',
  'keypress',
  'keyup',
  'load',
  'loadeddata',
  'loadedmetadata',
  'loadstart',
  'needkey',
  'paste',
  'pause',
  'play',
  'playing',
  'progress',
  'ratechange',
  'reset',
  'resize',
  'scroll',
  'search',
  'seeked',
  'seeking',
  'select',
  'selectstart',
  'show',
  'stalled',
  'submit',
  'suspend',
  'timeupdate',
  'toggle',
  'volumechange',
  'waiting',
  'webkitfullscreenchange',
  'webkitfullscreenerror',
  'webkitkeyadded',
  'webkitkeyerror',
  'webkitkeymessage',
  'webkitneedkey'
];

for (var i = 0; i !== events.length; ++i) {
  video.addEventListener(events[i], handleEvent);
}
