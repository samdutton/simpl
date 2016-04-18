var video = document.querySelector('video');
video.playbackRate = 2;
video.addEventListener('loadedmetadata', function() {
  var fileName = this.currentSrc.replace(/^.*[\\\/]/, '');
  document.querySelector('#videoSrc').textContent =
    'Playing video: ' + fileName;
});
