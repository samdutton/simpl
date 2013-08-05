var logoElement = document.getElementById('orientee');
function handleDeviceOrientation(e) {
  var transform = 'rotate(' + e.gamma + 'deg) rotate3d(1, 0, 0, ' + e.beta + 'deg)';
  logoElement.style.webkitTransform = transform;
  logoElement.style.transform = transform;
}

if (window.DeviceOrientationEvent) {
  window.ondeviceorientation = handleDeviceOrientation;
} else {
  document.querySelector('p#isAvailable').innerHTML = 'Device Orientation is not available.';
}

