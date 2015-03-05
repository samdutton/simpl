'use strict';

var container = document.querySelector('div#container');
var smallVideo = document.querySelector('video#small');
var largeVideo = document.querySelector('video#large');

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraints = {
  video: {
    mandatory: {
      minWidth: 1280,
      minHeight: 720
    }
  }
};

function successCallback(stream) {
  window.stream = stream; // stream available to console
  if (window.URL) {
    largeVideo.src = window.URL.createObjectURL(stream);
    smallVideo.src = window.URL.createObjectURL(stream);
  } else {
    largeVideo.src = stream;
    smallVideo.src = stream;
  }
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.getUserMedia(constraints, successCallback, errorCallback);

// To cope with sizing glitches
window.onresize = window.onorientationchange = function() {
  container.classList.add('hidden');
  container.style.display = 'none';
  setTimeout(function() {
    container.style.display = 'inline-block';
  }, 1);
  setTimeout(function() {
    container.classList.remove('hidden');
  }, 500);
};
