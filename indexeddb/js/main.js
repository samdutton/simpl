window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
var request = window.indexedDB.open("CandyDB");
request.onsuccess = function(event) {
console.log(event);
  var db = request.result;
  if (db.version != "1") {
    // User's first visit, initialize database.
    var createdObjectStoreCount = 0;
    var objectStores = [
      { name: "kids", keyPath: "id", autoIncrement: true },
      { name: "candy", keyPath: "id", autoIncrement: true },
      { name: "candySales", keyPath: "", autoIncrement: true }
    ];
 
    function objectStoreCreated(event) {
      if (++createdObjectStoreCount == objectStores.length) {
        db.setVersion("1").onsuccess = function(event) {
          loadData(db);
        };
      }
    }
 
    for (var index = 0; index < objectStores.length; index++) {
      var params = objectStores[index];
      request = db.createObjectStore(params.name, params.keyPath,
                                     params.autoIncrement);
      request.onsuccess = objectStoreCreated;
    }
  }
  else {
    // User has been here before, no initialization required.
    loadData(db);
  }
};

/*

// adapted from https://developer.mozilla.org/en-US/docs/IndexedDB/Using_IndexedDB and other sources

// to cope with various browser implementations
window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

if ('webkitIndexedDB' in window) {
  window.IDBTransaction = window.webkitIDBTransaction;
  window.IDBKeyRange = window.webkitIDBKeyRange;
}

const songs = [
  {"timeStamp": new Date().getTime(), artist: "Shel Silverstein", song: "Drop Kick Me Jesus (Through The Goalposts Of Life)"},
  {"timeStamp": new Date().getTime(), artist: "Mental As Anything", song: "If You Leave Me, Can I Come Too?"},
  {"timeStamp": new Date().getTime(), artist: "The Slits", song: "Typical Girls"}  
];

// second parameter is version, used when updating the database schema
var db;
var request = indexedDB.open("songs");
request.onerror = function(event) {
  log("Sorry! There was an error: code " + event.target.errorCode);
};
request.onsuccess = function(event) {
  db = request.result;
  log(db);
}; 

request.onupgradeneeded = function(event) {
  var db = event.target.result;
 
  // timestamp used as unique key
  var objectStore = db.createObjectStore("songs", {keyPath: "timestamp"});
 
  // Create an index to search by artist. 
  objectStore.createIndex("artist", "artist", {unique: false});
 
  // Create an index to search by song.
  objectStore.createIndex("song", "song", {unique: true});
 
  var numSongs = songs.length;
  for (var i = 0; i != numSongs; ++i) {
    objectStore.add(songs[i]);
  }
};

/*

var transaction = db.transaction(["songs"], "readwrite"); // webkitIDBTransaction.READ_WRITE

// Do something when all the data is added to the database.
transaction.oncomplete = function(event) {
  log("finished");
  console.log(event);
};
 
transaction.onerror = function(event) {
  log("Sorry! There was an error: code " + event.target.errorCode);
};
 
var objectStore = transaction.objectStore("songs");
for (var i in songs) {
  var request = objectStore.add(songs[i]);
  request.onsuccess = function(event) {
    console.log("added " + event.target.result);
    // event.target.result == songs[i].timestamp
  };
}

var transaction = db.transaction(["songs"]);
var objectStore = transaction.objectStore("songs");

var cursorRequest = objectStore.openCursor();
cursorRequest.onsuccess = function(e) {
  var result = e.target.result;
  if(!!result == false)
    return;
  log(result.value);
  result.continue();
};
cursorRequest.onerror = function(error){
  log("Sorry! There was an error: code " + event.target.errorCode);
};

//////////////////////////

var index = objectStore.index("artist");

index.get("Mental As Anything").onsuccess = function(event) {
  alert("Mental As Anything's timestamp is " + event.target.result.timestamp);
};

index.openCursor().onsuccess = function(event) {
  var cursor = event.target.result;
  if (cursor) {
    // cursor.key is a name, like "Bill", and cursor.value is the whole object.
    alert("Artist: " + cursor.key + ", timestamp: " + cursor.value.timestamp + ", song: " + cursor.value.song);
    cursor.continue();
  }
};
 
index.openKeyCursor().onsuccess = function(event) {
  var cursor = event.target.result;
  if (cursor) {
    log("Artist: " + cursor.key + ", timestamp: " + cursor.value);
    cursor.continue();
  }
};

// Only match "Mental As Anything"
// there are lots of other types of key range
var singleKeyRange = IDBKeyRange.only("Mental As Anything");
 
index.openCursor(singleKeyRange).onsuccess = function(event) {
  var cursor = event.target.result;
  if (cursor) {
    console.log(cursor.value);   
    cursor.continue();
  }
};
var data = document.getElementById("data");
function log(message){
  console.log(message);
//  data.innerHTML += message + "<br/><br/>";
};

*/