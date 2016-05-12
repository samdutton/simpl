'use strict';

// This codelab uses the open source video Sintel.  More information about
// this video is available from https://durian.blender.org
var manifestUri = '//storage.googleapis.com/shaka-demo-assets/sintel/dash.mpd';

// Install built-in polyfills to patch browser incompatibilities.
shaka.polyfill.installAll();

// Check to see if the browser supports the basic APIs Shaka needs.
// This is an asynchronous check.
shaka.Player.support().then(function(support) {
  // This executes when the asynchronous check is complete.
  if (support.supported) {
    // Everything looks good!
    initPlayer();
  } else {
    // This browser does not have the minimum set of APIs we need.
    console.error('Browser not supported!');
  }
});

function initPlayer() {
  // Create a Player instance.
  var video = document.querySelector('video');
  var player = new shaka.Player(video);
  player.configure({preferredTextLanguage: 'en'});
  // Add player to global scope so it's visible from the browser console
  window.player = player;

  // Listen for error events.
  player.addEventListener('error', onErrorEvent);

  // Try to load a manifest.
  // This is an asynchronous process.
  player.load(manifestUri).then(function() {
    // This runs if the asynchronous load is successful.
    console.log('The video has now been loaded!');
  }).catch(onError);  // onError is executed if the asynchronous load fails.
}

function onErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onError(event.detail);
}

function onError(error) {
  console.error('Error code', error.code, 'object', error);
}
