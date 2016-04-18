'use strict';

// ////////////////////////////////////////////////////////////////////
// WARNING: this is a demo only and is NOT SUITABLE for production use.
// See the bug at  https://github.com/samdutton/simpl/issues/68.
// ////////////////////////////////////////////////////////////////////

// view chrome://serviceworker-internals to see console logging

// temporary polyfill for caches: use cachesPolyfill instead
// uses indexedDB to mimic ServiceWorker caching
importScripts('js/lib/serviceworker-cache-polyfill.js');

console.log('self in sw.js: ', self);

self.addEventListener('activate', function(event) {
  // first time new file is successfully installed
  console.log(event);
});

self.addEventListener('error', function(event) {
  console.log(event);
});

self.addEventListener('fetch', function(event) {
  // fired for every page request within ServiceWorker's scope
  // and requests from those pages
  console.log(event, event.request.url);
  // hijack all fetches
  event.respondWith(
    cachesPolyfill.match(event.request).then(function(response) {
      console.log('cache response: ', response);
      // return response from cache or return file fetched from internet
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('install', function(event) {
  // fired the first time the browser sees this version of the ServiceWorker
  console.log(event);
  // wait until installation is complete
  // for more information about Promises see html5rocks.com/en/tutorials/es6/promises
  event.waitUntil(
    cachesPolyfill.open('my-cache').then(function(cache) {
      // cache all the files required to load this page
      return cache.addAll([
        // paths are relative to this file
        // note the use of ../../ not ../../index.html
        '../../',
        '../../css/main.css',
        '../js/main.js',
        // when using polyfill, must be CORS enabled
        'https://trained-to-thrill-proxy.appspot.com/farm4.staticflickr.com/3941/15404299887_b3923f0c79_c.jpg'
      ]);
    })
  );
});
