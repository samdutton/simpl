/*
  Copyright 2017 Google Inc. All Rights Reserved.
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

const FILES = [
  'index.html',
  'css/main.css',
  'data/index1000.json',
  'js/main.js',
  'js/lib/elasticlunr.min.js'
];

self.addEventListener('install', (event) => {
  console.log('Service worker:', event);
  event.waitUntil(installHandler(event));
});

self.addEventListener('activate', (event) => {
  console.log('Service worker:', event);
  clients.claim();
});

self.addEventListener('fetch', (event) => {
  // console.log('Fetch:', event.request.url.split('/').pop().substring(0,40));
  event.respondWith(fetchHandler(event.request));
});

/* eslint-disable */
async function installHandler(event) { // eslint-disable-line
  const cache = await caches.open('v1');
  cache.addAll(FILES);
  self.skipWaiting();
}
/* eslint-enable */

async function fetchHandler(request) {
  const cache = await caches.open('v1');
  const cacheResult = await cache.match(request);
  if (cacheResult) {
    return cacheResult;
  }
  const fetchResult = await fetch(request);
  if (fetchResult.ok) {
    cache.put(request, fetchResult.clone());
  }
  return fetchResult;
}
