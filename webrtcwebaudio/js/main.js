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

/* globals webkitRTCPeerConnection */

// The code for this example was adapted from a demo by Henrik Andreasson.
// tweaks incorporated from rtoy

var drumSoundBuffer = 0;
var mediaStreamDestination = 0;
var pc1;
var pc2;
var voiceSound;
var voiceSoundBuffer = 0;

var audioElement = document.getElementById('audio');
var callButton = document.getElementById('call');
var hangupButton = document.getElementById('hangup');
var drumButton = document.getElementById('drum');
callButton.onclick = call;
hangupButton.onclick = hangup;
drumButton.onclick = drum;

var pauseTime = 0;

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

function trace(text) {
  if (text[text.length - 1] === '\n') {
    text = text.substring(0, text.length - 1);
  }
  if (typeof window.performance === 'object') {
    console.log((window.performance.now() / 1000).toFixed(3) + ': ' + text);
  }
}

function call() {
  callButton.disabled = true;
  hangupButton.disabled = false;
  drumButton.disabled = false;

  trace('Starting call');

  var servers = null;
  pc1 = new webkitRTCPeerConnection(servers); // eslint-disable-line new-cap
  trace('Created local peer connection object pc1');
  pc1.onicecandidate = iceCallback1;
  pc2 = new webkitRTCPeerConnection(servers); // eslint-disable-line new-cap
  trace('Created remote peer connection object pc2');
  pc2.onicecandidate = iceCallback2;
  pc2.onaddstream = gotRemoteStream;

  if (!mediaStreamDestination) {
    trace('mediaStreamDestination = context.createMediaStreamDestination();');
    mediaStreamDestination = context.createMediaStreamDestination();
  }

  pc1.addStream(mediaStreamDestination.stream);
  pc1.createOffer(gotDescription1);
}

function transform(sdp) {
  // Remove all other codecs (not the video codecs though).
  sdp = sdp.replace(/m=audio (\d+) RTP\/SAVPF.*\r\n/g,
    'm=audio $1 RTP/SAVPF 111\r\n');
  sdp = sdp.replace(/a=rtpmap:(?!111)\d{1,3} (?!VP8|red|ulpfec).*\r\n/g, '');
  return sdp;
}

function gotDescription1(desc) {
  trace('Offer from pc1 \n' + desc.sdp);
  var modifiedOffer = new RTCSessionDescription({
    type: 'offer',
    sdp: transform(desc.sdp)
  });
  pc1.setLocalDescription(modifiedOffer);
  trace('Offer from pc1 \n' + modifiedOffer.sdp);
  pc2.setRemoteDescription(modifiedOffer);
  pc2.createAnswer(gotDescription2);
}

function gotDescription2(desc) {
  pc2.setLocalDescription(desc);
  trace('Answer from pc2 \n' + desc.sdp);
  pc1.setRemoteDescription(desc);
}

function hangup() {
  trace('Ending call');
  pc1.close();
  pc2.close();
  pc1 = null;
  pc2 = null;
  callButton.disabled = true;
  hangupButton.disabled = true; // enabled when XHR completes
  drumButton.disabled = true;

  voiceSound.stop(0);
  document.location.reload(); // hack, but it works!

  // pauseTime = 0;
  // voiceSound.lastStartTime = 0;
  // mediaStreamDestination = 0;
}

function gotRemoteStream(e) {
  audioElement.src = URL.createObjectURL(e.stream);
  audioElement.addEventListener('pause', function() {
    voiceSound.stop(0);
    pauseTime += context.currentTime - voiceSound.lastStartTime;
  });
  audioElement.addEventListener('play', function() {
    console.log('play');
    // creates an AudioBufferSourceNode.
    voiceSound = context.createBufferSource();
    voiceSound.buffer = voiceSoundBuffer;
    voiceSound.connect(mediaStreamDestination);
    voiceSound.start(context.currentTime, pauseTime);
    voiceSound.lastStartTime = context.currentTime;
  });
  trace('Received remote stream');
}

function iceCallback1(event) {
  if (event.candidate) {
    pc2.addIceCandidate(new RTCIceCandidate(event.candidate));
    trace('Local ICE candidate: \n' + event.candidate.candidate);
  }
}

function iceCallback2(event) {
  if (event.candidate) {
    pc1.addIceCandidate(new RTCIceCandidate(event.candidate));
    trace('Remote ICE candidate: \n ' + event.candidate.candidate);
  }
}

function drum() {
  // creates an AudioBufferSourceNode.
  var drumSound = context.createBufferSource();
  drumSound.buffer = drumSoundBuffer;
  if (mediaStreamDestination) {
    drumSound.connect(mediaStreamDestination);
    drumSound.start(0);
  }
}

function handleKeyDown() {
  //  var keyCode = event.keyCode;
  trace('handleKeyDown()');
  // Play the drum sound to the remote peer.
  drum();
}

function loadAudioBuffer(url) {
  trace('loadAudioBuffer()');
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    // source = context.createBufferSource();
    // creates an AudioBufferSourceNode.
    context.decodeAudioData(request.response,
      function(decodedAudio) {
        voiceSoundBuffer = decodedAudio;
      },
      function() {
        alert('error decoding file data: ' + url);
      });
    callButton.disabled = false;
    document.querySelector('#gettingAudio').innerHTML = '';
  };

  request.send();
}

function loadDrumSound(url) {
  // Load asynchronously
  trace('loadDrumSound()');

  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    context.decodeAudioData(request.response,
      function(decodedAudio) {
        drumSoundBuffer = decodedAudio;
      },
      function() {
        alert('error decoding file data: ' + url);
      });
  };

  request.send();
}

function init() {
  callButton = document.getElementById('call');
  hangupButton = document.getElementById('hangup');
  drumButton = document.getElementById('drum');

  context = new AudioContext();
  loadAudioBuffer('audio/human-voice.wav');
  loadDrumSound('audio/snare.wav');
  document.addEventListener('keydown', handleKeyDown, false);
}

document.body.onload = init;
