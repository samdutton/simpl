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

var dataDiv = document.querySelector('#data');

function log(message) {
  dataDiv.innerHTML = message + '<br />' + dataDiv.innerHTML;
}

function handleDeviceMotion(e) {
  var x = e.acceleration.x;
  var y = e.acceleration.y;
  var z = e.acceleration.z;
  log('Acceleration: ' + x + ', ' + y + ', ' + z);

  var xg = e.accelerationIncludingGravity.x;
  var yg = e.accelerationIncludingGravity.y;
  var zg = e.accelerationIncludingGravity.z;
  log('Acceleration including gravity: ' + xg + ', ' + yg + ', ' + zg);

  var alpha = e.rotationRate.alpha;
  var beta = e.rotationRate.beta;
  var gamma = e.rotationRate.gamma;
  log('Rotation rate: ' + alpha + ', ' + beta + ', ' + gamma);

  log('Refresh interval: ' + e.interval);
}

if (window.DeviceMotionEvent) {
  window.ondevicemotion = handleDeviceMotion;
} else {
  log('Device Motion not supported.');
}
