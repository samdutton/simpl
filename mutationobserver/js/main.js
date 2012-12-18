var data = document.querySelector("#data");

function log(message){
  data.innerHTML = message + "<br />" + data.innerHTML;
}

var target = document.querySelector("#observed");
target.focus();

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

function mutationEventCallback(mutations){
  mutations.forEach(function(mutation) {
  	console.log(mutation);
    if (mutation.type === "characterData"){
	    log("Old value: " + mutation.oldValue);
		} else if  (mutation.type === "childList"){
			log("Added: " + mutation.addedNodes[0]);
		}
  });
}

var observer = new MutationObserver(mutationEventCallback);

var config = {
	characterData: true,
	characterDataOldValue: true,
	childList: true,
	subtree: true // see crbug.com/134322
};


observer.observe(target, config);
