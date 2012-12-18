var data = document.querySelector("#data");

function log(message){
  data.innerHTML += message + "<br /><br />";
}

o = {};

function observer(changes) {
	log(JSON.stringify(changes).replace(/{/g, "<br />{").replace(/,/g, "<br />,")); // make it look a bit nicer
}

Object.observe(o, observer);

o.a = "fred"; // new
o.a = "barney"; // updated
o.a = "barney"; // no change
o.b = "wilma"; // new
