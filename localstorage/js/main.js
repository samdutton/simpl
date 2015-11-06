'use strict';

document.getElementById('storeButton').addEventListener('click', function() {
  var key = document.getElementById('storeKey').value;
  var value = document.getElementById('storeValue').value;
  // same as localStorage[key] = value;
  localStorage.setItem(key, value);
}, false);

document.getElementById('retrieveButton').addEventListener('click', function() {
  var key = document.getElementById('retrieveKey').value;
  var value = window.localStorage[key];
  document.getElementById('retrieveValue').value = value;
}, false);

// only works if called from a different tab...
// window.addEventListener('storage', function(e){
//   document.getElementById('data').innerHTML =
//     'window.storage event: ' + e.data;
// });

// var length = window.localStorage.length;
// localStorage.removeItem(key);
// localStorage.clear();
