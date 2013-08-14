var data = document.querySelector("p#data");
function log(message){
  data.innerHTML += message + "<br />";
}

window.onload = function(){
  if (!window.performance.getEntriesByType) {
    log('This browser does not support the Resource Timing API :^\\.');
    return;
  }
  var resources = window.performance.getEntriesByType('resource');
  for (i = 0; i != resources.length; ++i) {
    var resource = resources[i];
    if (resource.initiatorType === 'img') {
      var nameParts = resource.name.split('/');
      var name = nameParts[nameParts.length - 1];
      if (name.length > 50) {
        name = name.substring(0, 50) + '...';
      }
      var fetchTime = Math.round(resource.responseEnd - resource.startTime);
      if (name.indexOf('.jpg') !== -1) {
        log(name + ': ' + fetchTime);
      }
    }
  }
}
