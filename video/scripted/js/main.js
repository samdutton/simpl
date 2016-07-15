'use strict';

var video = document.querySelector('video');

video.onloadedmetadata = function() {
  video.play();
  var fileName = this.currentSrc.replace(/^.*[\\\/]/, '');
  document.querySelector('#videoSrc').innerHTML = 'Playing video: ' + fileName;
};
