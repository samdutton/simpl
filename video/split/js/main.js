'use strict';


var container = document.getElementById('splitview');
var video = container.querySelector('video');

function setThumbHeight() {
  console.log(video.clientHeight);
  document.documentElement.style.setProperty('--video-height',
    video.clientHeight + 'px');
}

video.addEventListener('loadedmetadata', setThumbHeight);
window.addEventListener('resize', setThumbHeight);

