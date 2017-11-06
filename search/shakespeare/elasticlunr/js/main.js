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

/* global elasticlunr */

const queryInput = document.getElementById('query');
// Search for products whenever query input text changes
queryInput.oninput = doSearch;
const resultsList = document.getElementById('results');

const SEARCH_OPTIONS = {
  fields: {
    t: {}
  },
  bool: 'AND',
  expand: true // true: do not require whole-word matches only
};

var index;

const INDEX_FILE = 'data/index.json';

// if (navigator.serviceWorker) {
//   navigator.serviceWorker.register('sw.js').catch(function(error) {
//     console.error('Unable to register service worker.', error);
//   });
// }

// Get index data and load index
console.log('Fetching index...');
console.time('Fetch index');
fetch(INDEX_FILE).then(response => {
  return response.json();
}).then(json => {
  console.timeEnd('Fetch index');
  // elasticlunr.clearStopWords = function() {
  //   elasticlunr.stopWordFilter.stopWords = {};
  // };
  console.log('Loading index...');
  console.time('Load index');
  index = elasticlunr.Index.load(json);
  console.timeEnd('Load index');
  queryInput.disabled = false;
  queryInput.focus();
});

// Search for products whenever query input text changes
queryInput.oninput = doSearch;
var timeout = null;
const DEBOUNCE_DELAY = 200;

function doSearch() {
  resultsList.textContent = '';
  const query = queryInput.value;
  if (query.length < 2) {
    return;
  }
  clearTimeout(timeout);
  timeout = setTimeout(function() {
    console.time(`Do search for ${query}`);
    const results = index.search(query, SEARCH_OPTIONS);
    if (results.length > 0) {
      displayMatches(results, query);
    }
    console.timeEnd(`Do search for ${query}`);
  }, DEBOUNCE_DELAY);
}

function displayMatches(results, query) {
  const exactPhrase = new RegExp(query, 'i');
  // keep exact matches only
  // results = results.filter(function(result) {
  //   return exactPhrase.test(result.doc.t);
  // });
  // prefer exact matches
  results = results.sort((a, b) => {
    return exactPhrase.test(a.doc.t) ? -1 : exactPhrase.test(b.doc.t) ? 1 : 0;
  });
  // sort not necessary
  // results = results.sort((a, b) =>
  // a.doc.l.localeCompare(b.doc.l, {numeric: true}));
  for (const result of results) {
    addResult(result.doc);
  }
}

function addResult(match) {
  const resultElement = document.createElement('li');
  resultElement.classList.add('match');
  resultElement.dataset.location = match.l;
  const text = match.s ? match.t : `<em>${match.t}</em>`;
  resultElement.appendChild(document.createTextNode(text));
  resultElement.onclick = function() {
    console.log(match.id);
  };
  resultsList.appendChild(resultElement);
}