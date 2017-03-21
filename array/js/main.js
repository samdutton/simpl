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

var data = document.getElementById('data');

function log(message) {
  data.innerHTML += message + '<br />';
}

var Person = function(name, email) {
  this.name = name;
  this.email = email;
};

var barney = new Person('Barney Rubble', 'barney@rubble.com');
var betty = new Person('Betty Rubble', 'betty@rubble.com');
var fred = new Person('Fred Flintstone', 'fred@flintstone.com');
var wilma = new Person('Wilma Flintstone', 'wilma@flintstone.com');

var people = [barney, betty, fred, wilma];

log('Array:<br />' + JSON.stringify(people).replace(/},/g, '},<br />') +
  '<br />');

log('Use filter() and forEach() to show people with rubble.com emails:');

var rubbles = people.filter(function(element, index, array) {
  return element.email.indexOf('rubble') !== -1;
});

rubbles.forEach(function(element, index, array) {
  log(element.name + ' ');
});

var hasFlintstones = people.some(function(element, index, array) {
  return element.name.indexOf('Flintstone') !== -1;
});

log('<br />Use some() to check if the array contains any Flintstones:<br />' +
    'any Flintstones? ' + hasFlintstones);

var allFlintstones = people.every(function(element, index, array) {
  return element.name.indexOf('Flintstone') !== -1;
});

log('<br />Use every() to check if the array is all Flintstones:<br />' +
    'all Flinstones? ' + allFlintstones);

var firstNames = people.map(function(element, index, array) {
  return element.name.split(' ')[0];
});

log('<br />Use map() to build an array of first names:<br />' +
    JSON.stringify(firstNames));
