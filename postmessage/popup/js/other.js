window.addEventListener("message", function receiveMessage(event) {  
  log("Got a message from event.origin " + event.origin + ": ");
  log("<em>" + event.data + "</em>");
  // posting back to message source, i.e. index.html
  // second parameter is eventOrigin: must match event.origin
  event.source.postMessage("hi! this is a message from other.html", "*");
});  

function log(message){
  document.getElementById("data").innerHTML += message + "<br /><br />";
}

