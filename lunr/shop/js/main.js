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

const itemNavigationElement = document.getElementById('itemNavigation');
const matchesElement = document.getElementById('matches');
const nextPageLink = document.getElementById('nextPage');
nextPageLink.onclick = showNextPage;
const previousPageLink = document.getElementById('previousPage');
previousPageLink.onclick = showPreviousPage;
const queryInfoElement = document.getElementById('queryInfo');
const queryInput = document.getElementById('query');

const MATCHES_PER_PAGE = 10;
const SEARCH_OPTIONS = {
  fields: {
    title: {boost: 2},
    description: {boost: 1}
  },
  bool: 'OR',
  expand: true // true: do not require whole-word matches only
};

var currentPage = 0;
var index;
var matches;

// Get index data and load Elastic Lunr index
fetch('data/index1000.json').then(response => {
  return response.json();
}).then(json => {
  elasticlunr.clearStopWords();
  startPerf();
  index = elasticlunr.Index.load(json);
  endPerf();
  logPerf('Index loading');
  // TODO: un-disable search
});

queryInput.focus();
// Search for products whenever query input text changes
queryInput.oninput = doSearch;

function doSearch() {
  matchesElement.textContent = '';
  displayMatchInfo('');
  displayItemNavigationInfo('');
  currentPage = 0;

  const query = queryInput.value;
  if (query.length < 2) {
    return;
  }

  startPerf();
  matches = window.matches = index.search(query, SEARCH_OPTIONS);
  console.log('matches', matches);
  endPerf();
  logPerf('Search');

  if (matches.length === 0) {
    displayMatchInfo('No matches :^\\');
    displayItemNavigationInfo('');
    return;
  } else {
    displayMatches(0);
  }
}

function displayMatches() {
  matchesElement.textContent = '';

  // find index for first and last match to appear on the current page
  var startIndex = currentPage * MATCHES_PER_PAGE;
  var endIndex = Math.min((currentPage + 1) * MATCHES_PER_PAGE,
    matches.length);

  displayMatchInfo('Showing ' + (startIndex + 1) + ' to ' + endIndex +
    ' of ' + matches.length + ' matching item(s)');
  displayItemNavigationInfo('Click on an item to view product details');

  for (let i = startIndex; i !== endIndex; ++i) {
    displayMatch(matches[i]);
  }

  if (matches.length > currentPage * MATCHES_PER_PAGE + MATCHES_PER_PAGE) {
    show(nextPageLink);
  } else {
    hide(nextPageLink);
  }
  if (currentPage === 0) {
    hide(previousPageLink);
  } else {
    show(previousPageLink);
  }
}

function displayMatch(match) {
  var matchElement = document.createElement('div');
  matchElement.classList.add('match');
  matchElement.textContent = match.doc.title;
  matchesElement.appendChild(matchElement);
}

function displayMatchInfo(message) {
  if (message === '') {
    hide(queryInfoElement);
  } else {
    show(queryInfoElement);
    queryInfoElement.textContent = message;
  }
}

function displayItemNavigationInfo(message) {
  if (message === '') {
    hide(itemNavigationElement);
  } else {
    show(itemNavigationElement);
    itemNavigationElement.textContent = message;
  }
}

function showNextPage() {
  hide(nextPageLink);
  hide(previousPageLink);
  currentPage++;
  displayMatches();
}

function showPreviousPage() {
  hide(nextPageLink);
  hide(previousPageLink);
  currentPage--;
  displayMatches();
}

// General utility functions

function show(element) {
  element.classList.remove('hidden');
}

function hide(element) {
  element.classList.add('hidden');
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
