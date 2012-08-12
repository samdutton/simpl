var worker = new Worker("js/task.js");
worker.addEventListener("message", function(event) {
    document.getElementById("data").innerHTML = "Message from the worker: " + event.data;
}, false);
worker.postMessage("Message to worker"); // start the worker