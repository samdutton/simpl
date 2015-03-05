'use strict';

var data = document.querySelector('#data');

function log(message) {
  data.innerHTML += message + '<br />' + data.innerHTML;
}

navigator.geolocation.watchPosition(logPosition);

function logPosition(position) {
  console.log(position);
  log('latitude: ' + position.coords.latitude +
    ', longitude: ' + position.coords.longitude);
}
