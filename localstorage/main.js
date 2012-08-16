saveButton.addEventListener('click', function () {
  window.localStorage.setItem('value', textarea.value);
}, false);
textarea.value = window.localStorage.getItem('value');
window.localStorage.clear();

var el = document.querySelector('#myID');
// place content from local storage on load if there is one
el.innerHTML = window.localStorage.getItem('value');

var items = window.localStorage.length;
var lastItem = window.localStorage.key(items-1);
localStorage.removeItem('timestamp');