'use strict';

/* globals mozRequestFullScreen */

function HandleClick() {
  var video = this.querySelector('video');
  video.requestFullScreen = video.requestFullScreen ||
      video.webkitRequestFullScreen || mozRequestFullScreen;
  video.requestFullScreen();
}

var videoContainers = document.querySelectorAll('div.videoContainer');
for (var i = 0; i !== videoContainers.length; ++i) {
  videoContainers[i].onclick = HandleClick;
}
