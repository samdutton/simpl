;(function () {
  'use strict';

  // very, very roughly polyfill rAF / cAF
  if (!('requestAnimationFrame' in window)) {
    win.requestAnimationFrame = win.webkitRequestAnimationFrame
                             || win.mozRequestAnimationFrame
                             || win.msRequestAnimationFrame
                             || win.oRequestAnimationFrame
                             || function (cbk) { return win.setTimeout(cbk, 1000 / 16) };
  }

  if (!('cancelAnimationFrame' in window)) {
    win.cancelAnimationFrame = win.webkitCancelAnimationFrame
                            || win.mozCancelAnimationFrame
                            || win.msCancelAnimationFrame
                            || win.oCancelAnimationFrame
                            || function (id) { return win.clearTimeout(id) };
  }

  var _this_rAF;
  var _container = document.getElementById('container');
  var _square = document.querySelector('.square');
  var _cW = _container.clientWidth - 50;
  var _dX = 1;
  var _transform = ('transform'in _square.style?'transform':'webkitTransform'in _square.style?'webkitTransform':'mozTransform'in _square.style?'mozTransform':'msTransform'in _square.style?'msTransform':'oTransform'in _square.style?'oTransform':'transform');

  _container.addEventListener('click', interrupt, false);
  _container.addEventListener('dblclick', resume, false);

  moveSquare();

  function moveSquare () {
    if (_dX >= _cW) { return; }
    _square.style[_transform] = 'translateX(' + (_dX++) + 'px)';
    _this_rAF = window.requestAnimationFrame(moveSquare);
  }

  function interrupt () {
    window.cancelAnimationFrame(_this_rAF);
  }

  function resume () {
    _this_rAF = window.requestAnimationFrame(moveSquare);
  }

})();
