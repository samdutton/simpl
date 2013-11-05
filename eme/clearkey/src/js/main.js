// http://shawarma.kir/alcatraz/eme_fps.html

var KEY = new Uint8Array([0xeb, 0xdd, 0x62, 0xf1, 0x68, 0x14, 0xd2, 0x7b,
  0x68, 0xef, 0x12, 0x2a, 0xfc, 0xe4, 0xae, 0x3c]);


// Key ID used for init data.
var keyID = '0123456789012345';
var keySystem = 'webkit-org.w3.clearkey';

var dataElement = document.querySelector('#data');
var videoElement = document.querySelector('video');

videoElement.addEventListener('webkitneedkey', onNeedKey);
videoElement.addEventListener('webkitkeymessage', onKeyMessage);
videoElement.addEventListener('webkitkeyerror',
  function(e){console.log('Error: ', e)});
videoElement.addEventListener('webkitkeyadded', onKeyAdded);

videoElement.src="../../video/Chrome_44-enc_av.webm"

function onNeedKey(e) {
  log('needkey event');
  console.log('keymessage event', e);
  log('Generate key request with initData');
  console.log('Generate key request with initData', e.initData);
  e.target.webkitGenerateKeyRequest(keySystem, e.initData);
}

function onKeyAdded(e) {
  e.target.hasKeyAdded = true;
}

function onKeyMessage(e) {
  log('keymessage event');
  console.log('keymessage event', e);
  var initData = e.message;
  e.target.webkitAddKey(keySystem, KEY, initData);
}

function log(message){
  dataElement.innerHTML += message + '<br />';
}
