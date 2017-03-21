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

var marquee;
var marqueeEl = document.querySelector( '.grid.marquee' );
var children = [].slice.call(marqueeEl.querySelectorAll( '.cell'));

if ('animate' in marqueeEl && typeof marqueeEl.animate === 'function') {
  marqueeEl.style.whiteSpace = 'nowrap';

  var displacement = children.map(function(child) {
    return child.clientWidth;
  }).reduce(function(acc, next) {
    return acc + next;
  }) - marqueeEl.clientWidth << 0;

  marquee = marqueeEl.animate(
    [
      {transform:
        'matrix(1, 0.00, 0.00, 1, 0, 0)', offset: 0},
      {transform:
        'matrix(1, 0.00, 0.00, 1,' + -displacement + ', 0)', offset: 1}
    ],
    {
      duration: children.length * 1e3,
      easing: 'linear',
      delay: 0,
      iterations: Infinity,
      direction: 'alternate',
      fill: 'forwards'
    }
  );

  marqueeEl.addEventListener('mouseenter', function() {
    if (marquee.playState === 'running') {
      marquee.pause();
    }
  }, false);

  marqueeEl.addEventListener('mouseleave', function() {
    if (marquee.playState === 'paused') {
      marquee.play();
    }
  }, false);
}
