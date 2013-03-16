// This code is adapted from the headtrackr.js example:
// github.com/auduno/headtrackr

var videoInput = document.getElementById('inputVideo');
var canvasInput = document.createElement('canvas');
var canvasOverlay = document.getElementById('overlay')
canvasOverlay.style.position = 'absolute';
canvasOverlay.style.top = '0px';
canvasOverlay.style.zIndex = '100001';
canvasOverlay.style.display = 'block';
var overlayContext = canvasOverlay.getContext('2d');

function log(message){
  console.log(message);
}

var statusMessages = {
  'whitebalance': 'checking for stability of camera whitebalance',
  'detecting': 'Detecting face',
  'hints': 'Hmmm... Detecting the face is taking a long time',
  'redetecting': 'Lost track of face, redetecting',
  'lost': 'Lost track of face',
  'found': 'Tracking face'
};

var supportMessages = {
  'no getUserMedia': 'getUserMedia is not supported by your browser',
  'no camera': 'No camera found. Using fallback video for facedetection.'
};

function handleheadtrackrStatusEvent(event) {
  if (event.status in supportMessages) {
    log(supportMessages[event.status]);
  } else if (event.status in statusMessages) {
    log(statusMessages[event.status]);
  }
}

function handleFaceTrackingEvent(e){
  overlayContext.clearRect(0,0,320,240);
  // once we have stable tracking, draw rectangle
  if (event.detection == 'CS') {
    overlayContext.translate(event.x, event.y)
    overlayContext.rotate(event.angle-(Math.PI/2));
    overlayContext.strokeStyle = '#00CC00';
    overlayContext.strokeRect((-(event.width/2)) >> 0,
      (-(event.height/2)) >> 0, event.width, event.height);
    overlayContext.rotate((Math.PI/2)-event.angle);
    overlayContext.translate(-event.x, -event.y);
  }
}

// function handleHeadTrackingEvent(e){
//   console.log('headtrackingEvent: ', e.x, e.y, e.z);
// }

var htracker = new headtrackr.Tracker({
  calcAngles : true,
  ui : false,
  headPosition : false
});
htracker.init(videoInput, canvasInput);
htracker.start();

document.addEventListener('facetrackingEvent', handleFaceTrackingEvent);
// document.addEventListener('headtrackingEvent', handleHeadTrackingEvent);
document.addEventListener('headtrackrStatus', handleheadtrackrStatusEvent, true);

htracker.init(videoInput, canvasInput);
htracker.start();
