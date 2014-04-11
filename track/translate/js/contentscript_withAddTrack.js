(function(){
"use strict";

$(document).ready(function(){

var mediaElements = jQuery("video, audio").each(function(index, mediaElement){
	mediaElement.defaultTracks = {};
	jQuery(mediaElement).children("track").each(function(index, trackElement){
			if (trackElement.hasAttribute("default")){
				trackElement.addEventListener("load", function(){	
					var track = $.extend(trackElement.track); // to make deep copy, including cues
					mediaElement.defaultTracks[trackElement.kind] = track;
				});
			}
	});
});

function handleTranslationSuccess(obj){ 
// 	console.log("this.cue: ", this.cue);
	// 'this' is the context object that was set with the $.ajax() context parameter
	var newTrack = this.track;
	var defaultCue = this.cue;
	var translatedText = obj.data.translations[0].translatedText; 
	translatedText = $('<div/>').html(translatedText).text(); // convert entities
	// hacks to replace oddities if JSON values are used for cue text
	translatedText = translatedText.replace(/\"\.\"/g, '": "')
		.replace(/\.\. \»\:\« /g, '": "').replace(/\"\. /g, '"');
	//		new TextTrackCue("1", 1.2, 3.4, "Cue #1"))
	// new TextTrackCue( id, startTime, endTime, text [, settings [, pauseOnExit ] ] )
	var newCue = new TextTrackCue("", defaultCue.startTime, defaultCue.endTime, translatedText);
//	console.log(newCue, newTrack);
	console.log(document.querySelector("video").textTracks);	
// 	document.querySelector("video").textTracks[0].addCue(newCue);
// 	document.querySelector("video").textTracks[0].mode = 2;
//	setTimeout(function(){newTrack.addCue(newCue)}, 3000);
}

function handleTranslationFailure(obj){
	console.log("error: ", obj); 
}

var trackKinds = ["captions", "metadata", "subtitles"];	
function changeLanguage(targetLanguage){	
	$("track").each(function(index, trackElement){
		trackElement.track.mode = 0; // first, turn off all tracks
	});
	
	// for each media element
	jQuery("video, audio").each(function(index, mediaElement){
		// for each track kind
		for (var i = 0; i !== trackKinds.length; ++i){
			var trackKind = trackKinds[i];
			// get the default track of this kind for the mediaElement
			var defaultTrack = mediaElement.defaultTracks[trackKind];
			// if no default track for this kind, then continue to the next kind
			if (!defaultTrack) {
				continue;
			}
			// mode is 0 if unspecified :\ 
			// mode for default track, if unspecified, is 2  
			var defaultMode = defaultTrack.mode || 2; 
			// if the mediaElement has a track of this kind for the targetLanguage
			var textTracks = mediaElement.textTracks;
			var isTrackFound = false;
			for (var j = 0; j !== textTracks.length; ++j){
				var track = textTracks[j];
				if (track.kind === trackKind && track.language === targetLanguage){
					// set the found track mode to the default mode for this kind
					// in other words, turn it on!
					track.mode = defaultMode;
					isTrackFound = true;
					break;
				}
			}
			// if a track for the kind and target language wasn't found, build one
			if (!isTrackFound) {
				// parameters: kind, label, language -- addTextTrack in spec -- will change?
				var newTrack = mediaElement.addTrack(trackKind, targetLanguage + " " + trackKind, targetLanguage);
				newTrack.mode = defaultMode; // set mode to default mode for this kind of track
				for (var k = 0; k !== defaultTrack.cues.length; ++k){
					var defaultCue = defaultTrack.cues[k];
					// asynchronously send requests to translate cues
					var googleTranslateURL = "https://www.googleapis.com/language/translate/v2?key=" + 
					// "AIzaSyAey8Y9zVKV0F7S3CKIUXoyCP-T-N-2NCk" + // 
					"AIzaSyCNwvUJo7bWWUMk7Z7bioTFvmWtHVXH2LY" + //
					"&source=" + defaultTrack.language + "&target=" + targetLanguage + "&q=" + defaultCue.text;
					$.ajax({
						"url": googleTranslateURL,
						"context": {
							"track": newTrack, 
							"cue": defaultCue
						}		
					})
						.done(handleTranslationSuccess)
						.fail(handleTranslationFailure);
				}
			}
		}
	});
}

setTimeout(function(){changeLanguage("fr");}, 1000);
	
}); // $(document).ready()
})();