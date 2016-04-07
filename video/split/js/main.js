/* global SplitVideo */

'use strict';

new SplitVideo('splitview',
    'video/vp8_webrtc.webm#t=2', 'video/vp9_webrtc.webm#t=2');

var container = document.getElementById('splitview');
var range = container.querySelector('input[type=range]');
var firstVideo = container.querySelectorAll('video')[0];
var secondVideo = container.querySelectorAll('video')[1];
var audio = container.querySelector('audio');

var unmutedVideo = firstVideo; // temporary

var styles = getComputedStyle(document.documentElement);
var thumbWidth = parseInt(styles.getPropertyValue('--thumb-width'));

firstVideo.onloadedmetadata = window.onresize = function() {
  document.documentElement.style.setProperty('--video-height',
    firstVideo.clientHeight + 'px');
  setVideoClip();
};

audio.onplaying = function() {
  firstVideo.play();
  secondVideo.play();
};

audio.onpause = function() {
  firstVideo.pause();
  secondVideo.pause();
  firstVideo.currentTime = secondVideo.currentTime = audio.currentTime;
};

audio.onvolumechange = function() {
  unmutedVideo.muted = this.muted;
  unmutedVideo.volume = this.volume;
};

audio.onseeked = function() {
  firstVideo.currentTime = secondVideo.currentTime = audio.currentTime;
};

range.oninput = function() {
  setVideoClip();
};

function setVideoClip() {
  var width = (firstVideo.clientWidth - thumbWidth) * range.value / 100 ;
  document.documentElement.style.setProperty('--video-clip', width + 'px');
}
