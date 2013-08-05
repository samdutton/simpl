var dataDiv = document.querySelector('#data');
function log(message){
  dataDiv.innerHTML = message + '<br />' + dataDiv.innerHTML;
}

var source = new EventSource('index.php');

source.onmessage = function(e) {
  log(e.data);
};