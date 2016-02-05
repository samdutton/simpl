'use strict';


var container = document.getElementById('splitview');
var video = container.querySelector('video');
var sheet = document.styleSheets[0];
var videoClientHeight;

function setThumbHeight() {
  if (videoClientHeight !== video.clientHeight) {
    videoClientHeight = video.clientHeight;
    var rule = 'input[type=range]::-webkit-slider-thumb {height: ' +
      video.clientHeight + 'px !important}';
    sheet.removeRule(1);
    sheet.insertRule(rule, 1);
    console.log('>>>>> sheet: ', sheet);
    console.log('>>>>> video.clientHeight: ', video.clientHeight);
  }
}

video.addEventListener('loadedmetadata', setThumbHeight);
window.addEventListener('resize', setThumbHeight);

