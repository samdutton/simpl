/*
Copyright 2017 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

// NEEDS REFACTORING!

var map, marker, panorama; // created in video loadedmetadata handler
var video = document.querySelector('video');
var mapElement = document.getElementById('map');
var timeOfDay = document.getElementById('timeOfDay');

var VIDEO_OFFSET = 1331362993; // time of first point, at start of video

// in effect, if the browser supports addTextTrack(), this demo will work...
// - older non-working versions use addTrack()
if (typeof video.addTextTrack === 'undefined') {
  document.querySelectorAll('.trackNotSupported').forEach(showElement);
  document.querySelectorAll('.trackSupported').forEach(hideElement);
} else { // track implemented!
  // need to get wait for video to load before getting duration, etc.,
  // in order to create track
  setupMap();
}

function setupMap() {
  var track = video.addTextTrack('metadata', 'GBike track', 'en');
  track.mode = 'hidden';
  var points = [];
  fetch('data/gbike.xml').then(function(response) {
    return response.text();
  }).then(function(text) {
    var domParser = new window.DOMParser();
    var document = domParser.parseFromString(text, 'text/xml');
    var pElements = document.querySelectorAll('p');
    pElements.forEach(function(p) {
      points.push({
        'lat': p.getAttribute('a'),
        'lng': p.getAttribute('b'),
        't': p.getAttribute('t')
      });
    });
    setupPointsAndPath(track, points);
  });
}

function setupPointsAndPath(track, points) {
  var startLatLng = new google.maps.LatLng(points[0].lat, points[0].lng);
  var options = {
    center: startLatLng,
    zoom: 18,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };
  map = new google.maps.Map(mapElement, options);

  var path = [];
  for (var i = 0; i !== points.length; ++i) { // not very efficient...
    var point = points[i];
    path.push(new google.maps.LatLng(point.lat, point.lng));
    var startTime = point.t - VIDEO_OFFSET;
    var endTime = i === points.length - 1 ?
    video.duration : points[i + 1].t - VIDEO_OFFSET;
    var cue = new window.VTTCue(startTime, endTime, JSON.stringify(point));
    track.addCue(cue);
  }

  track.oncuechange = function() {
    // 'this' is a textTrack, and there is only one active cue in this example
    cue = this.activeCues[0];
    if (typeof cue === 'undefined') {
      return;
    }
    point = JSON.parse(cue.text);
    var newLatLng = new google.maps.LatLng(point.lat, point.lng);
    if (!map.getBounds().contains(newLatLng)) {
      map.setCenter(newLatLng);
    }
    var oldLatLng = marker.getPosition();
    var heading = getHeading(oldLatLng, newLatLng);
    var pov = {
      'heading': heading,
      'pitch': panorama.getPov().pitch,
      'zoom': panorama.getPov().zoom
    };
    panorama.setPov(pov);
    panorama.setPosition(newLatLng);
    marker.setPosition(newLatLng);
    timeOfDay.textContent =
      new Date(point.t * 1000).toLocaleTimeString();
  };

  var panoramaOptions = {
    position: startLatLng,
    pov: {
      heading: 332, // hack :)
      pitch: 10,
      zoom: 1
    }
  };
  panorama = new google.maps.StreetViewPanorama(
    document.getElementById('panorama'), panoramaOptions);
  map.setStreetView(panorama);

  var polyline = new google.maps.Polyline({
    path: path,
    strokeColor: '#ff0000',
    strokeOpacity: 0.2,
    strokeWeight: 5
  });
  polyline.setMap(map);
  marker = new google.maps.Marker({
    position: new google.maps.LatLng(points[0].lat, points[0].lng),
    map: map,
    title: 'gbike!'
  });

  google.maps.event.addListener(map, 'click', function(event) {
    var min = 360; // good enough...
    var nearest;
    var clickLat = event.latLng.lat();
    var clickLng = event.latLng.lng();
    for (i = 0; i !== points.length; ++i) {
      var pointLat = points[i].lat;
      var pointLng = points[i].lng;
      var distance = Math.sqrt(Math.pow(clickLat - pointLat, 2) +
        Math.pow(clickLng - pointLng, 2));
      if (distance < min) {
        min = distance;
        nearest = i;
      }
    }
    point = points[nearest];
    var latLng = new google.maps.LatLng(point.lat, point.lng);
    if (!map.getBounds().contains(latLng)) {
      map.setCenter(latLng);
    }
    marker.setPosition(latLng);
    video.currentTime = point.t - VIDEO_OFFSET + 1;
  });
}

function degreesToRadians(deg) {
  return deg * (Math.PI / 180);
}

// Adapted from http://econym.org.uk/gmap/example_dist.htm
// Returns the bearing in degrees between two points.
// North = 0, East = 90, South = 180, West = 270.
function getHeading(from, to) {
  // See T. Vincenty, Survey Review, 23, No 176, p 88-93,1975.
  // Convert to radians.
  var lat1 = degreesToRadians(from.lat());
  var lon1 = degreesToRadians(from.lng());
  var lat2 = degreesToRadians(to.lat());
  var lon2 = degreesToRadians(to.lng());

  // Compute the angle.
  var angle = -Math.atan2(Math.sin(lon1 - lon2) *
    Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
  if (angle < 0.0) {
    angle += Math.PI * 2.0;
  }

  // And convert result to degrees.
  var degreesPerRadian = 180.0 / Math.PI;
  angle = angle * degreesPerRadian;
  angle = angle.toFixed(1);

  return parseInt(angle);
}

function hideElement(element) {
  element.style.display = 'none';
}

function showElement(element) {
  element.style.display = 'block';
}

