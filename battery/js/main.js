'use strict';

function log(message) {
  document.querySelector('#data').innerHTML += message + '<br />';
}

function logBattery(battery) {
  window.battery = battery;
  console.log('Battery: ', battery);
  log('Battery level: ' + battery.level);
  log('Battery charging: ' + battery.charging);
  if (battery.dischargingTime) {
    log('Battery discharging time: ' + battery.dischargingTime);
  }
  battery.addEventListener('chargingchange', function() {
    log('Battery chargingchange event: ' + battery.charging);
  }, false);
}

if (navigator.getBattery) {
  navigator.getBattery().then(logBattery, function() {
    log('There was an error getting the battery state.');
  });
} else if (navigator.battery) {
  logBattery(navigator.battery);
} else {
  log('Shame! The Battery API is not supported on this platform.');
}
