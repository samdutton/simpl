'use strict';

var img = document.querySelector('img');
var imgSrc = document.querySelector('#imgSrc');
var imgNaturalWidth = document.querySelector('#imgNaturalWidth');
var imgWidth = document.querySelector('#imgWidth');

var dpr = document.querySelector('#devicePixelRatio');
var viewportWidth = document.querySelector('#viewportWidth');
var availableWidth = document.querySelector('#availableWidth');

function displayData() {
  imgSrc.innerHTML = '<a href="' + img.currentSrc + '">' +
    img.currentSrc.replace(/^.*[\\\/]/, '') + '</a>';
  imgNaturalWidth.textContent = img.naturalWidth;
  imgWidth.textContent = img.width;
  dpr.textContent = window.devicePixelRatio;
  viewportWidth.textContent = document.documentElement.clientWidth;
  availableWidth.textContent = window.screen.availWidth;
}

img.onload = window.onresize = displayData;

// in case image already loaded -- is there a better way?
displayData();
