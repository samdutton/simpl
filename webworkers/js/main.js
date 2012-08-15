var data = document.getElementById("data");
function log(message){
  data.innerHTML += message + "<br />";
}

var worker = new Worker("js/task.js");
worker.addEventListener("message", function(event) {
    log("Message from the worker: " + event.data);
}, false);

var messageToWorker = "fubar";
log("Message to the worker: " + messageToWorker);
worker.postMessage(messageToWorker); // start the worker

