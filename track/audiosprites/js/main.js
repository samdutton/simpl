'use strict';

/* globals $ */

// This demo is based on code at http://dev.w3.org/html5/spec/media-elements.html#text-track-api

$(document).ready(function() {
  window.VTTCue = window.VTTCue || window.TextTrackCue;

  var audio = new Audio('audio/animalSounds.mp3');

  // if track element supported
  if (typeof audio.addTextTrack === 'function') {
    $('.isSupported').addClass('visible');
    $('.isNotSupported').addClass('hidden');

    audio.addEventListener('loadedmetadata', function() {
      window.track = audio.addTextTrack('metadata', 'sprite track',
        'en');
      window.track.mode = 'hidden';

      // for browsers that do not implement the getCueById() method
      if (typeof window.track.getCueById !== 'function') {
        window.track.getCueById = function(id) {
          var cues = window.track.cues;
          for (var i = 0; i !== window.track.cues.length; ++i) {
            if (cues[i].id === id) {
              return cues[i];
            }
          }
        };
      }

      var sounds = [{
        id: 'purr',
        startTime: 0.200,
        endTime: 1.800
      }, {
        id: 'meow',
        startTime: 2.300,
        endTime: 3.300
      }, {
        id: 'bark',
        startTime: 3.900,
        endTime: 4.300
      }, {
        id: 'baa',
        startTime: 5.000,
        endTime: 5.800
      }, {
        id: 'moo',
        startTime: 6.500,
        endTime: 8.200
      }, {
        id: 'bleat',
        startTime: 8.500,
        endTime: 9.400
      }, {
        id: 'woof',
        startTime: 9.900,
        endTime: 10.400
      }, {
        id: 'cluck',
        startTime: 11.100,
        endTime: 13.400
      }, {
        id: 'mew',
        startTime: 13.800,
        endTime: 15.600
      }];

      for (var i = 0; i !== sounds.length; ++i) {
        var sound = sounds[i];
        var cue = new window.VTTCue(sound.startTime, sound.endTime,
          sound.id); // change in spec
        cue.id = sound.id;
        window.track.addCue(cue);
        $('#soundButtons').append(
          '<button class="playSound" id="' + sound.id + '">' + sound.id +
          '</button>');
      }

      var endTime;
      audio.addEventListener('timeupdate', function(event) {
        if (event.target.currentTime > endTime) {
          event.target.pause();
        }
      });

      function playSound(id) {
        var thisCue = window.track.getCueById(id);
        audio.currentTime = thisCue.startTime;
        endTime = thisCue.endTime;
        audio.play();
      }

      $('button.playSound').click(function() {
        playSound(this.id);
      });
    });

    // if track element not supported
  } else {
    $('.isSupported').addClass('hidden');
    $('.isNotSupported').addClass('visible');
  }
});
