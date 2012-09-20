var data = document.getElementById("data");
function log(message){
  data.innerHTML += message + "<br />";
}

var Person = function(name, email){
  this.name = name;
  this.email = email;
}

var barney = new Person("Barney Rubble", "barney@rubble.com");
var betty = new Person("Betty Rubble", "betty@rubble.com");
var fred = new Person("Fred Flintstone", "fred@flintstone.com");
var wilma = new Person("Wilma Flintstone", "wilma@flintstone.com");

var array = [barney, betty, fred, wilma];

log("Array:<br />" + JSON.stringify(array).replace(/},/g,"},<br />") + "<br />");

log("Use filter() and forEach() to show people with rubble.com emails:");

var rubbles = array.filter(function(element, index, array){
  return element.email.indexOf("rubble") != -1;
});

rubbles.forEach(function(element, index, array){
  log(element.name + " ");
});

var hasFlintstones = array.some(function(element, index, array){
  return element.name.indexOf("Flintstone") != -1;
});

log("<br />Use some() to check if the array contains any Flintstones:<br />" + "any Flintstones? " + hasFlintstones);

var allFlintstones = array.every(function(element, index, array){
  return element.name.indexOf("Flintstone") != -1;
});

log("<br />Use every() to check if the array is all Flintstones:<br />" + "all Flinstones? " + allFlintstones);

var firstNames = array.map(function(element, index, array){
  return element.name.split(" ")[0];
});

log("<br />Use map() to build an array of first names:<br />" + JSON.stringify(firstNames));
