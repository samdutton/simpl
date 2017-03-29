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

var ws, serverInput, textInput, log,
  connectButton, disconnectButton, sendButton;

serverInput = document.getElementById('serverInput');
textInput = document.getElementById('textInput');
log = document.getElementById('log');

connectButton = document.getElementById('connectButton');
disconnectButton = document.getElementById('disconnectButton');
sendButton = document.getElementById('sendButton');

connectButton.addEventListener('click', clickConnect, false);
disconnectButton.addEventListener('click', clickDisconnect, false);
sendButton.addEventListener('click', clickSend, false);

function clickConnect() {
  ws = new WebSocket(serverInput.value);

  ws.onopen = function(evt) {
    logMessage('', 'Connected');
    connectButton.disabled = true;
    disconnectButton.disabled = false;
    sendButton.disabled = false;
  };

  ws.onclose = function(evt) {
    logMessage('err', 'Disconnected');
    connectButton.disabled = false;
    disconnectButton.disabled = true;
    sendButton.disabled = true;
  };

  ws.onmessage = function(evt) {
    logMessage('msg', 'Received: ' + evt.data);
  };

  ws.onerror = function(evt) {
    logMessage('err', 'Error: ' + evt.data);
  };
}

function clickDisconnect() {
  ws.close();
}

function clickSend() {
  logMessage('send', 'Sent: ' + textInput.value);
  ws.send(textInput.value);
}

function logMessage(type, msg) {
  log.innerHTML += '<p class="' + type + '">' + msg + '</p>';
}

