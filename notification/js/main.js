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

/* globals Notification */

// More information at https://developer.mozilla.org/en-US/docs/WebAPI/Using_Web_Notifications

// Tags are used to avoid excessive notifications:
// if a tag is set in the options, only the most recent
// notification for this tag will be displayed.

var button = document.querySelector('button');
var input = document.querySelector('input');

var notify = function() {
  var options = {
    body: input.value,
    icon: 'icon.png',
    tag: 'foo',
    type: 'basic'
  };
  var n = new Notification('Greetings from simpl.info!', options);
  n.onclick = function() {
    console.log('Clicked.');
  };
  n.onclose = function() {
    console.log('Closed.');
  };
  n.onshow = function() {
    console.log('Shown.');
  };
};

button.onclick = function() {
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification');
  } else if (Notification.permission === 'granted') {
    notify();
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function(permission) {
      if (!('permission' in Notification)) {
        Notification.permission = permission;
      }
      if (permission === 'granted') {
        notify();
      }
    });
  }
};
