var backgroundPage = chrome.extension.getBackgroundPage();

var tabId;
chrome.tabs.getSelected(null,
	function(tab) {
		tabId = tab.id;
	}
);


