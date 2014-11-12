// http://shawarma.kir/alcatraz/eme_fps.html

var KEY = new Uint8Array([0xeb, 0xdd, 0x62, 0xf1, 0x68, 0x14, 0xd2, 0x7b,
                          0x68, 0xef, 0x12, 0x2a, 0xfc, 0xe4, 0xae, 0x3c]);


// Key ID used for init data.
var keyID = "0123456789012345";
// Stores a failure message that is read by the browser test when it fails.
var failMessage = '';

var mediaFiles = ['../video/Chrome_44-enc_av.webm'];
var keySystem = 'webkit-org.w3.clearkey';
var mediaTypes = ['video/webm; codecs="vorbis, vp8"'];

var videoElement = document.querySelector("video");

loadEncryptedMedia(videoElement, mediaFiles, keySystem, mediaTypes, true);


function loadEncryptedMedia(video, mediaFiles, keySystem, mediaTypes, useSRC) {
  console.log('Trying to run:');
  console.log('mediaFiles: ' + mediaFiles);
  console.log('mediaTypes: ' + mediaTypes);
  console.log('keySystem: ' + keySystem);
  mediaSource = null;

  // Add a property to video to check key was added.
  video.hasKeyAdded = false;
  // mediaFiles = ConvertToArray(mediaFiles);
  // mediaTypes = ConvertToArray(mediaTypes);

  if (!(video && mediaFiles && keySystem))
    failTest('Missing parameters in loadEncryptedMedia().');

  var totalAppended = 0;
  function onSourceOpen(e) {
    console.log('onSourceOpen', e);
    // We can load multiple media files using the same media type. However, if
    // more than one media type is used, we expect to have a media type entry
    // for each corresponding media file.
    var srcBuffer = null;
    for (var i = 0; i < mediaFiles.length; i++) {
      if (i == 0 || mediaFiles.length == mediaTypes.length) {
        console.log('Creating a source buffer for type ' + mediaTypes[i]);
        srcBuffer = mediaSource.addSourceBuffer(mediaTypes[i]);
      }
      doAppend(mediaFiles[i], srcBuffer);
    }
  }
  function doAppend(mediaFile, srcBuffer) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', mediaFile);
    xhr.responseType = 'arraybuffer';
    xhr.addEventListener('load', function(e) {
      console.log('Appending to buffer ' + mediaFile);
      srcBuffer.append(new Uint8Array(e.target.response));
      totalAppended++;
      if (totalAppended == mediaFiles.length)
        mediaSource.endOfStream();
    });
    xhr.send();
  }
  //removeEventListeners(video, mediaSource);

  video.addEventListener('webkitneedkey', onNeedKey);
  video.addEventListener('webkitkeymessage', onKeyMessage);
  video.addEventListener('webkitkeyerror', failTest);
  video.addEventListener('webkitkeyadded', onKeyAdded);

  if (useSRC)
    video.src = mediaFiles[0];
  else {
    mediaSource = new WebKitMediaSource();
    mediaSource.addEventListener('webkitsourceopen', onSourceOpen);
    video.src = window.URL.createObjectURL(mediaSource);
  }
}


function onNeedKey(e) {
  console.log('onNeedKey', e);
  console.log('Generate key request with initData: ' + getHexString(e.initData));
  e.target.webkitGenerateKeyRequest(keySystem, e.initData);
}

function onKeyAdded(e) {
  e.target.hasKeyAdded = true;
}

function onKeyMessage(e) {
  console.log('onKeyMessage', e);
  if (isHeartBeatMessage(e.message)) {
    console.log('onKeyMessage - heart beat', e);
    return;
  }
  // if (keySystem == 'com.widevine.alpha' || USE_WV_SERVER) {
  //   console.log('Requesting key from widevine server.');
  //   requestKey(e);
  // }
  else {
    var initData = e.message;
    if (keySystem.indexOf('clearkey') != -1 && mediaTypes[0].indexOf('mp4') != -1)
      initData = initDataFromKeyId(); // Temporary hack for Clear Key in v0.1.
    e.target.webkitAddKey(keySystem, KEY, initData, e.sessionId);
  }
}


function failTest(msg) {
  if (msg instanceof Event)
    failMessage = msg.target + '.' + msg.type;
  else
    failMessage = msg;
  console.log(failMessage);
}

function getHexString(uintArray) {
  var hex_str = ""
  for (var i = 0; i < uintArray.length; i++) {
   var hex = uintArray[i].toString(16);
   if (hex.length == 1) { hex = "0" + hex; }
   hex_str += hex;
  }
  return hex_str;
}

// Heart beat message header.
var HEART_BEAT_HEADER = 'HEARTBEAT';

function isHeartBeatMessage(msg) {
  if (msg.length < HEART_BEAT_HEADER.length)
    return false;
  for (var i = 0; i < HEART_BEAT_HEADER.length; ++i) {
    if (HEART_BEAT_HEADER[i] != String.fromCharCode(msg[i]))
      return false;
  }
  return true;
}

