document.cancelFullScreen = document.webkitCancelFullScreen ||
	document.mozCancelFullScreen || document.cancelFullScreen;

document.body.requestFullScreen = document.body.webkitRequestFullScreen ||
	document.body.mozRequestFullScreen || document.body.requestFullScreen;

function displayFullScreenStatus(){
	var status = isFullScreen() ? 'Document is now full screen.' :
		'Document is currently not full screen.';
	document.querySelector('#status').innerHTML = status;
}

displayFullScreenStatus(); // on load

document.onfullscreenchange = document.onwebkitfullscreenchange =
	document.onmozfullscreenchange = displayFullScreenStatus;

function isFullScreen(){
	return !!(document.webkitIsFullScreen || document.mozFullScreen ||
		document.isFullScreen); // if any defined and true
}

function fullScreenElement(){
	return document.webkitFullScreenElement || document.webkitCurrentFullScreenElement ||
		document.mozFullScreenElement || document.fullScreenElement;
}

var video = document.querySelector('video');

video.requestFullScreen = video.webkitRequestFullScreen ||
		video.mozRequestFullScreen || video.requestFullScreen;

document.body.onclick = function(e){
	console.log(fullScreenElement());
	if ((isFullScreen() && e.target !== video) ||
			fullScreenElement() === video) {
		document.cancelFullScreen();
	} else if (e.target === video) {
		video.requestFullScreen();
	} else {
		document.body.requestFullScreen();
	}
};

