// The code for this example was adapted from a demo by Henrik Andreasson.

var pc1, pc2;
var context = 0;
var mediaStreamDestination = 0;
var drumSoundBuffer = 0;
var voiceSoundBuffer = 0;
var buttonCall = 0;
var buttonHangUp = 0;
var pauseTime = 0;
var audioElement = document.querySelector("audio");

function trace(text) {
  if (text[text.length - 1] == '\n') {
    text = text.substring(0, text.length - 1);
  }
  console.log((performance.now() / 1000).toFixed(3) + ": " + text);
}

function call() {
  buttonCall.disabled = true;
  buttonHangUp.disabled = false;
  trace("Starting call");

  var servers = null;
  pc1 = new webkitRTCPeerConnection(servers);
  trace("Created local peer connection object pc1");
  pc1.onicecandidate = iceCallback1;
  pc2 = new webkitRTCPeerConnection(servers);
  trace("Created remote peer connection object pc2");
  pc2.onicecandidate = iceCallback2;
  pc2.onaddstream = gotRemoteStream;

  if (!mediaStreamDestination) {
    trace("mediaStreamDestination = context.createMediaStreamDestination();");
    mediaStreamDestination = context.createMediaStreamDestination();
  }

  pc1.addStream(mediaStreamDestination.stream);
  pc1.createOffer(gotDescription1);
}

function transform(sdp) {
    // Remove all other codecs (not the video codecs though).
    sdp = sdp.replace(/m=audio (\d+) RTP\/SAVPF.*\r\n/g,
                      'm=audio $1 RTP/SAVPF 111\r\n');
    sdp = sdp.replace(/a=rtpmap:(?!111)\d{1,3} (?!VP8|red|ulpfec).*\r\n/g, '');
    return sdp;
}

function gotDescription1(desc){
  trace("Offer from pc1 \n" + desc.sdp);
  var modifiedOffer = new RTCSessionDescription( {type: 'offer',
                                                  sdp: transform(desc.sdp)});
  pc1.setLocalDescription(modifiedOffer);
  trace("Offer from pc1 \n" + modifiedOffer.sdp);
  pc2.setRemoteDescription(modifiedOffer);
  pc2.createAnswer(gotDescription2);
}

function gotDescription2(desc){
  pc2.setLocalDescription(desc);
  trace("Answer from pc2 \n" + desc.sdp);
  pc1.setRemoteDescription(desc);
}

function hangup() {
  trace("Ending call");
  pc1.close();
  pc2.close();
  pc1 = null;
  pc2 = null;
  buttonCall.disabled = true;
  buttonHangUp.disabled = true; // enabled when XHR completes

  voiceSound.stop(0);
  document.location.reload(); // hack, but it works!

  // pauseTime = 0;
  // voiceSound.lastStartTime = 0;
  // mediaStreamDestination = 0;
}

function gotRemoteStream(e){
  audioElement.src = webkitURL.createObjectURL(e.stream);
  audioElement.addEventListener("pause", function(){
    voiceSound.stop(0);
    pauseTime += context.currentTime - voiceSound.lastStartTime;
  });
  audioElement.addEventListener("play", function(){
    console.log("play");
    voiceSound = context.createBufferSource();  // creates an AudioBufferSourceNode.
    voiceSound.buffer = voiceSoundBuffer;
    voiceSound.connect(mediaStreamDestination);
    voiceSound.start(context.currentTime, pauseTime);
    voiceSound.lastStartTime = context.currentTime;
  });
  trace("Received remote stream");
}

function iceCallback1(event){
  if (event.candidate) {
    pc2.addIceCandidate(new RTCIceCandidate(event.candidate));
    trace("Local ICE candidate: \n" + event.candidate.candidate);
  }
}

function iceCallback2(event){
  if (event.candidate) {
    pc1.addIceCandidate(new RTCIceCandidate(event.candidate));
    trace("Remote ICE candidate: \n " + event.candidate.candidate);
  }
}

function handleKeyDown(event) {
  var keyCode = event.keyCode;
  trace('handleKeyDown()');
  // Play the drum sound to the remote peer.
  var drumSound = context.createBufferSource();  // creates an AudioBufferSourceNode.
  drumSound.buffer = drumSoundBuffer;
  if (mediaStreamDestination) {
    drumSound.connect(mediaStreamDestination);
    drumSound.start(0);
  }
}

function loadAudioBuffer(url) {
  trace('loadAudioBuffer()');
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  request.onload = function() {
    // source = context.createBufferSource();  // creates an AudioBufferSourceNode.
    voiceSoundBuffer = context.createBuffer(request.response, false);
    buttonCall.disabled = false;
    document.querySelector("#gettingAudio").innerHTML = "";
  }

  request.send();
}

function loadDrumSound(url) {
    // Load asynchronously
    trace('loadDrumSound()');

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function() {
      drumSoundBuffer = context.createBuffer(request.response, true);
    }

    request.send();
}

function init() {
  buttonCall = document.getElementById("call");
  buttonHangUp = document.getElementById("hangup");

  context = new webkitAudioContext();
  loadAudioBuffer("audio/human-voice.wav");
  loadDrumSound("audio/snare.wav");
  document.addEventListener("keydown", handleKeyDown, false);
}

init();
