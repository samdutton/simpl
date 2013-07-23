navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraintsVideo = {video: true};
var constraintsAudio = {audio: true};

function successCallbackVideo(localMediaStream) {
  window.stream = localMediaStream; // stream available to console
	navigator.getUserMedia(constraintsAudio, successCallbackAudio, errorCallback);
  var video = document.querySelector("video");
  video.src = window.URL.createObjectURL(localMediaStream);
  video.play();
}

function successCallbackAudio(localMediaStream) {
	window.stream.addTrack(localMediaStream.getAudioTracks()[0]);
}

function errorCallback(error){
  console.log("navigator.getUserMedia error: ", error);
}

navigator.getUserMedia(constraintsVideo, successCallbackVideo, errorCallback);

