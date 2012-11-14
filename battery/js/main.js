var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;

function log(message){
  document.querySelector("#data").innerHTML += message + <br />
}

log("Battery level: " + battery.level);
log("Battery charging: " + battery.charging);
log("Battery discharging time: ", battery.dischargingTime);

battery.addEventListener("chargingchange", function(e) {
  log("Battery chargingchange event: " + battery.charging);
}, false);

