var xhr = new XMLHttpRequest();
xhr.open("GET", "data.json");

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    var data = JSON.parse(xhr.responseText);
    document.querySelector("#data").innerHTML = JSON.stringify(data);
  }
}

/* 
// can do this in Chrome, Firefox, etc.:
xhr.onload = function(event) {
  var data = JSON.parse(this.response);
  document.querySelector("#data").innerHTML = JSON.stringify(data);
}
*/

xhr.send();
