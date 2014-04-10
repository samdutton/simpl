jQuery(document).ready(function(){

var map, marker, panorama; // created in video loadedmetadata handler
var video = document.querySelector("video");
var videoOffset = 1331362993;	

// in effect, if the browser supports addTextTrack(), this demo will work...
// - older non-working versions use addTrack()
if (typeof video.addTextTrack === "undefined") { 
	jQuery(".trackNotSupported").fadeTo(1000, 0.8); // should use CSS for this!
	jQuery(".trackSupported").fadeTo(1000, 0.1).css({"height": 0});
} else { // track implemented!
	// need to get wait for video to load before getting duration, etc., 
	// in order to create track
		var trackElement = document.querySelector("track");
		trackElement.addEventListener("load", function(){
			var textTrack = this.track;
			textTrack.mode = TextTrack.HIDDEN;
			
			// build map
			var firstCue = textTrack.cues[0];
			var firstCueData = JSON.parse(firstCue.text);
			var startLatLng = new google.maps.LatLng(firstCueData.lat, firstCueData.lng);
			var options = {
				center: startLatLng,
				zoom: 18,
				mapTypeId: google.maps.MapTypeId.SATELLITE
			};
			map = new google.maps.Map(document.getElementById("map"), options);

			// build StreetView
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
			
			// add polyline
			var path = [];
			for (var i = 0; i !== textTrack.cues.length; ++i) { 
				var cue = textTrack.cues[i];
				console.log(i, cue.text);
 				var cueObj = JSON.parse(cue.text);
				path.push(new google.maps.LatLng(cueObj.lat, cueObj.lng));
			}
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

			// add listener to synchronise map and StreetView with video, using track data 
			textTrack.addEventListener("cuechange", function(){
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
			}); // map click handler
		}); // track load
	
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
	
	
		
} // track implemented

});