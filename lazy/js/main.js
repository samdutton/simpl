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

const options = {
  // rootMargin: top, right, bottom, left margins
  // added to the bounding box of the root element (viewport if not defined)
  // see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
  rootMargin: '0px 0px 100px 0px',
  // threshold: how much of the target visible for the callback to be invoked
  // includes padding, 1.0 means 100%
};

function callback(entries) {
  // console.log('entries', entries);
  for (const entry of entries) {
    if (entry.isIntersecting) {
      let lazyImage = entry.target;
      console.log('entry', entry);
      lazyImage.src = lazyImage.dataset.src;
      lazyImage.srcset = lazyImage.dataset.srcset;
      // lazyImage.classList.remove('lazy');
      io.unobserve(lazyImage);
    }
  }
}

// callback is invoked whenever observe() is called
// including when the page loads
const io = new IntersectionObserver(callback, options); 

const images = document.querySelectorAll('img.lazy');

for (const image of images) {
  io.observe(image);
}