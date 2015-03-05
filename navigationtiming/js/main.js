'use strict';

var data = document.querySelector('p#data');

function log(message) {
  data.innerHTML += message + '<br />';
}

log(JSON.stringify(window.performance));
