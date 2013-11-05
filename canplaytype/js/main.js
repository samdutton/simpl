var data = document.querySelector("p#data");
function log(message){
  data.innerHTML += message + "<br />";
}

var mediaElement = document.createElement('video');

log('video/xyz: "' +
	mediaElement.canPlayType('video/xyz') +'"');
log('video/xyz; codecs="avc1.42E01E, mp4a.40.2": "' +
	mediaElement.canPlayType('video/xyz; codecs="avc1.42E01E, mp4a.40.2"') +'"');
log('video/xyz; codecs="nonsense, noise": "' +
	mediaElement.canPlayType('video/xyz; codecs="nonsense, noise"') +'"');
log('video/mp4; codecs="avc1.42E01E, mp4a.40.2": "' +
  mediaElement.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') +'"');
log('video/webm: "' +
  mediaElement.canPlayType('video/webm') + '"');
log('video/webm; codecs="vp8, vorbis": "' +
  mediaElement.canPlayType('video/webm; codecs="vp8, vorbis"') + '"');
