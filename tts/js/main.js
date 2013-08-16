var data = document.querySelector("p#data");
function log(message){
  data.innerHTML += message + "<br />";
}

var u = new SpeechSynthesisUtterance();
u.text = 'Hello world';
u.lang = 'en-US';
u.rate = 1.2;
u.onend = function(event) {
  log('Finished in ' + event.elapsedTime + ' seconds.');
}
speechSynthesis.speak(u);

// simple version
speechSynthesis.speak(new SpeechSynthesisUtterance('Hello another world'));
