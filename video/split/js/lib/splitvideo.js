/*
Copyright 2017 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

/* exported SplitVideo, remoteVideo */

// Synchronised playback of two videos, one on top of the other,
// with a slider to control how much width of the second video is displayed
// Given the ID of a container element and two video src values:
// • create two video elements
// • create an audio element as a controller for both
// • create a range element to control CSS clipping of the second video
// TODO: enable audio playback from either video

var SplitVideo = function(containerId, firstVideoSrc, secondVideoSrc) {
  var that = this;
  this.containerElement_= document.getElementById(containerId);
  this.styles_ = getComputedStyle(document.documentElement);
  this.thumbWidth_ = 20;
  var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  this.initVideos_ = function() {
    this.setVideos(firstVideoSrc, secondVideoSrc);
    this.firstVideo_.onloadedmetadata = window.onresize = function() {
      document.documentElement.style.setProperty('--video-height',
        this.clientHeight + 'px');
      that.setCssClip_();
    };
  };

  this.initAudio_ = function() {
    if (isFirefox) {
      this.firstVideo_.setAttribute('controls', '');
      this.secondVideo_.setAttribute('controls', '');
      this.firstVideo_.play();
      this.secondVideo_.play();
      return;
    }
    this.audio_ = document.createElement('audio');
    // Firefox audio element doesn't support .webm, despite canPlaytype
    this.audio_.src = this.firstVideo_.src;
    this.audio_.setAttribute('controls', '');
    this.audio_.setAttribute('muted', '');
    this.containerElement_.appendChild(this.audio_);

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
      this.pause();
      // that.firstVideo_.pause();
      // that.secondVideo_.pause();
      // that.firstVideo_.currentTime = that.secondVideo_.currentTime =
      //   that.audio_.currentTime;
    };
  };

  this.initRange_ = function() {
    var range = this.range_ = document.createElement('input');
    range.setAttribute('type', 'range');
    range.oninput = this.setCssClip_;
    this.containerElement_.appendChild(range);
  };

  // Set the CSS clip value based on the position of the range slider.
  // This value is used to set the displayed width of the second video.
  this.setCssClip_ = function() {
    var width = (that.firstVideo_.clientWidth - that.thumbWidth_) *
    that.range_.value / 100;
    document.documentElement.style.setProperty('--video-clip', width + 'px');
  };

  this.appendVideo_ = function(videoSrc) {
    var video = document.createElement('video');
    video.setAttribute('muted', '');
    video.src = videoSrc;
    this.containerElement_.appendChild(video);
  };

  this.addCss_ = function() {
    var sheet = window.document.styleSheets[0];
    sheet.insertRule(':root {--thumb-width: ' + this.thumbWidth_ +
      'px; --video-height: 0px; --video-clip: 30px;}', 0);
    sheet.insertRule('#splitview audio {bottom: 5px; height: 36px; opacity: 0;'
      + 'outline: none; padding: 0 5px; position: absolute; ' +
      'transition: opacity 0.3s; width: calc(100% - 10px); ' +
      'transform: translateZ(0); z-index: 1;}', 0);
    sheet.insertRule('div#splitview:hover audio {opacity: 1;}', 0);
    sheet.insertRule('div#splitview {height: var(--video-height); ' +
      'overflow: hidden; position: relative;}', 0);
    sheet.insertRule('#splitview video {position: absolute;}', 0);
    sheet.insertRule('#splitview video:last-of-type {display: block; ' +
      'clip: rect(0 var(--video-clip) var(--video-height) 0); ' +
      '-webkit-clip-path: inset(0 0 0 0); opacity: 1;}', 0);
    sheet.insertRule('#splitview input[type=range] {background: none; ' +
      'margin: 0 2px 0 0; position: absolute;' +
      'width: 100%; -webkit-appearance: none;}', 0);
    sheet.insertRule('input[type=range]:focus {outline: none;}', 0);

    if (isChrome) {
      sheet.insertRule('input[type=range]::-webkit-slider-runnable-track ' +
        '{height: 0;}', 0);
      sheet.insertRule('input[type=range]::-webkit-slider-thumb {background: ' +
        'black; cursor: pointer; height: var(--video-height); opacity: 0.5; ' +
        'transform: translateZ(0px);' +
        'width: var(--thumb-width); -webkit-appearance: none;}', 0);
      sheet.insertRule('input[type=range]:focus::-webkit-slider-runnable-track'
        + '{height: 0;}', 0);
    } else if (isFirefox) {
    // Bad and wrong, but AFAICT only way to get consistent UI in Firefox
      sheet.insertRule('#splitview audio {bottom: 0; padding: 0; ' +
        'width: 100%;}', 0);
      sheet.insertRule('#splitview input[type=range] {height: ' +
        'var(--video-height); left: -1px; position: relative; top: -1px;}', 0);
      sheet.insertRule('input[type=range]::-moz-range-track ' +
        '{background: none;}', 0);
      sheet.insertRule('input[type=range]::-moz-range-thumb {background: black;'
        + 'border: none; border-radius: 0; cursor: pointer; height: ' +
        'var(--video-height); opacity: 0.5; width: var(--thumb-width)', 0);
      sheet.insertRule('input[type=range]:focus::-moz-range-track {height: 0;}',
        0);
    }
  };

  this.addCss_();
  this.initVideos_();
  this.initAudio_();
  this.initRange_();
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

