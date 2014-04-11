// This code adapted from Eric Bidelman's demo at
// http://html5-demos.appspot.com/static/media-source.html

var FILE = 'test.webm';
var NUM_CHUNKS = 5;
var video = document.querySelector('video');

if (!!!window.MediaSource) {
  alert('The MediaSource API is not available on this platform');
}

var mediaSource = new MediaSource();

document.querySelector('[data-num-chunks]').textContent = NUM_CHUNKS;

video.src = window.URL.createObjectURL(mediaSource);

mediaSource.addEventListener('sourceopen', function(e) {
  var sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
  console.log(sourceBuffer);

  log('MediaSource readyState: ' + this.readyState);

  GET(FILE, function(uInt8Array) {
    var file = new Blob([uInt8Array], {type: 'video/webm'});
    var chunkSize = Math.ceil(file.size / NUM_CHUNKS);

    log('Number of chunks: ' + NUM_CHUNKS);
    log('Chunk size: ' + chunkSize + ', total size: ' + file.size);

    // Slice the video into NUM_CHUNKS and append each to the media element.
    var i = 0;

    (function readChunk_(i) {
      var reader = new FileReader();

      // Reads aren't guaranteed to finish in the same order they're started in,
      // so we need to read + append the next chunk after the previous reader
      // is done (onload is fired).
      reader.onload = function(e) {
        sourceBuffer.appendBuffer(new Uint8Array(e.target.result));
        log('Appending chunk: ' + i);
        if (i == NUM_CHUNKS - 1) {
          mediaSource.endOfStream();
        } else {
          if (video.paused) {
            video.play(); // Start playing after 1st chunk is appended.
          }
          readChunk_(++i);
        }
      };

      var startByte = chunkSize * i;
      var chunk = file.slice(startByte, startByte + chunkSize);

      reader.readAsArrayBuffer(chunk);
    })(i);  // Start the recursive call by self calling.
  });

}, false);

mediaSource.addEventListener('sourceended', function(e) {
  log('MediaSource readyState: ' + this.readyState);
}, false);

function GET(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.send();

  xhr.onload = function(e) {
    if (xhr.status != 200) {
      alert("Unexpected status code " + xhr.status + " for " + url);
      return false;
    }
    callback(new Uint8Array(xhr.response));
  };
}

function log(message){
  document.getElementById("data").innerHTML += message + "<br /><br />";
}
