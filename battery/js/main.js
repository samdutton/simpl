'use strict';

var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;

function log(message){
  document.querySelector('#data').innerHTML += message + '<br />';
}

function logBattery(battery) {
	log('Battery level: ' + battery.level);
	log('Battery charging: ' + battery.charging);
	log('Battery discharging time: ', battery.dischargingTime);
	battery.addEventListener('chargingchange', function() {
	  log('Battery chargingchange event: ' + battery.charging);
	}, false);
}

if(navigator.getBattery) {
	navigator.getBattery().then(logBattery, function() {
		log('There was an error while getting the battery state.');
	});
} else if (battery) {
	logBattery(battery);
} else {
	log('Shame! The Battery API is not supported on this platform.');
}
