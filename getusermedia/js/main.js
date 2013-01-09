navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;

var stream;
var n = navigator.getUserMedia({audio: true, video: true}, function(localMediaStream) {
  window.stream = localMediaStream;
  var video = document.querySelector("video");
  try {
    video.src = window.URL.createObjectURL(localMediaStream);
    console.log(video.src);
  } catch(e) {
    try {
      video.mozSrcObject = localMediaStream;
      video.play();
    } catch(e){
      console.log("Error setting video src: ", e);
    }
  }
}, function(error) {
  console.log("navigator.getUserMedia error: ", error);
});

console.log(n);

