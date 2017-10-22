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

const body = document.querySelector('body');
const image = document.querySelector('img#observed');
const imageDistance = document.querySelector('span#image-distance');
const imageSrc = document.querySelector('span#image-src');
var isIntersecting = false;

displayImageDistance();

body.onscroll = function() {
  displayImageDistance();
};

image.onload = function() {
  imageSrc.textContent = this.src.split('/').pop();
};

function displayImageDistance() {
  // distance from top of viewport to top of image
  var distance = image.getBoundingClientRect().y - window.innerHeight;
  // distance from top of viewport to to bottom of image
  const toBottom = image.height + image.getBoundingClientRect().y;
  if (toBottom < 0) {
    distance = Math.abs(toBottom);
  }
  imageDistance.textContent = distance < 1 && isIntersecting ?
    'in view!' : distance + 'px';
}

const options = {
  // rootMargin: top, right, bottom, left margins
  // added to the bounding box of the root element (viewport if not defined)
  // see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
  rootMargin: '0px 0px 100px 0px',
  // threshold: how much of the target visible for the callback to be invoked
  // includes padding, 1.0 means 100%
};

function callback(entries) {
  if (entries[0].isIntersecting) {
    const currentImage = entries[0].target;
    currentImage.src = currentImage.dataset.src;
    isIntersecting = true;
  } else {
    isIntersecting = false;
  }
}

// callback is invoked whenever observe() is called
// i.e. including when the page loads
const io = new IntersectionObserver(callback, options);

io.observe(image);