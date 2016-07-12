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

var constraints;
var imageCapture;

var grabFrameButton = document.querySelector('button#grabFrame');
var takePhotoButton = document.querySelector('button#takePhoto');

var canvas = document.querySelector('canvas');
var img = document.querySelector('img');
var video = document.querySelector('video');
var videoSelect = document.querySelector('select#videoSource');
var zoomInput = document.querySelector('input#zoom');

grabFrameButton.onclick = grabFrame;
takePhotoButton.onclick = takePhoto;
videoSelect.onchange = getVideo;
zoomInput.oninput = setZoom;

navigator.mediaDevices.enumerateDevices().then(gotDevices).
catch(function(error) {
  console.log('Error getting devices: ', error);
});

getVideo();

function getVideo() {
  // if (window.stream) {
  //   window.stream.getTracks().forEach(function(track) {
  //     track.stop();
  //   });
  // }
  var videoSource = videoSelect.value;
  constraints = {
    audio: false,
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  navigator.mediaDevices.getUserMedia(constraints).
    then(gotStream).then(gotDevices).catch(function(error) {
      console.log('getUserMedia error: ', error);
    });
}

function gotDevices(deviceInfos) {
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    var option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
      videoSelect.appendChild(option);
    } else {
      console.log('Some other kind of source/device: ', deviceInfo);
    }
  }
}

function gotStream(stream) {
  console.log('getUserMedia() got stream: ', stream);
  window.stream = stream; // global scope visible in browser console
  if (window.URL) {
    video.src = window.URL.createObjectURL(stream);
    video.classList.remove('hidden');
  } else {
    video.src = stream;
  }

  imageCapture = window.imageCapture =
  new ImageCapture(stream.getVideoTracks()[0]);

  setTimeout(getCapabilities, 100);
}

function getCapabilities() {
  imageCapture.getPhotoCapabilities().then(function(capabilities) {
    console.log('Camera capabilitities:', capabilities);
    if (capabilities.zoom.max > 0) {
      zoomInput.min = capabilities.zoom.min;
      zoomInput.max = capabilities.zoom.max;
      zoomInput.value = capabilities.zoom.current;
      zoomInput.classList.remove('hidden');
    }
  }).catch(function(error) {
    console.log('navigator.getUserMedia error: ', error);
  });
}

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

function setZoom() {
  imageCapture.setOptions({
    zoom: zoomInput.value
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

