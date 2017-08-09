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

/* global lunr */

fetch('data/index.json').then(response => {
  return response.json();
}).then(json => {
  startPerf();
  const index = lunr.Index.load(json);
  endPerf();
  logPerf('Index loading');
  startPerf();
  window.matches = index.search('crew');
  endPerf();
  logPerf('Search');
  console.log('Matches: ', matches);
});

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
