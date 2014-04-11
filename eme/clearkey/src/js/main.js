// Define a key: hardcoded in this example
var KEY = new Uint8Array([0xeb, 0xdd, 0x62, 0xf1, 0x68, 0x14, 0xd2, 0x7b,
  0x68, 0xef, 0x12, 0x2a, 0xfc, 0xe4, 0xae, 0x3c]);

// Specify the Key System used: in this example, Clear Key
var keySystem = 'webkit-org.w3.clearkey';

var dataElement = document.querySelector('#data');
var videoElement = document.querySelector('video');

videoElement.addEventListener('webkitneedkey', onNeedKey);
videoElement.addEventListener('webkitkeymessage', onKeyMessage);
videoElement.addEventListener('webkitkeyerror', onKeyError);
videoElement.addEventListener('webkitkeyadded', onKeyAdded);

// Handle the needkey event
function onNeedKey(e) {
  logEvent('needkey', e);
  // Generate a key request, specifying the Key System and media InitData
  // e.target is the video
  console.log('Generate key request with initData', e.initData);
  e.target.webkitGenerateKeyRequest(keySystem, e.initData);
}

function onKeyAdded(e) {
  logEvent('keyadded', e);
}

// Handle a key message, adding a key
function onKeyMessage(e) {
  logEvent('keymessage', e);
  var initData = e.message;
  // e.target is the video
  e.target.webkitAddKey(keySystem, KEY, initData);
}

function onKeyError(e){
  console.log('Error: ', e)
}

function logEvent(eventName, e){
  dataElement.innerHTML +=  eventName + ' event' + '<br />';
  console.log(eventName, e);
}
