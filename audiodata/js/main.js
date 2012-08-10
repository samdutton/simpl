var mediaElement = document.getElementById("mediaElement");
var framebufferLengthInput = document.getElementById("framebufferLengthInput");
var metadataElement = document.getElementById("metadataElement");
var eventTimeElement = document.getElementById("eventTimeElement");
var eventDataElement = document.getElementById("eventDataElement");

framebufferLengthInput.addEventListener("change", handleFramebufferLengthChanged, false); 
mediaElement.addEventListener("loadedmetadata", handleMetadata, false);   

mediaElement.addEventListener("MozAudioAvailable", handleAudioData, false);   
mediaElement.addEventListener("seeked", handleSeeked, false);  // when pressing play

function handleFramebufferLengthChanged(){
  mediaElement.mozFrameBufferLength = framebufferLengthInput.value;
}

// called when the play button is pressed
function handleSeeked(event) {
  i = 1;
  eventTimeElement.innerHTML = "<p>Time</p>";
  eventDataElement.innerHTML = "<p>frameBuffer[0] data</p>";
  mediaElement.mozFrameBufferLength = framebufferLengthInput.value;
  framebufferLengthInput.value = mediaElement.mozFrameBufferLength;
}

function handleMetadata(event){	
  framebufferLengthInput.value = mediaElement.mozFrameBufferLength;
  metadataElement.innerHTML += 
    "mozChannels:&nbsp;" + mediaElement.mozChannels + "<br />" +
    "sampleRate:&nbsp;&nbsp;" + mediaElement.mozSampleRate + "<br />";
}	

var i = 1;
function handleAudioData(event){
    eventTimeElement.innerHTML += i + " " + event.time + "<br />";
    eventDataElement.innerHTML += event.frameBuffer[0].toFixed(18) + "<br />";
  i++;
}	
