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

/* globals FileError */

// get video file via XHR
// store with File API
// read Blob from File API and set as video src using createObjectUrl()
// play video

var video = document.querySelector('video');

function getVideo(fileEntry) {
  get('../video/chrome.webm', function(uInt8Array) {
    var blob = new Blob([uInt8Array], {
      type: 'video/webm'
    });
    writeToFile(fileEntry, blob);
  });
}

function get(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.send();

  xhr.onload = function() {
    if (xhr.status !== 200) {
      alert('Unexpected status code ' + xhr.status + ' for ' + url);
      return false;
    }
    callback(new Uint8Array(xhr.response));
  };
}

// code adapted from HTML5 Rocks article by Eric Bidelman
// https://www.html5rocks.com/en/tutorials/file/filesystem/

// init a FileSystem
// create a file
// write to the file
// read from the file

window.requestFileSystem =
window.requestFileSystem || window.webkitRequestFileSystem;

window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, // 5MB
  handleInitSuccess, handleError);

function handleInitSuccess(fileSystem) {
  window.fileSystem = fileSystem;
  log('Initiated FileSystem: ' + fileSystem.name);
  createFile('video.webm');
}

function createFile(fullPath) {
  window.fileSystem.root.getFile(fullPath, {
    create: true
    /* exclusive: true */
  },
  function(fileEntry) {
    log('Created file: ' + fileEntry.fullPath);
    getVideo(fileEntry);
  }, handleError);
}

function writeToFile(fileEntry, blob) {
  // Create a FileWriter object for fileEntry
  fileEntry.createWriter(function(fileWriter) {
    fileWriter.onwriteend = function() {
      // read from file
      log('Wrote to file ' + fileEntry.fullPath);
      readFromFile(fileEntry.fullPath);
    };
    fileWriter.onerror = function(e) {
      log('Write failed: ' + e.toString());
    };
    // Create a new Blob and write it to file
    fileWriter.write(blob);
  }, handleError);
}

function readFromFile(fullPath) {
  window.fileSystem.root.getFile(fullPath, {}, function(fileEntry) {
    // Get a File object representing the file
    // then use FileReader to read its contents
    fileEntry.file(function(file) {
      var reader = new FileReader();
      reader.onloadend = function() {
        // video.src = this.result;
        video.src = URL.createObjectURL(new Blob([this.result]));
      };
      // reader.readAsDataURL(file);
      reader.readAsArrayBuffer(file);
    }, handleError);
  }, handleError);
}

function handleError(e) {
  switch (e.code) {
  case FileError.QUOTA_EXCEEDED_ERR:
    log('QUOTA_EXCEEDED_ERR');
    break;
  case FileError.NOT_FOUND_ERR:
    log('NOT_FOUND_ERR');
    break;
  case FileError.SECURITY_ERR:
    log('SECURITY_ERR');
    break;
  case FileError.INVALID_MODIFICATION_ERR:
    log('INVALID_MODIFICATION_ERR');
    break;
  case FileError.INVALID_STATE_ERR:
    log('INVALID_STATE_ERR');
    break;
  default:
    log('Unknown error');
    break;
  }
}

var data = document.getElementById('data');

function log(text) {
  data.innerHTML += text + '<br />';
}

document.querySelector('video').addEventListener('loadedmetadata', function() {
  var fileName = this.currentSrc.replace(/^.*[\\\/]/, '');
  document.querySelector('#videoSrc').innerHTML = 'currentSrc: ' + fileName +
  '<br /> videoWidth: ' + this.videoWidth + 'px<br /> videoHeight: ' + this
  .videoHeight + 'px';
});
