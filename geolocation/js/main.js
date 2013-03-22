var data = document.querySelector('#data');

function log(message){
	data.innerHTML += message + "<br />" + data.innerHTML;
}

navigator.geolocation.watchPosition(logPosition);

function logPosition(position){
	log('(' + position.coords.latitude + ', ' + position.coords.longitude +')');
}
