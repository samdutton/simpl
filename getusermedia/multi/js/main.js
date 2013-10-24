var qvgaVideo = document.querySelector("video#qvga");
var hdVideo = document.querySelector("video#hd");

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var qvgaConstraints  = {
  video: {
    mandatory: {
      maxWidth: 320,
      maxHeight: 180
    }
  }
};

// var vgaConstraints  = {
//   video: {
//     mandatory: {
//       maxWidth: 640,
//       maxHeight: 360
//     }
//   }
// };

var hdConstraints  = {
  video: {
    mandatory: {
      minWidth: 1280,
      minHeight: 720
    }
  }
};

function errorCallback(error){
  console.log("navigator.getUserMedia error: ", error);
}

navigator.getUserMedia(qvgaConstraints, function(stream){
  qvgaVideo.src = window.URL.createObjectURL(stream);
  qvgaVideo.play();
}, errorCallback);

navigator.getUserMedia(hdConstraints, function(stream){
  hdVideo.src = window.URL.createObjectURL(stream);
  hdVideo.play();
}, errorCallback);

