navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;

var stream;
var n = navigator.getUserMedia({audio: true}, function(localMediaStream) {
  window.stream = localMediaStream;
  var audioElement = document.querySelector("audio");
  try {
    audioElement.src = window.URL.createObjectURL(localMediaStream);
  } catch(e) {
    try {
      audioElement.mozSrcObject = localMediaStream;
      audioElement.play();
    } catch(e){
      console.log("Error setting video src: ", e);
    }
  }
}, function(error) {
  console.log("navigator.getUserMedia error: ", error);
});

console.log(n);

