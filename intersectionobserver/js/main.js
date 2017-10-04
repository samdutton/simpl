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

const observed = document.querySelector('img#observed');

const options = {
  // rootMargin: top, right, bottom, left margins
  // added to the bounding box of the root element (viewport if not defined)
  // see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
  rootMargin: '0px 0px 100px 0px',
  // threshold: how much of the target visible for the callback to be invoked
  // includes padding, 1.0 means 100%
  threshold: [0.0, 0.2, 0.4, 0.6, 0.8, 1.0]
};

function callback(entries) {
  console.log(entries);
}

// callback is invoked whenever observe() is called
// i.e. including when the page loads
const intersectionObserver = new IntersectionObserver(callback, options);

intersectionObserver.observe(observed);