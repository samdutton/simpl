self.onmessage = function(event) {
  self.postMessage("I got the message <em>" + event.data + "</em>!");
};