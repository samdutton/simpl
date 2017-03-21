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
