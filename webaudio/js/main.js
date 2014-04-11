// create an AudioContext
// create an audio source node
// connect it to a filter node
// connect that a gain node
// play sound!

// cope with browser differences
var context;
if (typeof webkitAudioContext === "function") {
  context = new webkitAudioContext();
} else if (typeof AudioContext === "function") {
  context = new AudioContext();
} else {
  alert("Sorry! Web Audio is not supported by this browser");
}

// use the audio element to create the source node
var audioElement = document.querySelector("audio");
var sourceNode = context.createMediaElementSource(audioElement);

// connect the source node to a filter node
var filterNode = context.createBiquadFilter();
// see https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#BiquadFilterNode-section
filterNode.type = 0; // LOWPASS
// cutoff frequency: for LOWPASS, audio is attenuated above this frequency
filterNode.frequency.value = 300;

sourceNode.connect(filterNode);
// connect the filter node to a gain node (to change audio volume)
var gainNode = context.createGain();
// default is 1 (no change); less than 1 means audio is attenuated, and vice versa
gainNode.gain.value = .5;
filterNode.connect(gainNode);

// connect the gain node to the destination (i.e. play the sound)
gainNode.connect(context.destination);
