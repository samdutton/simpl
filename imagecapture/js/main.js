'use strict';

/* globals ImageCapture */

// This code is adapted from
// https://cdn.rawgit.com/Miguelao/demos/master/imagecapture.html

// window.isSecureContext could be used for Chrome
var isSecureOrigin = location.protocol === 'https:' ||
    location.host === 'localhost';
if (!isSecureOrigin) {
  alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.' +
    '\n\nChanging protocol to HTTPS');
  location.protocol = 'HTTPS';
}
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
    if (capabilities.zoom.max > 0) {
      zoomInput.min = capabilities.zoom.min;
      zoomInput.max = capabilities.zoom.max;
      zoomInput.value = capabilities.zoom.current;
      zoomInput.classList.remove('hide');
    }
  }).catch(function(error) {
    console.log('navigator.getUserMedia error: ', error);
  });
});

function grabFrame() {
  imageCapture.grabFrame().then(function(imageBitmap) {
    console.log('Grabbed frame:', imageBitmap);
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    canvas.getContext('2d').drawImage(imageBitmap, 0, 0);
    canvas.classList.remove('hidden');
  }).catch(function(error) {
    console.log('takePhoto() error: ', error);
  });
}

function takePhoto() {
  imageCapture.takePhoto().then(function(a) {
    console.log('Took photo:', a);
    img.src = URL.createObjectURL(a);
  }).catch(function(error) {
    console.log('takePhoto() error: ', error);
  });
}

