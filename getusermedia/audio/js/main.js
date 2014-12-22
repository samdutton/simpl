'use strict';

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;

var stream;
var n = navigator.getUserMedia({audio: true}, function(localMediaStream) {
  window.stream = stream = localMediaStream;
  var audioElement = document.querySelector('audio');
  try {
    audioElement.src = window.URL.createObjectURL(localMediaStream);
  } catch(event0) {
    try {
      audioElement.mozSrcObject = localMediaStream;
      audioElement.play();
    } catch(event1){
      console.log('Error setting video src: ', event1);
    }
  }
}, function(error) {
  console.log('navigator.getUserMedia error: ', error);
});

console.log(n);

