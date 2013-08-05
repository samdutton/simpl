var dataDiv = document.querySelector('#data');
function log(message){
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

