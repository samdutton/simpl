var chromeVideo = document.getElementById("chrome");
var containerDiv = document.getElementById("container");

chromeVideo.addEventListener('gesturedoubletap', function(){
  if (this.classList.contains("transparent")) {
    console.log("showing video");
    containerDiv.style.backgroundImage = "none";
    this.classList.remove("transparent");
    this.play();
  } else {
    console.log("hiding video");
    containerDiv.style.backgroundImage = "url(images/curtains.jpg)";
    this.classList.add("transparent");
    this.pause();
  }
}, false);

var video1 = document.getElementById("video1");
var video2 = document.getElementById("video2");

function addEventListeners(video) {
  video.addEventListener('gesturedoubletap', handleDoubleTap, false);
  video.addEventListener('pointerdown', handlePointerDown, false);
  video.addEventListener('pointerup', handlePointerUp, false);
  video.addEventListener('pointermove', handlePointerMove, false);
}
addEventListeners(video1);
addEventListeners(video2);

function handleDoubleTap(event){
  var video = event.srcElement;
  video.classList.remove("rotateOut");
  setTimeout(function(){video.classList.add("rotateOut")}, 5);
  event.preventDefault();
}

var isPointerDown = false;

function handlePointerDown(event){
  isPointerDown = true;
  var video = event.srcElement;
  video.style.opacity = 0.7;
  video.style.webkitFilter = "blur(3px) grayscale(1)";
  video.style.zIndex = video.style.zIndex + 1;
  event.preventDefault();
}

function handlePointerUp(event){
  isPointerDown = false;
  var video = event.srcElement;
  video.style.opacity = 1;
  video.style.webkitFilter = "blur(0px)";
  event.preventDefault();
}

function handlePointerMove(event){
  if (!isPointerDown) {
    return;
  }
  var video = event.srcElement;
  var videoWidth = video.clientWidth;
  var videoHeight = video.clientHeight;
  var pointer = event.getPointerList()[0];

  video.style.left = (pointer.clientX - videoWidth / 2) + "px";
  video.style.top = (pointer.clientY - videoWidth / 2) + "px";

  event.preventDefault();
}
