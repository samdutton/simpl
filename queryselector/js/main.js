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

var data = document.querySelector('p#data');

function log(message) {
  data.innerHTML += message + '<br />';
}

log('innerHTML for p#betty using querySelector(\'p#betty\'): ');
log(document.querySelector('p#betty').innerHTML);

log('<br />innerHTML for each p.rubble using querySelectorAll(\'p.rubble\'): ');
var rubbles = document.querySelectorAll('p.rubble');
for (var i = 0; i !== rubbles.length; ++i) {
  log(rubbles[i].innerHTML);
}

log(
  '<br />innerHTML for odd-numbered paragraphs ' +
  'using querySelectorAll(\'div#bedrock p:nth-child(odd)\'): '
);
var oddParagraphs = document.querySelectorAll('div#bedrock p:nth-child(odd)');
for (i = 0; i !== oddParagraphs.length; ++i) {
  log(oddParagraphs[i].innerHTML);
}
