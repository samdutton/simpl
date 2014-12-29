window.addEventListener("message", function receiveMessage(event) {  
  alert("child.html (in the iframe) got a message from index.html:\n\n" + event.data + "\n\n...and will now send a message back again.");
  event.source.postMessage("Hi from child.html!", "*");
});  
