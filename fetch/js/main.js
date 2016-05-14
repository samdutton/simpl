'use strict';

var data = document.getElementById('data');

fetch('json/foo.json').then(function(response) {
  return response.json();
}).then(function(j) {
  data.textContent = 'JSON fetched:\n\n' + JSON.stringify(j, null, 2);
});
