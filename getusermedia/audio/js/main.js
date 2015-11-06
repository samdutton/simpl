'use strict';

navigator.getUserMedia = navigator.getUserMedia ||
navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var n = navigator.getUserMedia({
  audio: true
}, function(stream) {
  window.stream = stream = stream;
  var audioElement = document.querySelector('audio');
  try {
    audioElement.src = window.URL.createObjectURL(stream);
  } catch (event0) {
    try {
      audioElement.mozSrcObject = stream;
      audioElement.play();
    } catch (event1) {
      console.log('Error setting video src: ', event1);
    }
  }
}, function(error) {
  console.log('navigator.getUserMedia error: ', error);
});

console.log(n);
