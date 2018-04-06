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
  for (const entry of entries) {
    if (entry.isIntersecting) {
      let lazyImage = entry.target;
      if (lazyImage.hasAttribute('data-srcset')) {
        lazyImage.srcset = lazyImage.dataset.srcset;
      }
      if (lazyImage.hasAttribute('data-src')) {
        lazyImage.src = lazyImage.dataset.src;
      }
      io.unobserve(lazyImage);
    }
  }
}

const images = document.querySelectorAll('img.lazy');

// callback is invoked whenever observe() is called
// including when the page loads
let io;
if (window.IntersectionObserver) {
  io = new IntersectionObserver(callback, options);
}

for (const image of images) {
  if (window.IntersectionObserver) {
    io.observe(image);
  } else {
    console.log('Intersection Observer not supported');
    image.src = image.getAttribute('data-src');
  }
}