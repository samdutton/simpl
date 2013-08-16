var data = document.querySelector('p#data');
function log(message){
  data.innerHTML = message + '<br><br>' + data.innerHTML;
}


window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
// recognition.lang = 'en-AU';

recognition.onresult = function(event) {
  var results = event.results;
  // results is an array of SpeechRecognitionResults
  // each of which is an array of SpeechRecognitionAlternatives
  // in this demo, we only use the first alternative
  var interimTranscript = '';
  for (var i = event.resultIndex; i != results.length; ++i) {
    var result = results[i];
    // once speaking/recognition stops, a SpeechRecognitionEvent
    // is fired with a single result, for which isFinal is true
    if (result.isFinal) {
      log('Final transcript: ' + results[0][0].transcript);
      recognition.stop();
      return;
    } else {
      interimTranscript += result[0].transcript;
    }
  }
  log('Interim transcript: ' + interimTranscript);
}

recognition.onend = function(event) {
  log('Recognition ended.');
}
recognition.onerror = function(event) {
  log('Error: ' + event.error);
}

var startButton = document.querySelector('button#startButton');
startButton.onclick = function(){
  recognition.start();
}

