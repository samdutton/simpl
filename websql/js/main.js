var db = openDatabase("songs", "1.0", "Favourite songs", 2 * 1024 * 1024); // short name, version, display name, max size

db.transaction(function (tx) {
//  tx.executeSql('DROP TABLE IF EXISTS songs');
  tx.executeSql("CREATE TABLE IF NOT EXISTS songs (artist varchar(255), song varchar(255))", [], null, handleError);
}, null, null); // error handler, success handler

function addSong(artist, song){
  db.transaction(function (tx) {  
    tx.executeSql("INSERT INTO songs (artist, song) VALUES (?, ?)", [artist, song]);
  }, handleError, function(e){
    log("Added: <br />" + song + " by " + artist);
  });
}

function findSong(text) {
  db.transaction(function (tx) {  // readTransaction() is apparently faster
    var statement = 'SELECT artist, song FROM songs WHERE artist LIKE "%' + text + '%" OR song like "%' + text + '%"';    
    tx.executeSql(statement, [], function(tx, results){ // array unused here: ? field values not used in query statement
      var numRows = results.rows.length;
      for (var i = 0; i != numRows; ++i) {
        var row = results.rows.item(i);
        log("Found: <br />" + row["song"] + " by " + row["artist"]);
      }
    }, handleError); 
  });
}

// tx.executeSql("DELETE FROM songs WHERE SONG=?", [song], handleError, null);

function handleError(transaction, error) {
  log("Sorry. Something went wrong: " + error.message + ", code: " + error.code);
  return false;
}

var dataElement = document.getElementById("data");
function log(message){
  dataElement.innerHTML = message + "<br /><br />" + dataElement.innerHTML;
}



var storeButton = document.getElementById("storeButton");
var artist = document.getElementById("artist");
var song = document.getElementById("song");
storeButton.addEventListener("click", function(){
  addSong(artist.value, song.value);
});

var query = document.getElementById("query");
findButton.addEventListener("click", function(){
  findSong(query.value);
});

