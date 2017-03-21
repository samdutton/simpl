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

// set name of visibility change and state events for different browsers
var visibilityChange;
var visibilityState;
if (typeof document.visibilityState !== 'undefined') {
  visibilityChange = 'visibilitychange';
  visibilityState = 'hidden';
} else if (typeof document.mozHidden !== 'undefined') {
  visibilityChange = 'mozvisibilitychange';
  visibilityState = 'mozVisibilityState';
} else if (typeof document.msHidden !== 'undefined') {
  visibilityChange = 'msvisibilitychange';
  visibilityState = 'msVisibilityState';
} else if (typeof document.webkitHidden !== 'undefined') {
  visibilityChange = 'webkitvisibilitychange';
  visibilityState = 'webkitVisibilityState';
}

var data = document.getElementById('data');

data.innerHTML += new Date().toTimeString() + ': <em>' + document.title +
    '</em> is ' + document[visibilityState] + '<br />';

document.addEventListener(visibilityChange, function() {
  data.innerHTML += new Date().toTimeString() + ': <em>' + document.title +
      '</em> is ' + document[visibilityState] + '<br />';
});
window.addEventListener('focus', function() {
  data.innerHTML += new Date().toTimeString() + ': Focus event for <em>' +
      document.title + '</em><br />';
});
window.addEventListener('blur', function() {
  data.innerHTML += new Date().toTimeString() + ': Blur event for <em>' +
      document.title + '</em><br />';
});
