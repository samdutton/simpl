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

var index;
var docs;

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
    const results = index.search(query);
    if (results.length > 0) {
      displayMatches(results, query);
    }
    console.timeEnd(`Do search for ${query}`);
  }, DEBOUNCE_DELAY);
}

function displayMatches(matches, query) {
  let results = [];
  const exactPhrase = new RegExp(query, 'i');
  // keep exact matches only
  // results = results.filter(function(result) {
  //   return exactPhrase.test(result.doc.t);
  // });
  for (const match of matches) {
    results.push(docs[match.ref]);
  }
  // sort alphanumerically by play location
  results = results.sort((a, b) =>
    a.l.localeCompare(b.l, {numeric: true}));
  // prefer exact matches
  results = results.sort((a, b) => {
    return exactPhrase.test(a.t) ? -1 : exactPhrase.test(b.t) ? 1 : 0;
  });
  for (const result of results) {
    addResult(result);
  }
}

function addResult(result) {
  const resultElement = document.createElement('li');
  resultElement.classList.add('match');
  resultElement.dataset.location = result.l;
  const text = result.s ? result.t : `<em>${result.t}</em>`;
  resultElement.innerHTML = text;
  resultElement.onclick = function() {
    console.log(result.id);
  };
  resultsList.appendChild(resultElement);
}