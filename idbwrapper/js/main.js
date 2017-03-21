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

/* globals IDBStore */

var customers = new IDBStore({
  dbVersion: 1,
  storeName: 'customer',
  keyPath: 'id',
  autoIncrement: true,
  onStoreReady: function() {
    console.log('Store ready!');
  }
});

var dude = {
  firstname: 'John',
  lastname: 'Doe',
  age: 52,
  emails: [
    'johndoe@example.com',
    'jd@example.com'
  ]
};

var onsuccess = function(id) {
  console.log('Yeah, dude inserted! insertId is: ' + id);
};

var onerror = function(error) {
  console.log('Oh noes, sth went wrong!', error);
};

customers.put(dude, onsuccess, onerror);
