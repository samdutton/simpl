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
  'index.html'
];

const CACHE = 'v2.46';

// From https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
    Promise.all(keyList.map((key) => {
      if (key === CACHE) {
        return;
      }
      caches.delete(key);
    }));
  })());
});

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async() => {
    const cache = await caches.open(CACHE);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(FILES);
  })());
});

self.addEventListener('fetch', (e) => {
  e.respondWith((async() => {
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) {
      return r;
    }
    const response = await fetch(e.request);
    const cache = await caches.open(CACHE);
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});
