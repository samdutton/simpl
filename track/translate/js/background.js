// chrome.tts.speak('Cent cinquante ans après la publication du livre révolutionnaire de Darwin', {'lang': 'fr'});



// chrome.browserAction.setBadgeBackgroundColor({"color": [0, 200, 0, 100]});

// function initBrowserAction(request) {
	// if (request.numVideos > 0) {
		// var numVideos = request.numVideos.toString();
		// chrome.browserAction.setBadgeText({"text": numVideos});
		// chrome.browserAction.setTitle({"title": numVideos + " video element(s) found on this page. \nClick to view stored framegrabs, or save framegrabs \nby using the icons overlaid on the video(s)."});
	// }
// }

var supportedLanguages;
var audio = new Audio();
audio.autoplay = true;
var audioURLs = [];
// play each subtitle translation as the last one ends
audio.addEventListener("ended", function(){
// 	console.log("audio ended, audioURLs: ", audioURLs);
	audio.src = audioURLs.shift();
// 	console.log("audio ended, audioURLs.length now: ", audioURLs.length);
});


var selectedLanguage = "";
var showSubtitles = true;
var translateSubtitles = false;
var speakSubtitles = false;

function clearSpokenSubtitleBacklog(){
// 	console.log("clearSpokenSubtitleBacklog()");
	audioURLs = [];
// 	audio.src = "";
}

function speakSubtitle(text, language){
	var audioURL = "http://translate.google.com/translate_tts?tl=" + language + "&q=" + text;
// 	console.log("speakSubtitles request in background.js: " + language + ", " + text);
	// wait for each subtitle to be spoken before speaking the next:
	// set audio.src if none set already, otherwise add audioURL to the audioURLs array
	if (audio.currentSrc === "") {
		audio.src = audioURL;
// 		console.log("audio.src === ''", audio.src);
	} else if (audio.currentTime === 0) { // hack to cope for when ended event not fired
// 		console.log("audio.currentTime === 0, audioURLs: " + audioURLs.length);
		audio.src = audioURLs.shift();
		audioURLs.push(audioURL);
	} else {
		audioURLs.push(audioURL);
	}
}

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		var response = {};
		// when changing language or toggling "Speak subtitles" from popup,
		// clear the backlog of cues to be translated and spoken
		if (request.type === "clearSpokenSubtitleBacklog") {
			clearSpokenSubtitleBacklog();
		} else if (request.type === "getSettings") {
			response.selectedLanguage = selectedLanguage;
			response.speakSubtitles = speakSubtitles;
		} else if (request.type === "setSupportedLanguages") {
			supportedLanguages = request.supportedLanguages;
		} else if (request.type === "speakSubtitles") {
			speakSubtitle(request.text, request.language);
		} else {
			alert("Unknown request type in background.html: " + request.type);
		}
		sendResponse(response);  // allows request to be cleaned up -- otherwise it stays open
	}
);

// tab selection changed
chrome.tabs.onActivated.addListener(
	function handleSelectionChange(tabId, selectInfo) {
	// 		 chrome.browserAction.setBadgeText({"text": ""});
	// 		 chrome.browserAction.setTitle({"title": "No video elements found on this page. \nClick to view framegrabs saved from other pages."});
	// 		 chrome.tabs.sendRequest(tabId, {"type": "sendNumVideos"}, initBrowserAction);
		clearSpokenSubtitleBacklog();
	}
);


// e.g. tab url changed
chrome.tabs.onUpdated.addListener(
	function handleUpdate(tabId, selectInfo) {
		clearSpokenSubtitleBacklog();
	}
);

