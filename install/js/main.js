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
