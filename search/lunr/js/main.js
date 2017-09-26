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

const backToResultsElement = document.getElementById('backToResults');
backToResultsElement.onclick = backToResults;
const itemNavigationElement = document.getElementById('itemNavigation');
const matchesElement = document.getElementById('matches');
const nextPageLink = document.getElementById('nextPage');
nextPageLink.onclick = showNextPage;
const pageNavigationElement = document.getElementById('pageNavigation');
const previousPageLink = document.getElementById('previousPage');
previousPageLink.onclick = showPreviousPage;
const productInfoElement = document.getElementById('productInfo');
const matchesInfoElement = document.getElementById('matchesInfo');
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

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('sw.js').catch(function(error) {
    console.error('Unable to register service worker.', error);
  });
}

// Get index data and load Elastic Lunr index
fetch('data/index1000.json').then(response => {
  return response.json();
}).then(json => {
  elasticlunr.clearStopWords();
  startPerf();
  index = elasticlunr.Index.load(json);
  endPerf();
  logPerf('Index loading');
  queryInput.disabled = false;
  queryInput.focus();
});

// Search for products whenever query input text changes
queryInput.oninput = doSearch;

function doSearch() {
  matchesElement.textContent = '';
  showMatchInfo('');
  showItemNavigationInfo('');
  hide(nextPageLink);
  hide(previousPageLink);

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
    showMatchInfo('No matches :^\\');
    showItemNavigationInfo('');
    return;
  } else {
    showMatches();
  }
}

function showMatches() {
  matchesElement.textContent = '';

  // find index for first and last match to appear on the current page
  var startIndex = currentPage * MATCHES_PER_PAGE;
  var endIndex = Math.min((currentPage + 1) * MATCHES_PER_PAGE,
    matches.length);

  showMatchInfo('Showing ' + (startIndex + 1) + ' to ' + endIndex +
    ' of ' + matches.length + ' matching item(s)');
  showItemNavigationInfo('Click on an item to view product details');

  for (let i = startIndex; i !== endIndex; ++i) {
    addMatch(matches[i]);
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

function addMatch(match) {
  const matchElement = document.createElement('div');
  matchElement.classList.add('match');
  matchElement.appendChild(document.createTextNode(match.doc.title));
  matchElement.onclick = showProductInfo.bind(match.doc);
  matchesElement.appendChild(matchElement);
}

function showProductInfo() {
  console.log('this', this);
  hide(matchesElement);
  hide(pageNavigationElement);
  show(backToResultsElement);
  // dummy content: could include images if online/cached — whatever
  productInfoElement.innerHTML =
    '<div class="productTitle">' + this.title + '</div>' +
    '<div class="productDescription">' + this.description + '</div>';
  show(productInfoElement);
}

function showMatchInfo(message) {
  if (message === '') {
    hide(matchesInfoElement);
  } else {
    show(matchesInfoElement);
    matchesInfoElement.textContent = message;
  }
}

function showItemNavigationInfo(message) {
  if (message === '') {
    hide(itemNavigationElement);
  } else {
    show(itemNavigationElement);
    itemNavigationElement.textContent = message;
  }
}

function backToResults() {
  hide(backToResultsElement);
  hide(productInfoElement);
  show(pageNavigationElement);
  show(matchesElement);
  if (matches.length > currentPage * MATCHES_PER_PAGE + MATCHES_PER_PAGE) {
    show(nextPageLink);
  }
}

function showNextPage() {
  hide(nextPageLink);
  hide(previousPageLink);
  currentPage++;
  showMatches();
}

function showPreviousPage() {
  hide(nextPageLink);
  hide(previousPageLink);
  currentPage--;
  showMatches();
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
