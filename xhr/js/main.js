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

var xhr = new XMLHttpRequest();
xhr.open('GET', 'data.json');

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    var data = JSON.parse(xhr.responseText);
    document.querySelector('#data').innerHTML = JSON.stringify(data);
  }
};

/*
// can do this in Chrome, Firefox, etc.:
xhr.onload = function(event) {
  var data = JSON.parse(this.response);
  document.querySelector('#data').innerHTML = JSON.stringify(data);
}
*/

xhr.send();
