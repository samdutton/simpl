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

var img = document.querySelector('img');
var video = document.querySelector('video');
var inputs = document.querySelectorAll('input');

for (var i = 0; i !== inputs.length; ++i) {
  inputs[i].onchange = handleInput;
}

function handleInput(inputEvent) {
  var files = inputEvent.target.files;
  if (files && files.length > 0) {
    var file = window.file = files[0]; // global scope so visible in console
    console.log('file, files:', file, files);
    var isVideo = file.type.indexOf('video') !== -1;
    var displayElement = isVideo ? video : img;
    displayElement.classList.remove('hidden');
    try {
      var url = window.URL.createObjectURL(file);
      displayElement.src = url;
//      window.URL.revokeObjectURL(url);
    } catch(event) {
      try {
        var fileReader = new FileReader();
        fileReader.onload = function(fileReaderEvent) {
          displayElement.src = fileReaderEvent.target.result;
        };
        fileReader.readAsDataURL(file);
      } catch(error) {
        console.log('Neither createObjectURL or FileReader are supported',
          error);
      }
    }
  }
}
