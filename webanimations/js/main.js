'use strict';

var marquee;
var marquee_el = document.querySelector( '.grid.marquee' );
var children = [].slice.call(marquee_el.querySelectorAll( '.cell'));

if ('animate' in marquee_el && typeof marquee_el.animate === 'function') {

  marquee_el.style.whiteSpace = 'nowrap';

  var displacement = children.map(function (child) {
    return child.clientWidth;
  }).reduce(function (acc, next) {
    return acc + next;
  }) - marquee_el.clientWidth << 0;

  marquee = marquee_el.animate(
    [
      { transform: 'matrix(1, 0.00, 0.00, 1, 0, 0)', offset: 0 },
      { transform: 'matrix(1, 0.00, 0.00, 1,' + -displacement + ', 0)', offset: 1 }
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

  marquee_el.addEventListener('mouseenter', function () {
    if (marquee.playState === 'running') {
      marquee.pause();
    }
  }, false);

  marquee_el.addEventListener('mouseleave', function () {
    if (marquee.playState === 'paused') {
      marquee.play();
    }
  }, false);
}
