var data = document.querySelector("p#data");
function log(message){
  data.innerHTML += message + "<br />";
}

log("innerHTML for p#betty using querySelector('p#betty'): ");
log(document.querySelector("p#betty").innerHTML);

log("<br />innerHTML for each p.rubble using querySelectorAll('p.rubble'): ");
var rubbles = document.querySelectorAll("p.rubble");
for (var i = 0; i != rubbles.length; ++i){
  log(rubbles[i].innerHTML);
}

log("<br />innerHTML for odd-numbered paragraphs using querySelectorAll('div#bedrock p:nth-child(odd)'): ");
var oddParagraphs = document.querySelectorAll("div#bedrock p:nth-child(odd)");
for (var i = 0; i != oddParagraphs.length; ++i){
  log(oddParagraphs[i].innerHTML);
}

