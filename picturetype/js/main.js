'use strict';

var img = document.querySelector('img');
var imgSrc = document.querySelector('#imgSrc');

img.onload = function() {
  imgSrc.textContent =
    img.currentSrc.replace(/^.*[\\\/]/, '');
};

// in case image already loaded -- is there a better way?
imgSrc.textContent = img.currentSrc.replace(/^.*[\\\/]/, '');
