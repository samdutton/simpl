window.addEventListener("message", function(event) {
  log("Sent a message to event.origin " + event.origin + " and got the following in response:");
  log("<em>" + event.data + "</em>")
});
var other = window.open("other.html");
other.onload = function(){
  other.postMessage("Hi! this is a message from index.html.", "*");
};

function log(message){
  document.getElementById("data").innerHTML += message + "<br /><br />";
}
