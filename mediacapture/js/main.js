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
