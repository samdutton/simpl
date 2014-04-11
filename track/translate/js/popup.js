var backgroundPage = chrome.extension.getBackgroundPage();

// set default for when popup first open -- gets from contentscript.js, which will not be injected on chrome://extensions, etc.
// first item is blank: user must be able to select their own language as the target language
var supportedLanguages = [{"language": "", "name": ""}, {"language": "af", "name": "Afrikaans"}, {"language": "sq",  "name": "Albanian"}, {"language": "ar", "name": "Arabic"}, {"language": "be", "name": "Belarusian"}, {"language": "bg", "name": "Bulgarian"}, {"language": "ca", "name": "Catalan"}, {"language": "zh", "name": "Chinese (Simplified)"}, {"language": "zh-TW", "name": "Chinese (Traditional)"}, {"language": "hr", "name": "Croatian"}, {"language": "cs", "name": "Czech"}, {"language": "da", "name": "Danish"}, {"language": "nl", "name": "Dutch"}, {"language": "en", "name": "English"}, {"language": "et", "name": "Estonian"}, {"language": "tl", "name": "Filipino"}, {"language": "fi", "name": "Finnish"}, {"language": "fr", "name": "French"}, {"language": "gl", "name": "Galician"}, {"language": "de", "name": "German"}, {"language": "el", "name": "Greek"}, {"language": "ht", "name": "Haitian Creole"}, {"language": "iw", "name": "Hebrew"}, {"language": "hi", "name": "Hindi"}, {"language": "hu", "name": "Hungarian"}, {"language": "is", "name": "Icelandic"}, {"language": "id", "name": "Indonesian"}, {"language": "ga", "name": "Irish"}, {"language": "it", "name": "Italian"}, {"language": "ja", "name": "Japanese"}, {"language": "ko", "name": "Korean"}, {"language": "lv", "name": "Latvian"}, {"language": "lt", "name": "Lithuanian"}, {"language": "mk", "name": "Macedonian"}, {"language": "ms", "name": "Malay"}, {"language": "mt", "name": "Maltese"}, {"language": "no", "name": "Norwegian"}, {"language": "fa", "name": "Persian"}, {"language": "pl", "name": "Polish"}, {"language": "pt", "name": "Portuguese"}, {"language": "ro", "name": "Romanian"}, {"language": "ru", "name": "Russian"}, {"language": "sr", "name": "Serbian"}, {"language": "sk", "name": "Slovak"}, {"language": "sl", "name": "Slovenian"}, {"language": "es", "name": "Spanish"}, {"language": "sw", "name": "Swahili"}, {"language": "sv", "name": "Swedish"}, {"language": "th", "name": "Thai"}, {"language": "tr", "name": "Turkish"}, {"language": "uk", "name": "Ukrainian"}, {"language": "vi", "name": "Vietnamese"}, {"language": "cy", "name": "Welsh"}, {"language": "yi", "name": "Yiddish"}];

var tabId;
chrome.tabs.getSelected(null, 
	function(tab) {
		tabId = tab.id;
	}
);


$(document).ready(function(){

	var jLanguageSelect = $("select#languageSelect");

	// see comment above
	if (!!backgroundPage.supportedLanguages){
		supportedLanguages = backgroundPage.supportedLanguages;	
		supportedLanguages.unshift({"language": "", "name": ""});
	}
	
	for (var i = 0; i !== supportedLanguages.length; ++i){
		var supportedLanguage = supportedLanguages[i];
		jLanguageSelect
			.append($("<option></option>")
			.attr("value", supportedLanguage.language)
			.text(supportedLanguage.name)); 
	}	

	// set the current language
	// 	var browserLanguage = window.navigator.language.split("-")[0] || "en";	
	jLanguageSelect.val(backgroundPage.selectedLanguage);
	
	var isLanguageSelected = backgroundPage.selectedLanguage !== "";
	$("#translateSubtitles").attr("checked", isLanguageSelected);
	$("#translateSubtitles").attr("disabled", !isLanguageSelected);
	$("#speakSubtitles").attr("disabled", !isLanguageSelected);

	// when the language is changed, send a message to the content script 
	// to translate subtitles
	jLanguageSelect.change(function(){
		var selectedLanguage = $(this).find(":selected").attr("value");	
		backgroundPage.selectedLanguage = selectedLanguage;	
		backgroundPage.translateSubtitles = selectedLanguage !== "";
		if (selectedLanguage === ""){
			$("#translateSubtitles").attr("checked", false);
			$("#translateSubtitles").attr("disabled", true);
			$("#speakSubtitles").attr("checked", false);
			$("#speakSubtitles").attr("disabled", true);
		} else {
			$("#translateSubtitles").attr("checked", true);
			$("#translateSubtitles").attr("disabled", false);
			$("#speakSubtitles").attr("disabled", false);
			var request = {
				"type": "changeLanguage",
				"language": backgroundPage.selectedLanguage
			};
			chrome.tabs.sendRequest(tabId, request, function(){});
		}
	});	
	
	function handleCheckboxChange(){
		var isChecked = $(this).is(":checked");
		var checkboxId = this.id;
		backgroundPage[checkboxId] = isChecked;
		chrome.tabs.getSelected(null, 
			function(tab) {
				var request = {
					"type": "toggleSubtitles",
					"isChecked": isChecked,
					"checkboxId": checkboxId
				};
				chrome.tabs.sendRequest(tab.id, request, function(){});
			}
		);
	}
	var checkboxIds = ["showSubtitles", "translateSubtitles", "speakSubtitles"];	
	for (var i = 0; i !== checkboxIds.length; ++i){
		var checkboxId = checkboxIds[i];
		var jCheckbox = $("input#" + checkboxId);
		// checked/unchecked value is 'stored' in background page
		jCheckbox.prop("checked", backgroundPage[checkboxId]);	
		jCheckbox.change(handleCheckboxChange);		
	}	

	

}); // $(document).ready()


// workaround for lack of Inspect Popup in Chrome 4 -- copes with strings and other objects
function clog(val) {
 	var message = JSON.stringify(val).replace(/\n/g, " ");
 	chrome.tabs.sendRequest(tabId, {"type": "consoleLog", "value": message});	
}




