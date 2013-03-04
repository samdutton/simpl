

performance.now = performance.now || performance.webkitNow; // hack added by SD!

//var vid1 = document.getElementById("vid1");
//var vid2 = document.getElementById("vid2");
btn1.disabled = false;
btn2.disabled = true;
btn3.disabled = true;
var localstream;

function trace(text) {
  // This function is used for logging.
  if (text[text.length - 1] == '\n') {
    text = text.substring(0, text.length - 1);
  }
  console.log((performance.now() / 1000).toFixed(3) + ": " + text);
}

function gotStream(stream){
  trace("Received local stream");
  vid1.src = webkitURL.createObjectURL(stream);
  localstream = stream;
  btn2.disabled = false;
}

function start() {
  trace("Requesting local stream");
  btn1.disabled = true;
  navigator.webkitGetUserMedia(
    {
      video: {
        mandatory: {
          chromeMediaSource: 'screen'
        }
      }
    },
    gotStream, function(e){console.log("getUserMedia error: ", e);});
}

function call() {
  btn2.disabled = true;
  btn3.disabled = false;
  trace("Starting call");

  // temporary hacks to cope with API change
  if (!!localstream.videoTracks && !localstream.getVideoTracks) {
    localstream.getVideoTracks = function(){
      return this.videoTracks;
    }
  }
  if (!!localstream.audioTracks && !localstream.getAudioTracks) {
    localstream.getAudioTracks = function(){
      return this.audioTracks;
    }
  }
  ///////////////////////////////////////////

  if (localstream.getVideoTracks().length > 0)
    trace('Using Video device: ' + localstream.getVideoTracks()[0].label);
  if (localstream.getAudioTracks().length > 0)
    trace('Using Audio device: ' + localstream.getAudioTracks()[0].label);
  var servers = null;
  window.pc1 = new webkitRTCPeerConnection(servers);
  trace("Created local peer connection object pc1");
  pc1.onicecandidate = iceCallback1;
  window.pc2 = new webkitRTCPeerConnection(servers);
  trace("Created remote peer connection object pc2");
  pc2.onicecandidate = iceCallback2;
  pc2.onaddstream = gotRemoteStream;

  pc1.addStream(localstream);
  trace("Adding Local Stream to peer connection");

  pc1.createOffer(gotDescription1);
}

function gotDescription1(desc){
  pc1.setLocalDescription(desc);
  trace("Offer from pc1 \n" + desc.sdp);
  pc2.setRemoteDescription(desc);
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
  btn3.disabled = true;
  btn2.disabled = false;
}

function gotRemoteStream(e){
  vid2.src = webkitURL.createObjectURL(e.stream);
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
