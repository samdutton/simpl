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

var qvgaVideo = document.querySelector('video#qvga');
var hdVideo = document.querySelector('video#hd');

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var qvgaConstraints = {
  video: {
    mandatory: {
      maxWidth: 320,
      maxHeight: 180
    }
  }
};

// var vgaConstraints  = {
//   video: {
//     mandatory: {
//       maxWidth: 640,
//       maxHeight: 360
//     }
//   }
// };

var hdConstraints = {
  video: {
    mandatory: {
      minWidth: 320,
      minHeight: 180
    }
  }
};

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.getUserMedia(qvgaConstraints, function(stream) {
  qvgaVideo.src = window.URL.createObjectURL(stream);
  qvgaVideo.play();
}, errorCallback);

navigator.getUserMedia(hdConstraints, function(stream) {
  hdVideo.src = window.URL.createObjectURL(stream);
  hdVideo.play();
}, errorCallback);
