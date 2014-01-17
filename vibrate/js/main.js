if (navigator.vibrate) {
  navigator.vibrate(1000); // doesn't seem to work in Chrome or Firefox
  navigator.vibrate([1000, 500, 1000, 500, 1000, 500]); // vibrate, pause...
} else {
  alert('navigator.vibrate() is not supported on this platform :\'{.');
}
