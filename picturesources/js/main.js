document.querySelector('#imgSrc').textContent =
  document.querySelector('img').currentSrc.replace(/^.*[\\\/]/, '');
