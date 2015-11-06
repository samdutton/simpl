'use strict';

if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported :^)');
  // scope and URLs are relative to index.html
  navigator.serviceWorker.register('sw.js', {
    scope: './'
  }).then(function(registrationObject) {
    console.log('Registration succeeded', registrationObject);
  }).catch(function(error) {
    console.log('Registration failed — make sure to run via HTTPS or localhost',
      error);
  });
} else {
  console.log('Service Worker is not supported :^(');
}

