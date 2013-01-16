var audioElement = document.querySelector("audio");
var textTrack = audioElement.textTracks[0]; // there's only one!

var data = document.getElementById("data");
textTrack.oncuechange = function (){
  // "this" is a textTrack
  var cue = this.activeCues[0]; // assuming there is only one active cue
  if (!!cue) {
    data.innerHTML = cue.startTime + "-" + cue.endTime + ": " + cue.text + "<br />" + data.innerHTML;
    //  var obj = JSON.parse(cue.text); // cues can be data too :)
  }
}
