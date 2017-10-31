/*
Copyright 2017 Google Inc.

Licensed under the Apache License, Version 2.0 (the 'License');
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an 'AS IS' BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

/* global lunr */

const queryInput = document.getElementById('query');
// Search for products whenever query input text changes
queryInput.oninput = doSearch;
const resultsList = document.getElementById('results');

var docs;
var index;

const INDEX_AND_DOCS = 'data/index-and-docs.json';

// if (navigator.serviceWorker) {
//   navigator.serviceWorker.register('sw.js').catch(function(error) {
//     console.error('Unable to register service worker.', error);
//   });
// }

// Fetch and load index
console.log('Fetching index and docs...');
console.time('Fetch index and docs');
fetch(INDEX_AND_DOCS).then(response => {
  return response.json();
}).then(json => {
  console.timeEnd('Fetch index and docs');
  console.time('Load index');
  index = lunr.Index.load(json.index);
  docs = json.docs;
  console.timeEnd('Load index');
  queryInput.disabled = false;
  queryInput.focus();
});

// Search for products whenever query input text changes
queryInput.oninput = doSearch;

function doSearch() {
  resultsList.textContent = '';
  console.clear();
  const query = queryInput.value;
  if (query.length < 2) {
    return;
  }

  console.time('Do search');
  const matches = index.search(query);
  // matches is an array of items with refs (IDs) and scores
  if (matches.length > 0) {
    displayMatches(matches, query);
  }
  console.timeEnd('Do search');
}

function displayMatches(matches, query) {
  let results = [];
  const re = new RegExp(query, 'i');
  for (const match of matches) {
    results.push(docs[match.ref]);
  }
  results = results.filter(function(result) {
    return re.test(result.t);
  });
  results.sort((x, y) => {
    return re.test(x.t) ? -1 : re.test(query) ? 1 : 0;
  });
  for (const result of results) {
    addResult(result);
  }
}

function addResult(match) {
  const resultElement = document.createElement('li');
  resultElement.classList.add('match');
  resultElement.dataset.location = match.l;
  resultElement.appendChild(document.createTextNode(match.t));
  resultElement.onclick = function() {
    console.log(match.id);
  };
  resultsList.appendChild(resultElement);
}