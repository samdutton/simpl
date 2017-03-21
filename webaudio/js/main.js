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

/* globals AudioContext, webkitAudioContext */

// create an AudioContext
// create an audio source node
// connect it to a filter node
// connect that a gain node
// play sound!

// cope with browser differences
var context;
if (typeof AudioContext === 'function') {
  context = new AudioContext();
} else if (typeof webkitAudioContext === 'function') {
  context = new webkitAudioContext(); // eslint-disable-line new-cap
} else {
  alert('Sorry! Web Audio is not supported by this browser');
}

// use the audio element to create the source node
var audioElement = document.querySelector('audio');
var sourceNode = context.createMediaElementSource(audioElement);

// connect the source node to a filter node
var filterNode = context.createBiquadFilter();
// see https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#BiquadFilterNode-section
filterNode.type = 'highpass';
// cutoff frequency: for highpass, audio is attenuated below this frequency
filterNode.frequency.value = 10000;

sourceNode.connect(filterNode);
// connect the filter node to a gain node (to change audio volume)
var gainNode = context.createGain();
// default is 1 (no change); less than 1 means audio is attenuated
// and vice versa
gainNode.gain.value = 0.5;
filterNode.connect(gainNode);

// connect the gain node to the destination (i.e. play the sound)
gainNode.connect(context.destination);
