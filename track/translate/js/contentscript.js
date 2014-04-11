(function(){
"use strict";

// if page is refreshed, stop speaking subtitles
clearSpokenSubtitleBacklog();

// initially get these values from background page
var selectedLanguage; // set in changeLanguage() in response to popup message
var speakSubtitles; // set in response to message from popup
var request = {
	"type": "getSettings"
}

// !!!hack -- to give time for defaultTracks to be set
setTimeout(function(){
	chrome.extension.sendRequest(request, function(response){
		selectedLanguage = response.selectedLanguage;
		speakSubtitles = response.speakSubtitles;
		if (selectedLanguage !== ""){
			changeLanguage(selectedLanguage);
		}
	});
}, 1000);

// get supported languages for popup
function handleGetLanguagesSuccess(obj){
	var request = {"type": "setSupportedLanguages"};
	request.supportedLanguages = obj.data.languages;
	chrome.extension.sendRequest(request, function(response){});
}

function handleGetLanguagesFailure(obj){
	console.log("Error getting list of supported languages: ", obj);
}

// targetLanguage is the language of the language names (!), e.g. 'français' or 'french'
var targetLanguage = window.navigator.language.split("-")[0] || "en";

var googleTranslateURL = "https://www.googleapis.com/language/translate/v2/languages?key=" +
	"AIzaSyCNwvUJo7bWWUMk7Z7bioTFvmWtHVXH2LY" +
	"&target=" + targetLanguage;
$.ajax({
	"url": googleTranslateURL,
	"context": {
	}
})
	.done(handleGetLanguagesSuccess)
	.fail(handleGetLanguagesFailure);


// change cue language
function handleTranslationSuccess(obj){
	var translatedText = obj.data.translations[0].translatedText;
	translatedText = $('<div/>').html(translatedText).text(); // convert entities
	// hacks to replace oddities if JSON values are used for cue text
	translatedText = translatedText.replace(/\"\.\"/g, '": "')
		.replace(/\.\. \»\:\« /g, '": "').replace(/\"\. /g, '"').replace(/\"\.\:/g, '":').replace(/\.\ \»\.\:\«\ /g, '":"');
	// 'this' is the context object that was set with the $.ajax() context parameter
	this.cue.text = translatedText;
}

function handleTranslationFailure(obj){
	console.log("Error translating cue text: ", obj);
}

function handleSubtitleCueChange(){
// 	console.log("handleSubtitleCueChange() in contentscript.js, text: " + this.activeCues[0] +
// 		", speakSubtitles: " + speakSubtitles);
	if (!speakSubtitles){
		return;
	}
	// "this" is a textTrack
	var cue = this.activeCues[0]; // only deal with first active cue
	if (typeof cue === "undefined" || cue.text == "") {
		return;
	}
	var request = {};
	request.type = "speakSubtitles";
	request.language = selectedLanguage;
	request.text = cue.text;
// 	request.text = encodeURI(cue.text);
	// can only call Google Translate from background page
	chrome.extension.sendRequest(request, function(response){});

}

// if targetLanguage is undefined, use the default language for each track
function changeLanguage(targetLanguage){
	clearSpokenSubtitleBacklog();
	selectedLanguage = targetLanguage;
	var trackElements = document.querySelectorAll("track");
	for (var i = 0; i !== trackElements.length; ++i){
		var trackElement = trackElements[i];
		var track = trackElement.track;
		var kind = trackElement.kind;
		// add listener for subtitle cue changes, for speaking subtitles
		// !!! this should be moved out of here
		if (kind === "subtitles"){
			track.oncuechange = handleSubtitleCueChange;
		}
		if (track.mode === track.DISABLED || track.language === targetLanguage){
			continue; // skip tracks that are disabled or already in the target language
		}
		var mediaElement = trackElement.parentElement; // a bit of a hack, but correct if code valid
		if (!mediaElement) { // but just in case...
			console.log("trackElement.parentElement is not mediaElement");
			continue;
		}
		var defaultTrack = mediaElement.defaultTracks[kind];
		for (var j = 0; j !== track.cues.length; ++j){
			// cue is for the current track
			var cue = track.cues[j];
			// defaultCue is the default cue stored for this kind of track for this media element
			var defaultCueText = defaultTrack.cueTexts[j];
			// if the target language is actually the default language for the track
			// use the default cue texts: don't translate
			// if the target language is undefined, use the default cue texts
			if (defaultTrack.language === targetLanguage || typeof targetLanguage === "undefined") {
				cue.text = defaultCueText;
			} else {
				// asynchronously send requests to translate cues
				var googleTranslateURL = "https://www.googleapis.com/language/translate/v2?key=" +
				// "AIzaSyAey8Y9zVKV0F7S3CKIUXoyCP-T-N-2NCk" + // mine
				"AIzaSyCNwvUJo7bWWUMk7Z7bioTFvmWtHVXH2LY" + // g
				"&source=" + defaultTrack.language + "&target=" + targetLanguage + "&q=" + defaultCueText;
	// 			console.log("googleTranslateURL: ", googleTranslateURL);
				$.ajax({
					"url": googleTranslateURL,
					"context": {
						"cue": cue
					}
				})
					.done(handleTranslationSuccess)
					.fail(handleTranslationFailure);
			}
		}
	}
}

// Send a message to the background page to clear any subtitles
// queued for speaking in the audioURLs array
function clearSpokenSubtitleBacklog(){
	var request = {
		"type": "clearSpokenSubtitleBacklog"
	}
	chrome.extension.sendRequest(request, function(response){});
}

function fadeDownVolume(){
	mediaElements.each(function(index, mediaElement){
		var delta = 0.02;
		setInterval(function(){
			if (mediaElement.volume > delta) {
				mediaElement.volume -= delta;
			} else {
				mediaElement.volume = 0;
			}
		}, 100);
	});
}

function fadeUpVolume(){
	mediaElements.each(function(index, mediaElement){
		var delta = 0.02;
		setInterval(function(){
			if (mediaElement.volume < 1 - delta) {
				mediaElement.volume += delta;
			} else {
				mediaElement.volume = 1;
			}
		}, 100);
	});
}

function toggleSubtitles(checkboxId, isChecked){
// 	console.log("toggleSubtitles: checkboxId " + checkboxId + ", isChecked " + isChecked);
	if (checkboxId === "showSubtitles"){
		var trackElements = document.querySelectorAll("track");
		for (var i = 0; i !== trackElements.length; ++i){
			var track = trackElements[i].track;
			if (track.kind !== "subtitles"){
				continue;
			}
			// this isn't perfect: track could be deliberately disabled for some reason
			if (isChecked){ // hide if necessary
				track.mode = track.SHOWING;
			} else { // show if necessary
				track.mode = track.DISABLED;
			}
		}
	} else if (checkboxId === "translateSubtitles"){
		if (isChecked){
			changeLanguage(selectedLanguage); // selectedLanguage is global value, set from popup
		} else {
			changeLanguage(); // undefined target language causes default cue texts to be used
		}
	} else if (checkboxId === "speakSubtitles"){
		speakSubtitles = isChecked;
		clearSpokenSubtitleBacklog();
		// fade volume down or up, depending on whether subtitles are to be spoken
		if (isChecked) {
//			fadeDownVolume();
        		} else {
//			fadeUpVolume();
		}
	}
}

// kick off track translation from language selected in popup
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
		if (request.type === "changeLanguage") {
			changeLanguage(request.language);
		} else if (request.type === "consoleLog") {
			console.log(request.value);
		} else if (request.type === "toggleSubtitles") {
			toggleSubtitles(request.checkboxId, request.isChecked);
		} else {
			alert("Unknown request type in contentscript.js: " + request.type);
		}
		sendResponse({});  // allows request to be cleaned up -- otherwise it stays open
	}
);


var mediaElements; // used in changeLanguage() to lower volume

$(document).ready(function(){

	// for each media element, add a defaultTracks property
	// which has a track object for each track kind
	// defaultTracks are used for translation
	// mediaElements is used by changeLanguage()
	mediaElements = jQuery("video, audio");
	mediaElements.each(function(index, mediaElement){
		mediaElement.defaultTracks = {};
		// if the slider is moved, clear the queue of subtitles waiting to be spoken
		mediaElement.addEventListener("seeked", function(){
			clearSpokenSubtitleBacklog();
		})
		mediaElement.addEventListener("pause", function(){
			clearSpokenSubtitleBacklog();
		})
		jQuery(mediaElement).children("track").each(function(index, trackElement){
				if (trackElement.hasAttribute("default")){
					trackElement.addEventListener("load", function(){
						var track = trackElement.track;
// 						console.log("track loaded: ", track.kind);
						var cueTexts = [];
						for (var i = 0; i != track.cues.length; ++i){
							cueTexts.push(track.cues[i].text);
						}
						mediaElement.defaultTracks[trackElement.kind] = {
							"cueTexts": cueTexts,
							"kind": track.kind,
							"language": track.language
						};
					});
				}
		});
	});

}); // $(document).ready()




})();
