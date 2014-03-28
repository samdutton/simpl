var header = document.querySelector('header');
var localVideo = document.querySelector('video#localVideo');

var timeout;
document.body.onmousemove = function(e){
  clearTimeout(timeout);
  if (!header.classList.contains('active')) {
    header.classList.add('active');
    var timeout = setTimeout(function(){
      header.classList.remove('active')
    }, 5000);
  }
}

// localVideo.onmouseout = document.body.ontouchstart = function(){
//   header.classList.remove('active');
// }


