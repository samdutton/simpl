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
  'data/index.json',
  'js/main.js',
  'js/lib/elasticlunr.min.js'
];

const TEXTS = ["html/Ado.html", "html/Ant.html", "html/AWW.html", "html/AYL.html", "html/Cor.html", "html/Cym.html", "html/FE.html", "html/E3.html", "html/Err.html", "html/Ham.html", "html/1H4.html", "html/2H4.html", "html/H5.html", "html/1H6.html", "html/2H6.html", "html/3H6.html", "html/H8.html", "html/JC.html", "html/Jn.html", "html/LLL.html", "html/Lr.html", "html/Mac.html", "html/MM.html", "html/MND.html", "html/MV.html", "html/Oth.html", "html/Per.html", "html/R2.html", "html/R3.html", "html/Rom.html", "html/Shr.html", "html/TGV.html", "html/Tim.html", "html/Tit.html", "html/TM.html", "html/Tmp.html", "html/TN.html", "html/TNK.html", "html/Wiv.html", "html/WT.html", "html/DF.html", "html/LC.html", "html/PP.html", "html/PhT.html", "html/Luc.html", "html/SID.html", "html/Son.html", "html/Tro.html", "html/TTQ.html", "html/Ven.html"];

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
  cache.addAll(TEXTS);
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
