var videoContainers = document.querySelectorAll('div.videoContainer');
for (var i = 0; i !== videoContainers.length; ++i) {
  videoContainers[i].onclick = function(){
    var video = this.querySelector('video');
    video.requestFullScreen = video.requestFullScreen || video.webkitRequestFullScreen || mozRequestFullScreen;
    video.requestFullScreen();
  }
}
