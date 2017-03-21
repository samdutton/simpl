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

document.getElementById('storeButton').addEventListener('click', function() {
  var key = document.getElementById('storeKey').value;
  var value = document.getElementById('storeValue').value;
  sessionStorage.setItem(key, value); // same as sessionStorage[key] = value;
}, false);

document.getElementById('retrieveButton').addEventListener('click', function() {
  var key = document.getElementById('retrieveKey').value;
  var value = window.sessionStorage[key];
  document.getElementById('retrieveValue').value = value;
}, false);

// only works if called from a different tab...
// window.addEventListener('storage', function(e){
//   document.getElementById('data').innerHTML =
//     'window.storage event: ' + e.data;
// });

// var length = window.sessionStorage.length;
// sessionStorage.removeItem(key);
// sessionStorage.clear();
