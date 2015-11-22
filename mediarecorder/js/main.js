'use strict';

/* globals MediaRecorder */

// This code is shamelessly stolen/adapted from
// https://rawgit.com/Miguelao/demos/master/mediarecorder.html

var mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
var mediaRecorder;
var recordedChunks = [];
var sourceBuffer;

navigator.getUserMedia = navigator.getUserMedia ||
navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraints = {
  audio: false,
  video: true
};

var gumVideo = document.querySelector('video#gum');
var recordedVideo = document.querySelector('video#recorded');
// recordedVideo.src = URL.createObjectURL(mediaSource);

var recordButton = document.querySelector('button#record');
var playButton = document.querySelector('button#play');
var downloadButton = document.querySelector('button#download');
recordButton.onclick = toggleRecording;
playButton.onclick = play;
downloadButton.onclick = download;

navigator.getUserMedia(constraints, handleGumSuccess, handleGumError);

function handleSourceOpen(event) {
  console.log('MediaSource opened');
  sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
  console.log('Source buffer: ', sourceBuffer);
}

function handleGumSuccess(stream) {
  console.log('getUserMedia() got stream: ', stream);
  window.stream = stream; // make available to browser console
  if (window.URL) {
    gumVideo.src = window.URL.createObjectURL(stream);
  } else {
    gumVideo.src = stream;
  }
}

function handleGumError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function handleDataAvailable(event) {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
    console.assert(mediaRecorder.state === 'recording',
      'State should be "recording"');
  } else {
    console.assert(mediaRecorder.state === 'inactive',
      'State should be "inactive"');
  }
}

function toggleRecording() {
  if (recordButton.textContent === 'Start Recording') {
    startRecording();
    recordButton.textContent = 'Stop Recording';
    playButton.disabled = true;
    downloadButton.disabled = true;
  } else {
    stopRecording();
    recordButton.textContent = 'Start Recording';
    playButton.disabled = false;
    downloadButton.disabled = false;
  }
}

function startRecording() {
  try {
    mediaRecorder = new MediaRecorder(window.stream, 'video/vp8');
    mediaRecorder.onstop = function(event) {
      console.log('Recorder stopped: ', event);
    };
  } catch (event) {
    alert('MediaRecorder is not supported by this browser.\n\n ' +
      'Please try Chrome 47 or later.');
    console.error('Exception while creating MediaRecorder:', event);
    return;
  }
  console.assert(mediaRecorder.state === 'inactive');
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
  console.assert(mediaRecorder.state === 'recording');
}

function stopRecording() {
  mediaRecorder.stop();
  // window.stream.getVideoTracks()[0].stop();
}

function play() {
  // sourceBuffer.appendBuffer(recordedChunks); // or...
  var superBuffer = new Blob(recordedChunks);
  recordedVideo.src = window.URL.createObjectURL(superBuffer);
}

function download() {
  var blob = new Blob(recordedChunks, {type: 'video/webm'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = 'test.webm';
  a.click();
  window.URL.revokeObjectURL(url);
}
