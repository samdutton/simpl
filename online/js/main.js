function log(message){
  document.querySelector('#data').innerHTML += message + '<br /><br />';
}

if (typeof navigator.onLine != 'undefined') {

  if (navigator.onLine) {
    log('navigator.onLine says you\'re online');
  } else {
    log('navigator.onLine says you\'re offline.');
  }

  window.ononline = function() {
    log('window.ononline says you\'re online.');
  };
  window.onoffline = function() {
    log('window.ononline says you\'re offline.');
  };

} else {
	log('Shame! navigator.onLine is not supported on this platform.')
}
