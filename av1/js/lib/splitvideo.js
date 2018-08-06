/* exported SplitVideo, remoteVideo */

// Synchronised playback of two videos, one on top of the other,
// with a slider to control how much width of the second video is displayed
// Given the ID of a container element and two video src values:
// • create two video elements
// • create an audio element as a controller for both
// • create a range element to control CSS clipping of the second video
// TODO: enable audio playback from either video

class SplitVideo { // eslint-disable-line no-unused-vars
  constructor(containerId, firstVideoSrc, secondVideoSrc) {
    // I know, I know...
    const that = this;
    this.containerElement_ = document.getElementById(containerId);
    this.styles_ = getComputedStyle(document.documentElement);
    this.thumbWidth_ = 20;
    const isChrome = navigator.userAgent.toLowerCase().includes('chrome');
    const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
    // hack!
    window.onresize = () => {
      location.reload();
    };

    this.initVideos_ = function() {
      this.setVideos(firstVideoSrc, secondVideoSrc);
      this.firstVideo_.onloadedmetadata = window.onresize =
        function() {
          document.documentElement.style.setProperty(
            '--video-height',
            `${this.clientHeight}px`);
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

      this.audio_.onplaying = () => {
        that.firstVideo_.play();
        that.secondVideo_.play();
      };

      this.audio_.onpause = () => {
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
      const range = this.range_ = document.createElement('input');
      range.setAttribute('type', 'range');
      range.oninput = this.setCssClip_;
      this.containerElement_.appendChild(range);
    };

    // Set the CSS clip value based on the position of the range slider.
    // This value is used to set the displayed width of the second video.
    this.setCssClip_ = () => {
      const width = (that.firstVideo_.clientWidth - that.thumbWidth_) *
        that.range_.value / 100;
      document.documentElement.style.setProperty('--video-clip',
        `${width}px`);
    };

    this.appendVideo_ = function(videoSrc) {
      const video = document.createElement('video');
      video.setAttribute('muted', '');
      video.src = videoSrc;
      this.containerElement_.appendChild(video);
    };

    this.addCss_ = function() {
      const sheet = window.document.styleSheets[0];
      sheet.insertRule(
        `:root {--thumb-width: ${this.thumbWidth_}px; --video-height: 0px; --video-clip: 30px;}`,
        0);
      sheet.insertRule(
        '#splitview audio {bottom: 5px; opacity: 0;' +
        'outline: none; padding: 0 5px; position: absolute; ' +
        'transition: opacity 0.3s; width: calc(100% - 10px); ' +
        'transform: translateZ(0); z-index: 1;}', 0);
      sheet.insertRule('div#splitview:hover audio {opacity: 1;}',
        0);
      sheet.insertRule(
        'div#splitview {height: var(--video-height); ' +
        'overflow: hidden; position: relative;}', 0);
      sheet.insertRule('#splitview video {position: absolute;}', 0);
      sheet.insertRule(
        '#splitview video:last-of-type {display: block; ' +
          'clip-path: inset(0 0 0 var(--video-clip)); opacity: 1');
      sheet.insertRule(
        '#splitview input[type=range] {background: none; ' +
        'margin: 0 2px 0 0; position: absolute;' +
        'width: 100%; -webkit-appearance: none;}', 0);
      sheet.insertRule('input[type=range]:focus {outline: none;}',
        0);

      if (isChrome) {
        sheet.insertRule(
          'input[type=range]::-webkit-slider-runnable-track ' +
          '{height: 0;}', 0);
        sheet.insertRule(
          'input[type=range]::-webkit-slider-thumb {background: ' +
          'black; cursor: pointer; height: var(--video-height); opacity: 0.5; ' +
          'transform: translateZ(0px);' +
          'width: var(--thumb-width); -webkit-appearance: none;}',
          0);
        sheet.insertRule(
          'input[type=range]:focus::-webkit-slider-runnable-track' +
          '{height: 0;}', 0);
      } else if (isFirefox) {
        // Bad and wrong, but AFAICT only way to get consistent UI in Firefox
        sheet.insertRule(
          '#splitview audio {bottom: 0; padding: 0; ' +
          'width: 100%;}', 0);
        sheet.insertRule('#splitview input[type=range] {height: ' +
          'var(--video-height); left: -1px; position: relative; top: -1px;}', 0);
        sheet.insertRule('input[type=range]::-moz-range-track ' +
          '{background: none;}', 0);
        sheet.insertRule(
          'input[type=range]::-moz-range-thumb {background: black;' +
          'border: none; border-radius: 0; cursor: pointer; height: ' +
          'var(--video-height); opacity: 0.5; width: var(--thumb-width)',
          0);
        sheet.insertRule(
          'input[type=range]:focus::-moz-range-track {height: 0;}',
          0);
      }
    };

    this.addCss_();
    this.initVideos_();
    this.initAudio_();
    this.initRange_();
  }

  setVideos(firstVideoSrc, secondVideoSrc) {
    this.appendVideo_(firstVideoSrc);
    this.appendVideo_(secondVideoSrc);
    window.firstVideo = this.firstVideo_ = document.querySelector(
      `video[src="${firstVideoSrc}"]`);
    window.secondVideo = this.secondVideo_ = document.querySelector(
      `video[src="${secondVideoSrc}"]`);
    this.unmutedVideo_ = this.firstVideo_;
  }
}
