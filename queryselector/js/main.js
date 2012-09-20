document.querySelector("div");
document.querySelector("#id");
document.querySelector(".class");
document.querySelectorAll('#container li');
document.querySelectorAll("#large:nth-child(even)");

var data = document.getElementById("data");
function log(message){
  data.innerHTML += message + "<br />";
}