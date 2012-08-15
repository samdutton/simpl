var startButton = document.getElementById("startActivity");
startButton.addEventListener("click", function() {
  var intent = new Intent(
    "http://webintents.org/share", "text/uri-list", location.href);
  window.navigator.startActivity(intent, function(e){console.log(e)}, function(e){console.log(e)});
}, false);

function handleFailure(e){
  log("Failure: ", e);
}
    
function handleSuccess(e){
  log("Success: ", e);
}
    
function log(message){
  console.log(message);
}
