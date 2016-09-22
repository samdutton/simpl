'use strict';

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
