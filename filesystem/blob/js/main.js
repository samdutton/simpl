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

// code adapted from HTML5 Rocks article by Eric Bidelman
// https://www.html5rocks.com/en/tutorials/file/filesystem/

// init a FileSystem
// create a file
// write to the file
// read from the file

window.requestFileSystem = window.requestFileSystem ||
  window.webkitRequestFileSystem;

// 5MB
window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024,
  handleInitSuccess, handleError);

function handleInitSuccess(fileSystem) {
  window.fileSystem = fileSystem;
  log('Initiated FileSystem: ' + fileSystem.name);
  createFile('foo.txt');
}

function createFile(fullPath) {
  window.fileSystem.root.getFile(fullPath, {
    create: true
  },
  function(fileEntry) {
    log('Created file: ' + fileEntry.fullPath);
    writeToFile(fileEntry, 'Greetings from success callback!');
  }, handleError);
}

function writeToFile(fileEntry, text) {
  // Create a FileWriter object for fileEntry
  window.fileEntry = fileEntry;
  fileEntry.createWriter(function(fileWriter) {
    fileWriter.onwriteend = function() {
      // read from file
      log('Wrote text \'' + text + '\' to file ' + fileEntry.fullPath);
      readFromFile(fileEntry.fullPath);
    };
    fileWriter.onerror = function(e) {
      log('Write failed: ' + e.toString());
    };
    // Create a new Blob and write it to log.txt.
    var blob = new Blob([text], {
      type: 'text/plain'
    });
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
        log('Read text \'' + this.result + '\' from file ' + fullPath);
      };
      reader.readAsText(file);
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
