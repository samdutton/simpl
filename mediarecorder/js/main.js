// Spec is at http://dvcs.w3.org/hg/dap/raw-file/tip/media-stream-capture/RecordingProposal.html

// This demo is based on https://github.com/PinZhang/sample-codes/blob/master/html5/media_recording.html

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// video not implemented yet
var constraints = {audio: true, video: true};
var videoElement = document.querySelector('video');
var dataElement = document.querySelector('#data');
var downloadLink = document.querySelector('a#downloadLink');


function errorCallback(error){
  console.log("navigator.getUserMedia error: ", error);
}

var count = 0;
function startRecording(stream) {
  log('Starting...');
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = function(e) {
    log('Data available...');
    count++;
    if (count > 1) {
      return;
    }
    console.log(e);
    videoElement.src = window.URL.createObjectURL(e.data);
    // downloadLink.href = window.URL.createObjectURL(e.data);
    // downloadLink.innerHTML = "Download Ogg video file";
  };

  mediaRecorder.onerror = function(e){
    log('Error: ' + e);
    console.log('Error: ', e);
  };

  // not implemented yet
  mediaRecorder.onstart = function(e){
    log('Started');
  };

  mediaRecorder.onstop = function(e){
    log('Stopped');
  };

  mediaRecorder.onwarning = function(e){
    log('Warning: ' + e);
  };

  // parameter is number of milliseconds of data to return in a single Blob
  mediaRecorder.start(2000);

  window.setTimeout(function(){
    mediaRecorder.stop();
  }, 5000);
}

window.onload = function(){
  if (typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
    alert('Sorry! This demo requires Firefox Nightly.');
  } else {
    navigator.getUserMedia(constraints, startRecording, errorCallback);
  }
};


function log(message){
  dataElement.innerHTML = message + '<br>' + dataElement.innerHTML ;
}

