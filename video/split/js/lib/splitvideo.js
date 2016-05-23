/* exported SplitVideo, remoteVideo */

'use strict';

// Enable synchronised playback of two videos, one on top of the other
// with a slider to control how much width of the second video is displayed
// Given the ID of a container element and two video src values:
// • create two video elements
// • create an audio element as a controller for both
// • create a range element to control CSS clipping of the second video
// TODO: enable audio playback from either video

var SplitVideo = function(containerId, firstVideoSrc, secondVideoSrc) {
  var that = this;
  this.containerElement_= document.getElementById(containerId);

  this.setVideos(firstVideoSrc, secondVideoSrc);

  var range = document.createElement('input');
  range.setAttribute('type', 'range');
  this.containerElement_.appendChild(range);

  this.audio_ = document.createElement('audio');
  this.audio_.src = firstVideoSrc;
  this.audio_.setAttribute('controls', '');
  this.audio_.setAttribute('muted', '');
  this.containerElement_.appendChild(this.audio_);

  this.styles_ = getComputedStyle(document.documentElement);
  this.thumbWidth_ = parseInt(this.styles_.getPropertyValue('--thumb-width'));

  this.firstVideo_.onloadedmetadata = window.onresize = function() {
    document.documentElement.style.setProperty('--video-height',
      this.clientHeight + 'px');
    that.setCssClip_();
  };

  this.audio_.onplaying = function() {
    that.firstVideo_.play();
    that.secondVideo_.play();
  };

  this.audio_.onpause = function() {
    that.firstVideo_.pause();
    that.secondVideo_.pause();
    that.firstVideo_.currentTime = that.secondVideo_.currentTime =
    that.audio_.currentTime;
  };

  this.audio_.onvolumechange = function() {
    that._unmutedVideo.muted = this.muted;
    that.unmutedVideo_.volume = this.volume;
  };

  this.audio_.onseeked = function() {
    that.firstVideo_.currentTime = that.secondVideo_.currentTime =
      that.audio_.currentTime;
  };

  range.oninput = this.setCssClip_;

  // Set the CSS clip value based on the position of the range slider
  this.setCssClip_ = function() {
    var width =
      (this.firstVideo_.clientWidth - this.thumbWidth_) * range.value / 100 ;
    document.documentElement.style.setProperty('--video-clip', width + 'px');
  };
};

SplitVideo.prototype.setVideos = function(firstVideoSrc, secondVideoSrc) {
  this.appendVideo_(firstVideoSrc);
  this.appendVideo_(secondVideoSrc);
  this.firstVideo_= document.querySelector('video[src="' +
    firstVideoSrc + '"]');
  this.secondVideo_= document.querySelector('video[src="' +
    secondVideoSrc + '"]');
  this.unmutedVideo_ = this.firstVideo_;
};

SplitVideo.prototype.appendVideo_ = function(videoSrc) {
  var video = document.createElement('video');
  video.setAttribute('muted','');
  video.src = videoSrc;
  this.containerElement_.appendChild(video);
};
