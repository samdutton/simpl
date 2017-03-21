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

/* globals speechSynthesis, SpeechSynthesisUtterance */

var data = document.querySelector('p#data');

function log(message) {
  data.innerHTML += message + '<br />';
}

var u = new SpeechSynthesisUtterance();
u.text = 'Hello world';
u.lang = 'en-US';
u.rate = 1.2;
u.onend = function(event) {
  log('Finished in ' + event.elapsedTime + ' seconds.');
};
speechSynthesis.speak(u);

// simple version
speechSynthesis.speak(new SpeechSynthesisUtterance('Hello another world'));
