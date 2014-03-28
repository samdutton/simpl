var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");

// fill a rectangle
context.fillStyle="#333";
context.fillRect(0, 0, 640, 640);

// draw lines
context.strokeStyle="red";
context.lineWidth = 20;
context.lineCap = "round";
context.lineJoin = "round";
context.moveTo(40, 40);
context.lineTo(200, 100);
context.lineTo(40, 140);
context.stroke();

// draw a circle
context.fillStyle="blue";
context.beginPath();
context.arc(345, 100, 30, 0, Math.PI*2, true);
context.closePath();
context.fill();

// draw text
context.fillStyle = "darkGreen";
context.font = "bold 36px sans-serif";
context.fillText("It's simpl!", 455, 112);

// draw image
var image = new Image();
image.src = "images/eye.png";
image.onload = function() {
  context.drawImage(image, 680, 80);
}
