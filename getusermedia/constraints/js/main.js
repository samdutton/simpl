navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;

var stream;
navigator.getUserMedia({
		video: {
      mandatory: {
        maxWidth: 360
      }
    }
 }, function(localMediaStream) {
  window.stream = localMediaStream;
  var video = document.querySelector("video");
  try {
    video.src = window.URL.createObjectURL(localMediaStream);
  } catch(e) {
    try {
      video.src = localMediaStream;
      video.play();
    } catch(e){
      console.log("Error setting video src: ", e);
    }
  }
}, function(error) {
  console.log("navigator.getUserMedia error: ", error);
});
