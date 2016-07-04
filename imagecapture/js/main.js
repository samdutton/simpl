'use strict';

/* globals ImageCapture */

// This code is adapted from
// https://cdn.rawgit.com/Miguelao/demos/master/imagecapture.html

var imageCapture;

var grabFrameButton = document.querySelector('button#grabFrame');
var takePhotoButton = document.querySelector('button#takePhoto');

var canvas = document.querySelector('canvas');
var img = document.querySelector('img');
var video = document.querySelector('video');
var zoomInput = document.querySelector('input#zoom');

zoomInput.oninput = function() {
  imageCapture.setOptions({
    zoom: zoomInput.value
  });
};

grabFrameButton.onclick = grabFrame;
takePhotoButton.onclick = takePhoto;

var constraints = {
  audio: false,
  video: true
};


navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
  console.log('getUserMedia() got stream: ', stream);
  window.stream = stream; // global scope visible in browser console
  if (window.URL) {
    video.src = window.URL.createObjectURL(stream);
  } else {
    video.src = stream;
  }
  imageCapture = window.imageCapture =
    new ImageCapture(stream.getVideoTracks()[0]);
  imageCapture.getPhotoCapabilities().then(function(capabilities) {
    console.log('Camera capabilitities:', capabilities);
    zoomInput.min = capabilities.zoom.min;
    zoomInput.max = capabilities.zoom.max;
    zoomInput.value = capabilities.zoom.current;
  }).catch(function(error) {
    console.log('navigator.getUserMedia error: ', error);
  });
});

function takePhoto() {
  imageCapture.takePhoto().then(function(a) {
    console.log('Took photo:', a);
    img.src = URL.createObjectURL(a);
  }).catch(function(error) {
    console.log('takePhoto() error: ', error);
  });
}

function grabFrame() {
  imageCapture.grabFrame().then(function(a) {
    console.log('Grabbed frame:', a);
    canvas.width = a.width;
    canvas.height = a.height;
    canvas.getContext('2d').drawImage(a, 0, 0);
  }).catch(function(error) {
    console.log('takePhoto() error: ', error);
  });
}
