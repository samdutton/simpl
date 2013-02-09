navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;

navigator.getUserMedia({audio: true, video: true}, function(localMediaStream) { // remove audio for Firefox stable support
  window.stream = localMediaStream; // so stream can be inspected from the console.
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

