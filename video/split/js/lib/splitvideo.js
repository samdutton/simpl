/* exported SplitVideo, remoteVideo */

'use strict';

// Given ID of container element
// - create two video elements
// -

var SplitVideo = function(containerId, firstVideoSrc, secondVideoSrc) {
  this.containerElement_= document.getElementById(containerId);
  this.setVideos(firstVideoSrc, secondVideoSrc);

  var range = document.createElement('input');
  range.setAttribute('type', 'range');
  this.containerElement_.appendChild(range);

  var audio = document.createElement('audio');
  audio.src = firstVideoSrc;
  audio.setAttribute('controls', '');
  audio.setAttribute('muted', '');
  this.containerElement_.appendChild(audio);
};

SplitVideo.prototype.setVideos = function(firstVideoSrc, secondVideoSrc) {
  this.appendVideo_(firstVideoSrc);
  this.appendVideo_(secondVideoSrc);
};

SplitVideo.prototype.appendVideo_ = function(videoSrc) {
  var video = document.createElement('video');
  video.setAttribute('muted','');
  video.src = videoSrc;
  this.containerElement_.appendChild(video);
};
