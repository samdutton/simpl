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

/* global elasticlunr */

const nextPageElement = document.getElementById('nextPage');
const previousPageElement = document.getElementById('previousPage');
const queryInput = document.getElementById('query');
const resultsElement = document.getElementById('results');

const MATCHES_PER_PAGE = 10;
var currentPage = 0;
var index;

fetch('data/index1000.json').then(response => {
  return response.json();
}).then(json => {
  startPerf();
  index = elasticlunr.Index.load(json);
  endPerf();
  logPerf('Index loading');
  // un-disable search
});

queryInput.focus();
queryInput.oninput = function() {
  resultsElement.innerHTML = '';
  const query = queryInput.value;
  if (query.length < 2) {
    return;
  }
  startPerf();
  const options = {
    fields: {
      title: {boost: 2},
      description: {boost: 1}
    },
    bool: 'OR',
    expand: true // true: do not require whole-word matches only
  };
  const matches = window.matches = index.search(query, options);
  endPerf();
  logPerf('Search');
  displayMatches(matches);
};

function displayMatches(matches) {
  if (matches.length === 0) {
    resultsElement.innerHTML = 'No matches';
    return;
  }
  // console.log('Matches: ', matches);
  console.log('Match doc: ', matches[0].doc);
  for (let match of matches) {
    resultsElement.innerHTML += '<li>' + match.ref + '</li>';
  }
}

// window.performance utilities

function startPerf() {
  window.performance.mark('start');
}

function endPerf() {
  window.performance.mark('end');
}

function logPerf(message) {
  window.performance.clearMeasures();
  window.performance.measure('duration', 'start', 'end');
  const duration =
  performance.getEntriesByName('duration')[0].duration.toPrecision(4);
  console.log(`${message} took ${duration} ms`);
}
