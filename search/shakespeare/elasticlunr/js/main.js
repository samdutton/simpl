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
const textDiv = document.getElementById('text');

const SEARCH_OPTIONS = {
  fields: {
    t: {}
  },
  bool: 'AND',
  expand: true // true means matches are not whole-word-only
};

var index;

const INDEX_FILE = 'data/index.json';
const HTML_DIR = '/html/';

var timeout = null;
const DEBOUNCE_DELAY = 300;

// if (navigator.serviceWorker) {
//   navigator.serviceWorker.register('sw.js').catch(function(error) {
//     console.error('Unable to register service worker.', error);
//   });
// }

window.onpopstate = function(event) {
  console.log('popstate event', event.state);
  if (event.state && event.state.isSearchResults) {
    hide(textDiv);
    show(matchesList);
  } else {
    show(textDiv);
    hide(matchesList);
  }
};

// window.onhashchange = function(event) {
//   console.log('hashchange event', event.state);
// };

// window.onbeforeunload = function(event) {
//   console.log('beforeunload event', event);
// };

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
  if (location.hash) {
    const query = location.hash.slice(1);
    queryInput.value = query;
    doSearch(query);
  } else {
    queryInput.placeholder = 'Enter search text';
  }
  queryInput.focus();
});

// Search whenever query input text changes, with debounce delay
queryInput.oninput = function() {
  matchesList.textContent = '';
  const query = queryInput.value;
  if (query.length > 2) {
    // debounce text entry
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      doSearch(query);
    }, DEBOUNCE_DELAY);
  }
};

function doSearch(query) {
  document.title = `Search Shakespeare: ${query}`;
  matchesList.textContent = '';
  console.time(`Do search for ${query}`);
  const matches = index.search(query, SEARCH_OPTIONS);
  if (matches.length > 0) {
    hide(textDiv); // hide the div for displaying play or poem texts
    displayMatches(matches, query);
    show(matchesList); // show search results (matches)
  }
  console.timeEnd(`Do search for ${query}`);
}

// Display a list of matched lines, stage directions and scene descriptions
function displayMatches(matches, query) {
  //
  // keep exact matches only
  // matches = matches.filter(function(match) {
  //   return exactPhrase.test(match.doc.t);
  // });
  //
  // // sort by play or poem name
  // matches = matches.sort((a, b) => {
  //   return a.doc.l.localeCompare(b.doc.l, {numeric: true});
  // });
  //
  // const exactPhrase = new RegExp(query, 'i');
  // // prefer exact matches
  // matches = matches.sort((a, b) => {
  //  return exactPhrase.test(a.doc.t) ? -1 : exactPhrase.test(b.doc.t) ? 1 : 0;
  // });
  //
  for (const match of matches) {
    addMatch(match.doc, query);
  }
}

// Add an individual match element to the list of matches
function addMatch(match, query) {
  const matchElement = document.createElement('li');
  matchElement.dataset.location = match.l; // location used to find match
  matchElement.dataset.citation = formatCitation(match); // displayed location
  if (match.i) { // stage direction matches have an index
    matchElement.dataset.index = match.i;
  }
  // add classes for stage directions and scene titles (just for text styling)
  if (match.r && match.r === 's') {
    matchElement.classList.add('stage-direction');
  } else if (match.r && match.r === 't') {
    matchElement.classList.add('scene-title');
  }
  matchElement.innerHTML = match.t;
  matchElement.onclick = function() {
    displayText(match, query);
  };
  matchesList.appendChild(matchElement);
}

// Display the appropriate text and location when a user taps/clicks on a match
function displayText(match, query) {
  hide(matchesList);
  // add history entry for the query when the user has tapped/clicked a match
  history.pushState({isSearchResults: true}, null,
      `${window.location.origin}#${query}`);
  // match.l is a citation for a play or poem, e.g. Ham.3.3.2, Son.4.11, Ven.140
  // scene title matches only have act and scene number, e.g. Ham.3.3
  history.pushState({isSearchResults: false}, null,
    `${window.location.origin}#${match.l}`);
  document.title = `Search Shakespeare: ${match.l}`;
  const location = match.l.split('.');
  const text = location[0];
  fetch(`${HTML_DIR}${text}.html`).then(response => {
    return response.text();
  }).then(html => {
    textDiv.innerHTML = html;
    textDiv.onmouseover = addWordSearch;
    show(textDiv);
    highlightMatch(match, location);
  });
}

// When the user hovers over a line, wrap a span around each word in the line
// so they can click on a word to search for it.
function addWordSearch(hoverEvent) {
  const el = hoverEvent.target;
  // hover events are also fired by the parent
  // plays and sonnets use <li> for each line; poems use <p>
  if (el.nodeName === 'LI' || el.nodeName === 'P') {
    el.innerHTML = el.innerText.replace(/([\w]+)/g, '<span>$1</span>');
    el.onclick = spanClickEvent => {
      const word = spanClickEvent.target.textContent;
      queryInput.value = word;
      doSearch(word);
      window.scrollTo(0, 107); // to display search input
    };
  }
}

function highlightMatch(match, location) {
  // matches with either s (speaker) or r (role) properties are plays
  if (match.s || match.r) {
    const actIndex = location[1];
    const sceneIndex = location[2];
    const act = textDiv.querySelectorAll('.act')[actIndex];
    // console.log('acts', textDivDoc.querySelectorAll('.act'));
    const scene = act.querySelectorAll('section.scene')[sceneIndex];
    // text matches are lines, scene titles or stage directions
    if (match.s) { // if the match has a speaker (match.s) it's a spoken line
      const lineIndex = location[3];
      // some list items in speeches are stage directions
      highlightLine(scene, 'li:not(.stage-direction)', lineIndex);
    } else if (match.r === 's') { // match is a stage direction
      highlightLine(scene, '.stage-direction', match.i);
    } else if (match.r === 't') { // match is a scene title, only ever one
      highlightLine(scene, '.scene-description', 0);
    }
  } else { // match is a sonnet or other poem
    // location for sonnets has three parts, e.g. Son.4.11
    // location for other poems only has two parts, e.g. Ven.140
    // Son.html contains all the sonnets; other poems each have their own file
    const isSonnet = location.length === 3;
    const poemElement = isSonnet ?
      textDiv.querySelectorAll('section')[location[1]] : textDiv;
    const lineIndex = isSonnet ? location[2] : location[1];
    // sonnets are each an <ol> with an <li> per line, whereas poems use <p>
    highlightLine(poemElement, 'li, p', lineIndex);
  }
  show(textDiv);
}

// Highlight a match in a play scene or in a poem
function highlightLine(parent, selector, elementIndex) {
  // console.log('parent, selector, element', parent, selector, elementIndex);
  const element = parent.querySelectorAll(selector)[elementIndex];
  element.classList.add('highlight');
  element.scrollIntoView({inline: 'center'});
}

// Format location for display to the right of each match
function formatCitation(match) {
  // matches with r (role) or s (speaker) properties are plays, otherwise poems
  const location = match.l.split('.');
  const text = location[0];
  if (match.s || match.r) {
    const actIndex = location[1];
    const actNum = +actIndex + 1; // use + to make integer
    const sceneIndex = location[2];
    const sceneNum = +sceneIndex + 1;
    const lineIndex = location[3]; // undef for stage dirs and scene titles
    return lineIndex ? `${text}.${actNum}.${sceneNum}.${+lineIndex + 1}` :
      `${text}.${actNum}.${sceneNum}`;
  } else {
    // location for sonnets has three parts, e.g. Son.4.11
    // location for other poems only has two parts, e.g. Ven.140
    // Son.html contains all the sonnets; other poems each have their own file
    const isSonnet = location.length === 3;
    return isSonnet ? `${text}.${+location[1] + 1}.${+location[2] + 1}` :
      `${text}.${+location[1] + 1}`; // use + to make integer
  }
}

// Utility functions

function hide(element) {
  element.classList.add('hidden');
}

function show(element) {
  element.classList.remove('hidden');
}