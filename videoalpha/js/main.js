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

var chromeVideo = document.getElementById('chrome');
var containerDiv = document.getElementById('container');
var colorInput = document.getElementById('colorInput');
var clearSpan = document.getElementById('clearSpan');
var video1 = document.getElementById('video1');
var video2 = document.getElementById('video2');

colorInput.onchange = function() {
  video1.style.backgroundColor = this.value;
  video2.style.backgroundColor = this.value;
};

clearSpan.onclick = function() {
  video1.style.backgroundColor = 'transparent';
  video2.style.backgroundColor = 'transparent';
};

function toggleChromeVideo() {
  if (chromeVideo.classList.contains('transparent')) {
    chromeVideo.classList.remove('transparent');
    chromeVideo.play();
  } else {
    document.body.style.backgroundImage = 'url(images/crissyField.jpg)';
    chromeVideo.classList.add('transparent');
    chromeVideo.pause();
  }
}

chromeVideo.onclick = toggleChromeVideo;
containerDiv.onclick = toggleChromeVideo;

function addEventListeners(video) {
  video.ondblclick = handleDblclick;
  video.onpointerdown = handlePointerDown;
  video.onpointerup = handlePointerUp;
  video.onpointermove = handlePointerMove;
}
addEventListeners(video1);
addEventListeners(video2);

function handleDblclick(event) {
  var video = event.srcElement;
  video.classList.remove('rotate-out');
  setTimeout(function() {
    video.classList.add('rotate-out');
  }, 5);
  event.preventDefault();
}

var isPointerDown = false;

function handlePointerDown(event) {
  isPointerDown = true;
  var video = event.srcElement;
  video.style.opacity = 0.7;
  video.style.webkitFilter = 'blur(3px) grayscale(1)';
  video.style.zIndex = video.style.zIndex + 1;
  event.preventDefault();
}

function handlePointerUp(event) {
  isPointerDown = false;
  var video = event.srcElement;
  video.style.opacity = 1;
  video.style.webkitFilter = 'blur(0px)';
  event.preventDefault();
}

function handlePointerMove(event) {
  if (!isPointerDown) {
    return;
  }
  var video = event.srcElement;
  var videoWidth = video.clientWidth;
  var videoHeight = video.clientHeight;

  video.style.left = (event.clientX - videoWidth / 2) + 'px';
  video.style.top = (event.clientY - videoHeight / 2) + 'px';

  event.preventDefault();
}
