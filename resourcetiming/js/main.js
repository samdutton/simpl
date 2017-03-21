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

var data = document.querySelector('p#data');

function log(message) {
  data.innerHTML += message + '<br />';
}

window.onload = function() {
  if (!window.performance.getEntriesByType) {
    log('This browser does not support the Resource Timing API :^\\.');
    return;
  }
  var resources = window.performance.getEntriesByType('resource');
  for (var i = 0; i !== resources.length; ++i) {
    var resource = resources[i];
    if (resource.initiatorType === 'img') {
      var nameParts = resource.name.split('/');
      var name = nameParts[nameParts.length - 1];
      if (name.length > 50) {
        name = name.substring(0, 50) + '...';
      }
      var fetchTime = Math.round(resource.responseEnd - resource.startTime);
      if (name.indexOf('.jpg') !== -1) {
        log(name + ': ' + fetchTime);
      }
    }
  }
};
