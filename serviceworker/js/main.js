'use strict';

if ('serviceWorker' in navigator) {
  console.log('serviceWorker in navigator');
  navigator.serviceWorker.register('js/sw.js', {
    // scope is relative to index.html
    scope: './'
  }).then(function(registrationObject) {
    console.log('Registration succeeded', registrationObject);
  }).catch (function(e) {
    console.log('Registration failed', e);
  });
}
