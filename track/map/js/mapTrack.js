jQuery(document).ready(function(){

var map, marker, panorama; // created in video loadedmetadata handler
var video = document.querySelector("video");

// in effect, if the browser supports addTextTrack(), this demo will work...
// - older non-working versions use addTrack()
if (typeof video.addTextTrack === "undefined") {
	jQuery(".trackNotSupported").fadeTo(1000, 0.8); // should use CSS for this!
	jQuery(".trackSupported").fadeTo(1000, 0.1).css({"height": 0});
} else { // track implemented!
	// need to get wait for video to load before getting duration, etc.,
	// in order to create track
	video.addEventListener("loadedmetadata", function(){
		var videoOffset = 1331362993;
		var track = video.addTextTrack("metadata", "GBike track", "en");
		track.mode = "hidden";
		track.oncuechange = function(){
			// "this" is a textTrack
			var cue = this.activeCues[0]; // there is only one active cue in this example
			if (typeof cue === "undefined") {
				return;
			}
			var point = JSON.parse(cue.text);
			var newLatLng = new google.maps.LatLng(point.lat, point.lng);
			if (!map.getBounds().contains(newLatLng)){
				map.setCenter(newLatLng);
			}
			var oldLatLng = marker.getPosition();
			var heading = getHeading(oldLatLng, newLatLng);
			var pov = {
				"heading": heading,
				"pitch": panorama.getPov().pitch,
				"zoom": panorama.getPov().zoom
			}
			panorama.setPov(pov);
			panorama.setPosition(newLatLng);
			marker.setPosition(newLatLng);
			displayTime(point.t * 1000);
		};

		var points = [];
		jQuery.ajax({
			type: "GET",
			url: "data/gbike.xml",
			dataType: "xml",
			success: function(xml) {
				jQuery(xml).find('p').each(function(){
					var lat = parseFloat(jQuery(this).attr('a'));
					var lng = parseFloat(jQuery(this).attr('b'));
					var t = parseInt(jQuery(this).attr('t'));
					points.push({"lat": lat, "lng": lng, "t": t});
				});

				// simple utility for converting XML points file to WebVTT format
				// toVTT is defined below

				//	var vttString = "";
				//	for (var i = 0; i !== points.length; ++i) {
				//		var point = points[i];
				//		var seconds = parseFloat(point.t - videoOffset);
				//		vttString += toVTT(seconds) + " --> " + toVTT(seconds + 1) + "\n";
				//		vttString += JSON.stringify(point) + "\n\n";
				//	}
				//	console.log(vttString);

				var path = [], latSum = 0, lngSum = 0;
				for (var i = 0; i !== points.length; ++i) { // not very efficient...
					var point = points[i];
 					latSum += point.lat;
 					lngSum += point.lng;
 					path.push(new google.maps.LatLng(point.lat, point.lng));
					var startTime = point.t - videoOffset;
					var endTime = i === points.length - 1 ?
						video.duration : points[i+1].t - videoOffset;
					track.addCue(new (window.VTTCue || window.TextTrackCue)(startTime, endTime, JSON.stringify(point))); // change in spec
				}

				var startLatLng = new google.maps.LatLng(points[0].lat, points[0].lng);
				var options = {
// 					center: new google.maps.LatLng(latSum / points.length, lngSum / points.length),
 					center: startLatLng,
					zoom: 18,
					mapTypeId: google.maps.MapTypeId.SATELLITE
				};
				map = new google.maps.Map(document.getElementById("map"), options);

				var panoramaOptions = {
					position: startLatLng,
					pov: {
						heading: 332, // hack :)
						pitch: 10,
						zoom: 1
					}
				};
				panorama = new google.maps.StreetViewPanorama(document.getElementById("panorama"), panoramaOptions);
				map.setStreetView(panorama);

				var polyline = new google.maps.Polyline({
					path: path,
					strokeColor: "#ff0000",
					strokeOpacity: 0.2,
					strokeWeight: 5
				});
				polyline.setMap(map);
				marker = new google.maps.Marker({
					position: new google.maps.LatLng(points[0].lat, points[0].lng),
					map: map,
					title:"gbike!"
				});
 				google.maps.event.addListener(map, 'click', function(event) {
					var min = 360; // good enough...
					var nearest;
 					clickLat = event.latLng.lat();
 					clickLng = event.latLng.lng();
 					for (var i = 0; i != points.length; ++i){
 						var pointLat = points[i].lat;
 						var pointLng = points[i].lng;
 						var distance = Math.sqrt(Math.pow(clickLat - pointLat, 2) + Math.pow(clickLng - pointLng, 2));
 						if (distance < min){
 							min = distance;
 							nearest = i;
 						}
 					}
 					var point = points[nearest];
 					var latLng = new google.maps.LatLng(point.lat, point.lng);
					if (!map.getBounds().contains(latLng)){
						map.setCenter(latLng);
 					}
 					marker.setPosition(latLng);
 					video.currentTime = point.t - videoOffset + 1;
 				});
			}
		});
	}); // video loadedmetadata

	function displayTime(ms){
		jQuery("#timeOfDay").text(new Date(ms).toLocaleTimeString());
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
		var angle = - Math.atan2( Math.sin( lon1 - lon2 ) * Math.cos( lat2 ), Math.cos( lat1 ) * Math.sin( lat2 ) - Math.sin( lat1 ) * Math.cos( lat2 ) * Math.cos( lon1 - lon2 ) );
		if ( angle < 0.0 ) {
			angle  += Math.PI * 2.0;
		}

		// And convert result to degrees.
		var degreesPerRadian = 180.0 / Math.PI;
		angle = angle * degreesPerRadian;
		angle = angle.toFixed(1);

		return parseInt(angle);
	}

	// following two functions used by XML --> WebVTT conversion above

	// 	function pad(integerOrString, length) {
	// 		var string = integerOrString + "";
	// 		while (string.length < length) {
	// 			string = "0" + string;
	// 		}
	// 		return string;
	// 	}

		// Convert decimal time to format for WebVTT cues, e.g. convert 123.3 to 00:02:03.300
		// WebVTT cues look like this:
		// 00:00:00.500 --> 00:00:02.000
		// The Web is always changing
	// 	function toVTT(decimalSeconds){
	// 		var date = new Date(decimalSeconds * 1000);
	// 		var hours = date.getHours();
	// 		var minutes = date.getMinutes();
	// 		var seconds = date.getSeconds();
	// 		var milliseconds = date.getMilliseconds();
	// 		return pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3);
	// 	}


} // track implemented

});
