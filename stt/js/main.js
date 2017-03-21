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

/* globals SpeechRecognition */

var data = document.querySelector('p#data');

function log(message) {
  data.innerHTML = message + '<br><br>' + data.innerHTML;
}

window.SpeechRecognition = window.SpeechRecognition ||
  window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
// recognition.lang = 'en-AU';

recognition.onresult = function(event) {
  var results = event.results;
  // results is an array of SpeechRecognitionResults
  // each of which is an array of SpeechRecognitionAlternatives
  // in this demo, we only use the first alternative
  var interimTranscript = '';
  for (var i = event.resultIndex; i !== results.length; ++i) {
    var result = results[i];
    // once speaking/recognition stops, a SpeechRecognitionEvent
    // is fired with a single result, for which isFinal is true
    if (result.isFinal) {
      log('Final transcript: ' + results[0][0].transcript);
      recognition.stop();
    } else {
      interimTranscript += result[0].transcript;
      log('Interim transcript: ' + interimTranscript);
    }
  }
};

recognition.onend = function() {
  log('Recognition ended.');
};

recognition.onerror = function(event) {
  log('Error: ' + event.error);
};

var startButton = document.querySelector('button#startButton');
startButton.onclick = function() {
  recognition.start();
};
