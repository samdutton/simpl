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

const queryInput = document.getElementById('query');
const matchList = document.getElementById('matches');

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
  matchList.innerHTML = '';
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
    expand: true
  };
  const matches = window.matches = index.search(query, options);
  endPerf();
  logPerf('Search');
  displayMatches(matches);
};

function displayMatches(matches) {
  if (matches.length === 0) {
    matchList.innerHTML = 'No matches';
    return;
  }
  console.log('Matches: ', matches);
  for (let match of matches) {
    matchList.innerHTML += '<li>' + match.ref + '</li>';
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
