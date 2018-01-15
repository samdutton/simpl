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

const matchesList = document.getElementById('matches');
const queryInput = document.getElementById('query');
const textIframe = document.querySelector('iframe');

const SEARCH_OPTIONS = {
  fields: {
    t: {}
  },
  bool: 'AND',
  expand: true // true means matches are not whole-word-only
};

var index;

const INDEX_FILE = 'data/index.json';
const HTML_DIR = 'html/';

var timeout = null;
const DEBOUNCE_DELAY = 300;

// if (navigator.serviceWorker) {
//   navigator.serviceWorker.register('sw.js').catch(function(error) {
//     console.error('Unable to register service worker.', error);
//   });
// }

window.addEventListener('popstate', function(event) {
  console.log('popstate event', event);
});

window.addEventListener('hashchange', function(event) {
  console.log('hashchange event', event);
});

window.addEventListener('beforeunload', function(event) {
  console.log('beforeunload event', event);
});

// Get and load index data
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
  queryInput.placeholder = 'Enter search text';
  queryInput.focus();
});

// Search whenever query input text changes, with debounce delay
queryInput.oninput = function() {
  matchesList.textContent = '';
  const query = queryInput.value;
  if (query.length < 3) {
    return;
  }
  // debounce text entry
  clearTimeout(timeout);
  timeout = setTimeout(function() {
    console.time(`Do search for ${query}`);
    const matches = index.search(query, SEARCH_OPTIONS);
    if (matches.length > 0) {
      hide(textIframe); // hide the iframe for play or poem texts
      displayMatches(matches, query);
      show(matchesList);
    }
    console.timeEnd(`Do search for ${query}`);
  }, DEBOUNCE_DELAY);
  history.pushState(null, null, `${window.location.origin}#${query}`);
  document.title = `Search Shakespeare: ${query}`;
};

// Display a list of matched lines, stage directions and scene descriptions
function displayMatches(matches, query) {
  const exactPhrase = new RegExp(query, 'i');
  // keep exact matches only
  // matches = matches.filter(function(match) {
  //   return exactPhrase.test(match.doc.t);
  // });
  // prefer exact matches
  matches = matches.sort((a, b) => {
    return exactPhrase.test(a.doc.t) ? -1 : exactPhrase.test(b.doc.t) ? 1 : 0;
  });
  // sort (not necessary)
  // matches = matches.sort((a, b) =>
  // a.doc.l.localeCompare(b.doc.l, {numeric: true}));
  for (const match of matches) {
    addMatch(match.doc);
  }
}

// Add an individual match element to the list of matches
function addMatch(match) {
  const matchElement = document.createElement('li');
  matchElement.dataset.location = match.l; // location used to find match
  matchElement.dataset.citation = formatCitation(match); // displayed location
  if (match.i) { // stage direction matches have an index
    matchElement.dataset.index = match.i;
  }
  // add em tags if match is stage dir or scene descr, i.e. no speaker (match.s)
  const html = match.s ? match.t : `<em>${match.t}</em>`;
  matchElement.innerHTML = html;
  matchElement.onclick = function() {
    displayText(match);
  };
  matchesList.appendChild(matchElement);
}

// Display the appropriate text and location when a user taps/clicks on a match
function displayText(match) {
  hide(matchesList);
  // match.l is a citation for a play or poem, e.g. Ham.3.3.2
  history.pushState(null, null, `${window.location.origin}/${match.l}`);
  document.title = `Search Shakespeare: ${match.l}`;
  const location = match.l.split('.');
  const play = location[0];
  textIframe.src = `${HTML_DIR}${play}.html`;
  textIframe.onload = function() {
    const actIndex = location[1];
    const sceneIndex = location[2];
    const textIframeDoc = textIframe.contentWindow.document;
    const act = textIframeDoc.querySelectorAll('.act')[actIndex];
    // console.log('acts', textIframeDoc.querySelectorAll('.act'));
    const scene = act.querySelectorAll('section.scene')[sceneIndex];
    // text matches are lines, scene titles or stage directions
    if (match.s) { // if the match has a speaker (match.s) it's a spoken line
      const lineIndex = location[3];
      // some list items in speeches are stage directions
      highlightMatch(scene, 'li:not(.stage-direction)', lineIndex);
    } else if (match.r === 's') { // match is a stage direction
      highlightMatch(scene, '.stage-direction', match.i);
    } else if (match.r === 't') { // match is a scene title, only ever one
      highlightMatch(scene, '.scene-description', 0);
    }
    show(textIframe);
  };
}

function highlightMatch(scene, selector, elementIndex) {
  console.log('scene, selector, elementIndex: ', scene, selector, elementIndex);
  const element = scene.querySelectorAll(selector)[elementIndex];
  element.classList.add('highlight');
  element.scrollIntoView(); // inline: center problematic unless iframe shown :(
  textIframe.contentWindow.scrollBy(0, -220);
}

// Format location for display to the right of each match
function formatCitation(match) {
  const location = match.l.split('.');
  const play = location[0];
  const actIndex = location[1];
  const actNum = +actIndex + 1;
  const sceneIndex = location[2];
  const sceneNum = +sceneIndex + 1;
  const lineIndex = location[3]; // undef for stage dirs and scene descriptions
  return lineIndex ? `${play}.${actNum}.${sceneNum}.${+lineIndex + 1}` :
    `${play}.${actNum}.${sceneNum}`;
}

// Utility functions

function hide(element) {
  element.classList.add('hidden');
}

function show(element) {
  element.classList.remove('hidden');
}