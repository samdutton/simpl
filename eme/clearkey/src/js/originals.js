// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var QueryString = function() {
  // Allows access to query parameters on the URL; e.g., given a URL like:
  //    http://<server>/my.html?test=123&bob=123
  // Parameters can then be accessed via QueryString.test or QueryString.bob.
  var params = {};
  // RegEx to split out values by &.
  var r = /([^&=]+)=?([^&]*)/g;
  // Lambda function for decoding extracted match values. Replaces '+' with
  // space so decodeURIComponent functions properly.
  function d(s) { return decodeURIComponent(s.replace(/\+/g, ' ')); }
  var match;
  while (match = r.exec(window.location.search.substring(1)))
    params[d(match[1])] = d(match[2]);
  return params;
}();

var USE_WV_SERVER = QueryString.use_wv_server;
var drm_server = QueryString.serverURL;
var mediaFile = QueryString.mediafile;
var keySystem = QueryString.keysystem;

if (!drm_server)
  drm_server = "http://shawarma.kir/drm";

if (!keySystem)
  keySystem = 'com.widevine.alpha';
var mediaType = QueryString.mediatype;
if (!mediaType)
  mediaType = 'video/webm; codecs="vorbis, vp8"'
// Default key used to encrypt many media files used in browser tests.
var KEY = new Uint8Array([0xeb, 0xdd, 0x62, 0xf1, 0x68, 0x14, 0xd2, 0x7b,
                          0x68, 0xef, 0x12, 0x2a, 0xfc, 0xe4, 0xae, 0x3c]);
// Key ID used for init data.
var keyID = "0123456789012345";
// Stores a failure message that is read by the browser test when it fails.
var failMessage = '';

function failTest(msg) {
  if (msg instanceof Event)
    failMessage = msg.target + '.' + msg.type;
  else
    failMessage = msg;
  console.log(failMessage);
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

function loadEncryptedMediaFromURL(video, useSRC) {
  return loadEncryptedMedia(video, mediaFile, keySystem, mediaType, useSRC);
}

function ConvertToArray(input) {
  var isArray = false;
  if (Array.isArray)
    isArray = Array.isArray(input);
  if (typeof(input) == 'string')
    isArray = false;
  if (isArray)
    return input;
  else
    return [input];
}

function loadEncryptedMedia(video, mediaFiles, keySystem, mediaTypes, useSRC) {
  console.log('Trying to run:');
  console.log('mediaFiles: ' + mediaFiles);
  console.log('mediaTypes: ' + mediaTypes);
  console.log('keySystem: ' + keySystem);
  mediaSource = null;
  video = video;

  // Add a property to video to check key was added.
  video.hasKeyAdded = false;
  mediaFiles = ConvertToArray(mediaFiles);
  mediaTypes = ConvertToArray(mediaTypes);

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
    video.src = mediaFile;
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
  if (keySystem == 'com.widevine.alpha' || USE_WV_SERVER) {
    console.log('Requesting key from widevine server.');
    requestKey(e);
  }
  else {
    var initData = e.message;
    if (keySystem.indexOf('clearkey') != -1 && mediaType.indexOf('mp4') != -1)
      initData = initDataFromKeyId(); // Temporary hack for Clear Key in v0.1.
    e.target.webkitAddKey(keySystem, KEY, initData);
  }
}

function requestKey(cdm) {
  if (cdm.defaultURL && cdm.defaultURL.indexOf('googleapis') >= 0) {
    sendForProvisioning(cdm);
    return;
  }
  var server = drm_server;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.responseType = 'arraybuffer';
  console.log('Sending request to ' + server);
  xmlhttp.open("POST", server, true);

  xmlhttp.onload = function(e) {
    if (this.status == 200) {
      var key = new Uint8Array(this.response);
      console.log('license response', key);
      console.log('license response hex', getHexString(key));
      cdm.target.webkitAddKey(keySystem, key, initDataFromKeyId(),
                              cdm.sessionId);
    } else {
      console.log('Bad response: ' + this.response);
      console.log('license response bad status = ' + this.status);
    }
  }
  console.log('license request', cdm.message);
  console.log('license request hex', getHexString(cdm.message));
  msg = cdm.message;
  xmlhttp.send(cdm.message);
}

function sendForProvisioning(cdm) {
  var xmlhttp = new XMLHttpRequest();
  console.log("CDM Default URL = " + cdm.defaultURL)
  var server = cdm.defaultURL;// + "&signedRequest=ClQKTAgAEkgAAAACAAAAqnz0xMZeY1fwqYwRgGoiBIHR6JQSAgXwXW89Nw0sPP1WaNaluLJYe7fPS3IiLW9F6eBtstZApwygwBuWH3r5DLcSBKB05vsSIDoYfz6C9BlulHe_sJcWpj1ttH8TYzk8LCSl89jY9ssP";
  //"http://www-googleapis-test.sandbox.google.com/certificateprovisioning/v1/devicecertificates/create?signedRequest=CnEKZQgAEkgAAAACAAAQBCCL8LqJOXO2WYJipHIM_vRwpwrG5XxeBEOPoocr4QFnugSZc-GSbm6a92dOzf-4Q8C3pV7E1z8188GEIub4LvwaFwoJdGVzdCBuYW1lEgp0ZXN0IHZhbHVlEggBI0VniavN7xIgrPJj6xEsV_VMPdj4SgS1iEOV00Qpl6h6PRQV6eKdg28";
  xmlhttp.responseType = 'application/json';

  console.log('Sending request to ' + server);
  xmlhttp.open("POST", server, true);

  xmlhttp.onload = function(e) {
    if (this.status == 200) {
      console.log('Response: ' + this.response);
      var key = convertToUnit8Array(this.response);
      cdm.target.webkitAddKey(keySystem, key, new Uint8Array(1), cdm.sessionId);
    } else {
      console.log('Bad response: ' + this.response);
      console.log('Response status: ' + this.status);
    }
  }
  console.log('Request message: ' + cdm.message);
  xmlhttp.send(cdm.message);
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

function initDataFromKeyId() {
  var init_key_id = new Uint8Array(keyID.length);
  for(var i = 0; i < keyID.length; i++) {
    init_key_id[i] = keyID.charCodeAt(i);
  }
  return init_key_id;
}

function convertToUnit8Array(msg) {
  var ans = new Uint8Array(msg.length);
  for(var i = 0; i < msg.length; i++) {
    ans[i] = msg.charCodeAt(i);
  }
  return ans;
}

function removeEventListeners(video, mediaSource) {
  if (mediaSource)
    mediaSource.removeEventListener('webkitsourceopen', onSourceOpen);
  video.removeEventListener('webkitneedkey', onNeedKey);
  video.removeEventListener('webkitkeymessage', onKeyMessage);
  video.removeEventListener('webkitkeyerror', failTest);
  video.removeEventListener('webkitkeyadded', onKeyAdded);
}
