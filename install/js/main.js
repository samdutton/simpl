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

var isSecureOrigin = location.protocol === 'https:' ||
  location.host === 'localhost';
if (!isSecureOrigin) {
  alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.' +
    '\n\nChanging protocol to HTTPS');
  location.protocol = 'HTTPS';
}

var installButton = document.getElementById('install');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(() => {
    return navigator.serviceWorker.ready;
  }).then(reg => {
    console.log('Service Worker ready :^)', reg);
  }).catch(error => {
    console.log('Service Worker error :^(', error);
  });
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
//    console.log('beforeinstallprompt event:', event);
    installButton.removeAttribute('hidden');
    installButton.addEventListener('click', () => {
      event.prompt();
      installButton.setAttribute('disabled', true);
    });
  });
}
