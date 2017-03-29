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

window.addEventListener('message', function receiveMessage(event) {
  log('Got a message from event.origin ' + event.origin + ': ');
  log('<em>' + event.data + '</em>');
  // posting back to message source, i.e. index.html
  // second parameter is eventOrigin: must match event.origin
  event.source.postMessage('hi! this is a message from other.html', '*');
});

function log(message) {
  document.getElementById('data').innerHTML += message + '<br /><br />';
}
