var video = document.querySelector('video');
var range = document.querySelector('input[type=range]');
var playbackRateDisplay = document.getElementById('playbackRate');

playbackRateDisplay.textContent = video.defaultPlaybackRate;
range.value = video.defaultPlaybackRate;

video.addEventListener('loadedmetadata', function() {
  var fileName = this.currentSrc.replace(/^.*[\\\/]/, '');
  document.querySelector('#videoSrc').textContent =
    'Playing video: ' + fileName;
});

range.onchange = function(e) {
  video.playbackRate = e.target.value;
};

video.onratechange = function() {
  playbackRateDisplay.textContent = this.playbackRate;
};
