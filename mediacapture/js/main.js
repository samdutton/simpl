'use strict';

var img = document.querySelector('img');
var input = document.querySelector('input');

input.onchange = function(inputEvent) {
  var files = inputEvent.target.files;
  if (files && files.length > 0) {
    var file = files[0];
    console.log('file, files:', file, files);
    try {
      var fileReader = new FileReader();
      fileReader.onload = function(fileReaderEvent) {
        img.src = fileReaderEvent.target.result;
      };
      fileReader.readAsDataURL(file);
      console.log('fileReader', fileReader);
    } catch(event) {
      try {
        var url = window.URL.createObjectURL(file);
        img.src = url;
        window.URL.revokeObjectURL(url);
      } catch(error) {
        console.log('Neither createObjectURL or FileReader are supported',
          error);
      }
    }
  }
};
