;(function () {
  'use strict';

  var _to_do = 50;
  var _rIC_scheduled = false;

  document.querySelector('.demo-button').addEventListener('click', function (e) {
    var evt = (e.target || this);

    if (typeof evt === 'undefined') {
      return;
    }

    if (evt.classList.contains('demo-button')) {
      return demoButtonClick();
    }
  });

  function demoButtonClick () {
    var _xhr;
    for (var l = 0; l < _to_do; ++l ) {
      _xhr = new XMLHttpRequest();

      /*
        NB
          NEVER pass in 'false' to XHR as its third parameter in production code --
          Doing so initiates a **synchronous** XHR, which will eat the main thread for breakfast.
          We do it here specifically to demonstrate that the requestIdleCallback is not
          executed until the main thread is freed
      */
      document.querySelector('.high-priority > .output').insertAdjacentHTML('beforeend', '<p>Did task at '+ window.performance.now().toFixed(2) + '</p>');
      _xhr.open('GET', './', false);
      _xhr.send(null);
      _xhr = null;
    }
    scheduleTasks();
  }

  function scheduleTasks () {

    if (!!_rIC_scheduled) {
      return;
    }

    _rIC_scheduled = true;

    'requestIdleCallback' in window ?
      requestIdleCallback(executeAdditionalTasks, {timeout: 2000}) :
        executeAdditionalTasks();

  }

  function executeAdditionalTasks (deadline) {

    _rIC_scheduled = false;

    if (typeof deadline === 'undefined') {
      deadline = { timeRemaining: function () { return Number.MAX_VALUE } };
    }

    while (deadline.timeRemaining() > 0 && _to_do--) {
      document.querySelector('.low-priority > .output').insertAdjacentHTML('beforeend', '<p>Did task at time '+ window.performance.now().toFixed(2) +'</p>');
    }

    if (_to_do.length > 0) {
      scheduleTasks();
    }
    else {
      _to_do = 50;
    }
  }

}());
