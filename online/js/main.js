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

function log(message) {
  document.querySelector('#data').innerHTML += message + '<br /><br />';
}

if (typeof navigator.onLine !== 'undefined') {
  if (navigator.onLine) {
    log('navigator.onLine says you\'re online');
  } else {
    log('navigator.onLine says you\'re offline.');
  }

  window.ononline = function() {
    log('window.ononline says you\'re online.');
  };

  window.onoffline = function() {
    log('window.ononline says you\'re offline.');
  };
} else {
  log('Shame! navigator.onLine is not supported on this platform.');
}
