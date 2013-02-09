var dataElement = document.getElementById("data");
var findButton = document.getElementById("findButton");
var storeButton = document.getElementById("storeButton");
var artist = document.getElementById("artist");
var song = document.getElementById("song");
var query = document.getElementById("query");

var songs = new IDBStore({
  dbVersion: 1,
  storeName: 'songs',
  keyPath: 'id',
  autoIncrement: true,
  onStoreReady: handleStoreReady,
  indexes: [
    {name: "artist"/*, keyPath: 'songName', unique: false, multiEntry: false */},
    {name: "song"}
  ]
});

console.log(songs);

function addSong(artist, song){
  console.log("Add song: ", artist, song);
  var song = {
    "artist": artist,
    "song": song
  };
  songs.put(song, handleSuccess, handleError);
}

function findSong(text) {
}

function handleStoreReady() {
  log("Store ready!");
}

function handleSuccess(id) {
  log("Song added, id: " + id);
}

function handleError(error) {
  log("Sorry. Something went wrong: " + error);
}

function log(message){
  dataElement.innerHTML = message + "<br /><br />" + dataElement.innerHTML;
}

storeButton.addEventListener("click", function(){
  addSong(artist.value, song.value);
});

findButton.addEventListener("click", function(){
  findSong(query.value);
});

