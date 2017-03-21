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

(function() {
  'use strict';

  // very, very roughly polyfill rAF / cAF
  if (!('requestAnimationFrame' in window)) {
    window.requestAnimationFrame = (function() {
      return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(cbk) {
          return window.setTimeout(cbk, 1000 / 16);
        };
    })();
  }

  if (!('cancelAnimationFrame' in window)) {
    window.cancelAnimationFrame = (function() {
      return window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        function(id) {
          return window.clearTimeout(id);
        };
    })();
  }

  var thisrAF;
  var _container = document.getElementById('container');
  var _square = document.querySelector('.square');
  var _cW = _container.clientWidth - 50;
  var _dX = 1;
  var _transform = ('transform' in _square.style ? 'transform' :
    'webkitTransform' in _square.style ? 'webkitTransform' :
    'mozTransform' in _square.style ? 'mozTransform' :
    'msTransform' in _square.style ? 'msTransform' :
    'oTransform' in _square.style ? 'oTransform' :
    'transform');

  _container.addEventListener('click', interrupt, false);
  _container.addEventListener('dblclick', resume, false);

  moveSquare();

  function moveSquare() {
    if (_dX >= _cW) {
      return;
    }
    _square.style[_transform] = 'translateX(' + (_dX++) + 'px)';
    thisrAF = window.requestAnimationFrame(moveSquare);
  }

  function interrupt() {
    window.cancelAnimationFrame(thisrAF);
  }

  function resume() {
    thisrAF = window.requestAnimationFrame(moveSquare);
  }
})();
