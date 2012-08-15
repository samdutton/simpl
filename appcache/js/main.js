// Adapted from Eric Bidelman's article at www.html5rocks.com/en/tutorials/appcache/beginner

window.addEventListener('load', function(e) {

  log("Window <em>load</em> event");

  var appCache = window.applicationCache;

  // Fired after the first cache of the manifest.
  appCache.addEventListener('cached', handleCacheEvent, false);
  
  // Checking for an update. Always the first event fired in the sequence.
  appCache.addEventListener('checking', handleCacheEvent, false);
  
  // An update was found. The browser is fetching resources.
  appCache.addEventListener('downloading', handleCacheEvent, false);
  
  // The manifest returns 404 or 410, the download failed,
  // or the manifest changed while the download was in progress.
  appCache.addEventListener('error', handleCacheError, false);
  
  // Fired after the first download of the manifest.
  appCache.addEventListener('noupdate', handleCacheEvent, false);
  
  // Fired if the manifest file returns a 404 or 410.
  // This results in the application cache being deleted.
  appCache.addEventListener('obsolete', handleCacheEvent, false);
  
  // Fired for each resource listed in the manifest as it is being fetched.
  appCache.addEventListener('progress', handleCacheEvent, false);
  
  // Fired when the manifest resources have been newly redownloaded.
  appCache.addEventListener('updateready', handleCacheEvent, false);

}, false);

function handleCacheEvent(e) {
  log("AppCache <em>" + e.type + "</em> event");
  console.log(e);
}

function handleCacheError(e) {
  log("AppCache error: " + e.data);
};

var data = document.getElementById("data");
function log(text){
  data.innerHTML += text + "<br />";
}