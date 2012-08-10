// set name of visibility change and state events for different browsers
var visibilityChange, visibilityState; 
if (typeof document.visibilityState !== "undefined") {
	visibilityChange = "visibilitychange";
	visibilityState = "hidden";
} else if (typeof document.mozHidden !== "undefined") {
	visibilityChange = "mozvisibilitychange";
	visibilityState = "mozVisibilityState";
} else if (typeof document.msHidden !== "undefined") {
	visibilityChange = "msvisibilitychange";
	visibilityState = "msVisibilityState";
} else if (typeof document.webkitHidden !== "undefined") {
	visibilityChange = "webkitvisibilitychange";
	visibilityState = "webkitVisibilityState";
}

var data = document.getElementById("data");

data.innerHTML += new Date().toTimeString() + ": <em>" + document.title + "</em> is " + document[visibilityState] + "<br />";

document.addEventListener(visibilityChange, function(){
  data.innerHTML += new Date().toTimeString() + ": <em>" + document.title + "</em> is " + document[visibilityState] + "<br />";
});
window.addEventListener("focus", function(){
  data.innerHTML += new Date().toTimeString() + ": Focus event for <em>" + document.title + "</em><br />";
});
window.addEventListener("blur", function(){
  data.innerHTML += new Date().toTimeString() + ": Blur event for <em>" + document.title + "</em><br />";
});
