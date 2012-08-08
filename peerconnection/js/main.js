//var vid1 = document.getElementById("vid1");
//var vid2 = document.getElementById("vid2");
btn1.disabled = false;
btn2.disabled = true;
btn3.disabled = true;
var pc1,pc2;
var localstream;

function trace(text) {
  // This function is used for logging.
  if (text[text.length - 1] == '\n') {
    text = text.substring(0, text.length - 1);
  }
  console.log((performance.webkitNow() / 1000).toFixed(3) + ": " + text);
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
  navigator.webkitGetUserMedia({audio:true, video:true},
                               gotStream, function() {});
}  
  
function call() {
  btn2.disabled = true;
  btn3.disabled = false;
  trace("Starting call");
  if (localstream.videoTracks.length > 0)
    trace('Using Video device: ' + localstream.videoTracks[0].label);  
  if (localstream.audioTracks.length > 0)
    trace('Using Audio device: ' + localstream.audioTracks[0].label);

  pc1 = new webkitPeerConnection00(null, iceCallback1);
  trace("Created local peer connection object pc1"); 
  pc2 = new webkitPeerConnection00(null, iceCallback2);
  trace("Created remote peer connection object pc2");
  pc2.onaddstream = gotRemoteStream; 

  pc1.addStream(localstream);
  trace("Adding Local Stream to peer connection");
  var offer = pc1.createOffer(null);
  trace("Created offer:\n" + offer.toSdp());
  pc1.setLocalDescription(pc1.SDP_OFFER, offer);
  trace("SetLocalDesc1");
  pc2.setRemoteDescription(pc2.SDP_OFFER, offer);
  trace("SetRemoteDesc2");
  //ta1.value = offer.toSdp();
  var answer = pc2.createAnswer(offer.toSdp(),
                                {has_audio:true, has_video:true});
  trace("Created answer:\n" + answer.toSdp());
  pc2.setLocalDescription(pc2.SDP_ANSWER, answer);
  trace("SetLocalDesc2");
  pc1.setRemoteDescription(pc1.SDP_ANSWER, answer);
  trace("SetRemoteDesc1");
  //ta2.value = answer.toSdp();
  pc1.startIce();
  pc2.startIce();
  trace("Started ICE for both local & remote");
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

function iceCallback1(candidate,bMore){
  if (candidate) {
    pc2.processIceMessage(candidate);
    trace("Local ICE candidate: " + candidate.toSdp());
  }
}
      
function iceCallback2(candidate,bMore){
  if (candidate) {
    pc1.processIceMessage(candidate);
    trace("Remote ICE candidate: " + candidate.toSdp());
  }
}