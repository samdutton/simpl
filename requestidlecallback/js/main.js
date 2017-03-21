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

  var toDo = 50;
  var rICScheduled = false;

  document.querySelector('.demo-button').addEventListener('click', function(e) {
    var evt = (e.target || this);

    if (typeof evt === 'undefined') {
      return;
    }

    if (evt.classList.contains('demo-button')) {
      return demoButtonClick();
    }
  });

  function demoButtonClick() {
    var _xhr;
    for (var l = 0; l < toDo; ++l) {
      _xhr = new XMLHttpRequest();

/*
NB
NEVER pass in 'false' to XHR as its third parameter in production code --
Doing so initiates a **synchronous** XHR,
which will eat the main thread for breakfast.
We do it here specifically to demonstrate that the requestIdleCallback is not
executed until the main thread is freed
*/

      document.querySelector('.high-priority > .output').
        insertAdjacentHTML('beforeend', '<p>Did task at ' +
        window.performance.now().toFixed(2) + '</p>');
      _xhr.open('GET', './', false);
      _xhr.send(null);
      _xhr = null;
    }
    scheduleTasks();
  }

  function scheduleTasks() {
    if (rICScheduled) {
      return;
    }

    rICScheduled = true;

    if ('requestIdleCallback' in window) {
      requestIdleCallback(executeAdditionalTasks, {timeout: 2000});
    } else {
      executeAdditionalTasks();
    }
  }

  function executeAdditionalTasks(deadline) {
    rICScheduled = false;

    if (typeof deadline === 'undefined') {
      deadline = {
        timeRemaining: function() {
          return Number.MAX_VALUE;
        }
      };
    }

    while (deadline.timeRemaining() > 0 && toDo--) {
      document.querySelector('.low-priority > .output').
        insertAdjacentHTML('beforeend', '<p>Did task at time ' +
        window.performance.now().toFixed(2) + '</p>');
    }

    if (toDo.length > 0) {
      scheduleTasks();
    } else {
      toDo = 50;
    }
  }
}());
