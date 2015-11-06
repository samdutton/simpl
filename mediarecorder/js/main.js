'use strict';

/* globals MediaRecorder */

// This code is shamelessly stelen from https://rawgit.com/Miguelao/demos/master/mediarecorder.html

// Idea from: http://codepen.io/anon/pen/gpmPzm?editors=101, stuff received
// data in |chunks|, then blobify it and plug the result in a <video>.
//
// The alternative is, e.g. [1, 2], using MediaSource where we basically pass
// recorded chunks one by one into a MediaSource associated to a <video>.
// MediaRecorder supposedly produces BlobEvents and Blobs are not friendly to
// MediaSource-SourceBuffer, so there's an Experimental CL sending stuff as
// an Uint8ArrayEvent.
//
// [1] http://html5-demos.appspot.com/static/media-source.html
// [2] https://github.com/html5rocks/www.html5rocks.com/blob/master/content/tutorials/streaming/multimedia/en/index.md

var recordedChunks = [];

var mediaSource = new MediaSource();
var sourceBuffer;

function mediaSourceOpened(e) {
  console.log('MediaSource opened correctly');
  sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
}
mediaSource.addEventListener('sourceopen', mediaSourceOpened, false);

createVideoTag('localview', 80, 60, '');
createVideoTag('video', 320, 240, mediaSource);
document.body.appendChild(document.createElement('br'));

function getUserMediaOkCallback(stream) {
  console.log('getUserMedia succeeded :)');
  theStream = stream;
  document.getElementById('localview').src = URL.createObjectURL(stream);
  createButton('btn2', 'Stop recording and play back',
    stopStreamsAndPlaybackData);
  createButton('btn3', 'Stop recording and download data',
    'stopStreamsAndDownloadData');

  try {
    recorder = new MediaRecorder(stream, 'video/vp8');
  } catch (e) {
    console.assert(false, 'Exception while creating MediaRecorder: ' + e);
    return;
  }
  console.assert(recorder.state == 'inactive');
  recorder.ondataavailable = recorderOnDataAvailable;
  recorder.onstop = recorderOnStop;
  recorder.start();
  console.log('Recorder is started');
  console.assert(recorder.state == 'recording');
}

function recorderOnDataAvailable(event) {
  if (event) {
    console.assert(event.data.size > 0, 'Recorded data size should be > 0');
    if (event.data.size > 0) {
      console.assert(recorder.state == 'recording',
        'State should be "recording"');
    } else {
      console.assert(recorder.state == 'inactive',
        'State should be "inactive"');
    }
  }

  recordedChunks.push(event.data);
}

function saveByteArray(data, name) {
  var blob = new Blob(data, {
    type: 'video/webm'
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function stopStreamsAndPlaybackData() {
  document.getElementById('btn').disabled = true;
  document.getElementById('btn2').disabled = true;
  console.log('Stopping record and starting playback');
  recorder.stop();
  theStream.getVideoTracks()[0].stop();

  // sourceBuffer.appendBuffer(recordedChunks);
  // Or...
  var superBuffer = new Blob(recordedChunks);
  document.getElementById('video').src =
  window.URL.createObjectURL(superBuffer);
}

function stopStreamsAndDownloadData() {
  document.getElementById('btn').disabled = true;
  document.getElementById('btn2').disabled = true;
  console.log('Stopping record and starting playback');
  recorder.stop();
  theStream.getVideoTracks()[0].stop();

  saveByteArray(recordedChunks, 'test.webm')();
}

createButton('btn', 'Start playback', makeGetStreamX(320, 240, 'btn',
  getUserMediaOkCallback));
