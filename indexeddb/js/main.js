var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB;

var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction;

var dbVersion = 1.0;

var request = indexedDB.open("My songs", dbVersion);
var db;

function createObjectStore(database) {
  console.log("Creating objectStore");
  database.createObjectStore("songs");
}

function getImageFile() {
  putElephantInDb("blah");
}

function getTransaction(){
  try {
    var transaction = db.transaction(["songs"], "readwrite");
  } catch(e) {
    try {
      var transaction = db.transaction(["songs"], IDBTransaction.READ_WRITE);
      console.log("transaction: ", transaction);
    } catch(e) {
      console.log("Error creating transaction: ", e);    
    }
  }
  return transaction;
}      

function putElephantInDb(blob) {
  console.log("Putting elephants in IndexedDB");  
  var transaction = getTransaction();
  var put = transaction.objectStore("songs").put(blob, "image");
  transaction.objectStore("songs").get("image").onsuccess = function (event) {
    console.log(event.target.result);
  };
};

request.onerror = function(event) {
  console.log("Request error: ", event);
};

request.onsuccess = function(event) {
  console.log("Request success: ", event);
  db = request.result;  
  db.onerror = function(event) {
    console.log("Database error:", event);
  };  
  // Interim solution for Google Chrome to create an objectStore. Will be deprecated.
  if (db.setVersion) {
    if (db.version != dbVersion) {
      var setVersion = db.setVersion(dbVersion);
      setVersion.onsuccess = function () {
        createObjectStore(db);
        getImageFile();
      };
    } else {
    getImageFile();
    }
  }
  else {
    getImageFile();
  }
}

// For future use. Currently only in latest Firefox versions.
// GI: might be good to have the versions for FF,Chrome and IE (10:) here.
request.onupgradeneeded = function (event) {
  createObjectStore(event.target.result);
};
