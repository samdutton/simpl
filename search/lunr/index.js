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

// To build an index:
// node js/index.js < data/data.json > data/index.json

const elasticlunr = require('elasticlunr');
const fs = require('fs');

const INPUT = 'data/data1000.json';
const OUTPUT = 'data/index1000.json';

fs.readFile(INPUT, 'utf8', (readerror, text) => {
  if (readerror) {
    console.log(`Error reading input data file ${INPUT}:`, readerror);
    return;
  }

  const docs = JSON.parse(text);

  const index = elasticlunr(function() { // can't seem to use fat arrow :/
    this.addField('title'); // fields to index
    this.addField('description');
    this.setRef('name'); // field used to identify document
    this.saveDocument(true); // include data in index
    for (let doc of docs) {
      this.addDoc(doc);
    }
  });

  fs.writeFile(OUTPUT, JSON.stringify(index), writeerror => {
    if(writeerror) {
      return console.error(`Error writing output to ${OUTPUT}`, writeerror);
    }
    console.log(`The file ${OUTPUT} was saved!`);
  });
});