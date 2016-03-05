'use strict';


var container = document.getElementById('splitview');
var range = container.querySelector('input[type=range]');
var firstVideo = container.querySelectorAll('video')[0];
var secondVideo = container.querySelectorAll('video')[1];

var styles = getComputedStyle(document.documentElement);
var thumbWidth = parseInt(styles.getPropertyValue('--thumb-width'));

firstVideo.onloadedmetadata = window.onresize = function() {
  document.documentElement.style.setProperty('--video-height',
    firstVideo.clientHeight + 'px');
  setVideoClip();
};

// firstVideo.onplaying = function() {
//   secondVideo.play();
// };

secondVideo.onplaying = function() {
  firstVideo.play();
};

secondVideo.onpause = function() {
  firstVideo.pause();
};

// firstVideo.ontimeupdate = function() {
//   secondVideo.currentTime = firstVideo.currentTime;
// };

firstVideo.onseeked = function() {
  if (secondVideo.currentTime !== firstVideo.currentTime) {
    secondVideo.currentTime = firstVideo.currentTime;
  }
};

secondVideo.onseeked = function() {
  if (firstVideo.currentTime !== secondVideo.currentTime) {
    firstVideo.currentTime = secondVideo.currentTime;
  }
};

range.oninput = function() {
  setVideoClip();
};

function setVideoClip() {
  var width = (firstVideo.clientWidth - thumbWidth) * range.value / 100 ;
  document.documentElement.style.setProperty('--video-clip', width + 'px');
}
