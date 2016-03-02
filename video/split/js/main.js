'use strict';


var container = document.getElementById('splitview');
var range = container.querySelector('input[type=range]');
var video = container.querySelector('video');

var styles = getComputedStyle(document.documentElement);
var thumbWidth = parseInt(styles.getPropertyValue('--thumb-width'));

video.onloadedmetadata = window.onresize = function() {
  document.documentElement.style.setProperty('--video-height',
    video.clientHeight + 'px');
  setVideoClip();
};

range.oninput = function() {
  setVideoClip();
};

function setVideoClip() {
  var width = (video.clientWidth - thumbWidth) * range.value / 100 ;
  document.documentElement.style.setProperty('--video-clip', width + 'px');
}
