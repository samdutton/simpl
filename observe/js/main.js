var data = document.querySelector("#data");
console.log(data);

function log(message){
  data.innerHTML += message + "<br /><br />";
}

o = {};
function observer(changes) {
	log(JSON.stringify(changes));
}
Object.observe(o, observer);

o.a = "fred"; // new
o.a = "barney"; // updated
o.a = "barney"; // no change
o.b = "wilma"; // new
