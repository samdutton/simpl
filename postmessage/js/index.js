window.addEventListener("message", function(event) {
  log("Sent a message to child.html in the iframe above and got the following in response: ")
  log("<em>" + event.data + "</em>");
});

var childWindow = document.querySelector("iframe").contentWindow;

childWindow.onload = function(){
  childWindow.postMessage("Hi from index.html!", "*");
}

function log(message){
  document.getElementById("data").innerHTML += message + "<br /><br />";
}
