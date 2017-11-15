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

/* global idbKeyval */

const logDiv = document.querySelector('div#log');
const rangeContainer = document.querySelector('div#rangeContainer');
const label = document.querySelector('label');
const range = document.querySelector('input[type=range]');
range.oninput = displayRangeValue;

const addDocsButton = document.querySelector('button');
addDocsButton.onclick = addDocs;

const DOCS_FILE = 'data/docs.json';
const DEFAULT_NUM_TO_ADD = 1000;

var docs;

// Fetch and load docs
log('Fetching docs...');
startPerf();
fetch(DOCS_FILE).then(response => {
  return response.json();
}).then(json => {
  docs = json;
  endPerf(`Fetching ${docs.length} docs`);
  displayRange(docs.length);
});


function addDocs() {
  const docsToAdd = docs.slice(0, range.value);
  log(`<br>\nAdding ${docsToAdd.length} docs to database...`);
  startPerf();
  idbKeyval.clear();
  let numSet = 0;
  for (const doc of docsToAdd) {
    idbKeyval.set(doc._id, doc).then(() => {
      numSet++;
      if (numSet === docsToAdd.length) {
        endPerf(`Adding ${docsToAdd.length} docs to database`);
        log('Getting keys...');
        startPerf();
        idbKeyval.keys().then(keys => {
          endPerf(`Getting ${keys.length} keys`);
        }).catch(error => console.error('Error getting keys:', error));
        log('Getting values...');
        startPerf();
        idbKeyval.values().then(values => {
          endPerf(`Getting ${values.length} values`);
        }).catch(error => console.error('Error getting values:', error));
      }
    }).catch(error => console.error('Error storing doc:', doc, error));
  }
}

function displayRangeValue() {
  label.textContent = range.value;
}

function displayRange(numDocs) {
  range.max = numDocs;
  range.value = DEFAULT_NUM_TO_ADD;
  label.textContent = range.value;
  rangeContainer.classList.remove('hidden');
}

// window.performance utilities

function startPerf() {
  window.performance.mark('start');
}

function endPerf(message) {
  window.performance.mark('end');
  window.performance.clearMeasures();
  window.performance.measure('duration', 'start', 'end');
  const duration =
    performance.getEntriesByName('duration')[0].duration.toFixed(0);
  log(`${message} took ${duration} ms`);
}

function log(message) {
  console.log(message.replace('<br>', ''));
  logDiv.innerHTML += `${message}<br>`;
}
