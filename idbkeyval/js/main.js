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

const DOCS_FILE = 'data/docs.json';
const NUM_TO_ADD = 50000;

// Fetch and load docs
console.log('Fetching docs...');
console.time('Fetch docs');
fetch(DOCS_FILE).then(response => {
  return response.json();
}).then(docs => {
  console.timeEnd('Fetch docs');
  console.log(`Adding ${NUM_TO_ADD} docs of ${docs.length} available...`);
  docs = docs.slice(0, NUM_TO_ADD);
  console.time(`Add ${docs.length} docs to database`);
  idbKeyval.clear();
  let numSet = 0;
  for (const doc of docs) {
    idbKeyval.set(doc._id, doc).then(() => {
      numSet++;
      if (numSet === docs.length) {
        console.timeEnd(`Add ${docs.length} docs to database`);
        console.time('Getting keys...');
        console.time('Get keys');
        idbKeyval.keys().then(keys => {
          console.timeEnd('Get keys');
          console.log('keys.length', keys.length, keys);
        }).catch(error => console.error('Error getting keys:', error));
        console.time('Getting values...');
        console.time('Get values');
        idbKeyval.values().then(values => {
          console.timeEnd('Get values');
          console.log('keys.length', values.length, values);
        }).catch(error => console.error('Error getting values:', error));
      }
    }).catch(error => console.error('Error storing doc:', doc, error));
  }
});