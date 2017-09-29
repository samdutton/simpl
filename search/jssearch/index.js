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
// node index.js < data/data1000.json > data/index1000.json

const jsSearch = require('js-search');
const stdin = process.stdin;
const stdout = process.stdout;
const buffer = [];

stdin.resume();
stdin.setEncoding('utf8');

stdin.on('data', data => {
  buffer.push(data);
});

stdin.on('end', () => {
  const documents = JSON.parse(buffer.join());
  var search = new jsSearch.Search('name');
  search.searchIndex = new jsSearch.TfIdfSearchIndex('name');
  search.addIndex('title');
  search.addIndex('description');
  search.addDocuments(documents);
  console.warn(search.searchIndex);
  // stdout.write(search);
});