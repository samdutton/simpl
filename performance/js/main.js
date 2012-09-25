var data = document.querySelector("p#data");
function log(message){
  data.innerHTML += message + "<br />";
}

var wp = JSON.stringify(window.performance);
log(wp.replace(/{/g, "<br />{").replace(/,/g, "<br />,")); // make it look a bit nicer