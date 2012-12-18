// code adapted from HTML5 Rocks article by Eric Bidelman
// http://www.html5rocks.com/en/tutorials/file/filesystem/

// init a FileSystem
// create a file
// write to the file
// read from the file

window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/,
  handleInitSuccess, handleError);

var fileSystem;
function handleInitSuccess(fileSystem) {
  window.fileSystem = fileSystem
	log('Initiated FileSystem: ' + fileSystem.name);
	createFile("foo.txt");
}

function createFile(fullPath){
  fileSystem.root.getFile(fullPath, {create: true, /*exclusive: true*/},
    function(fileEntry) {
      log("Created file: " + fileEntry.fullPath);
      writeToFile(fileEntry, "Greetings from success callback!");
  }, handleError);
}

function writeToFile(fileEntry, text){
  // Create a FileWriter object for fileEntry
  fileEntry.createWriter(function(fileWriter) {
    fileWriter.onwriteend = function(e) {
      // read from file
      log('Wrote text <em>' + text + '</em> to file ' + fileEntry.fullPath);
      readFromFile(fileEntry.fullPath);
    };
    fileWriter.onerror = function(e) {
      log('Write failed: ' + e.toString());
    };
    // Create a new Blob and write it to log.txt.
    var blob = new Blob([text], {type: 'text/plain'});
    fileWriter.write(blob);
  }, handleError);
}

function readFromFile(fullPath){
  fileSystem.root.getFile(fullPath, {}, function(fileEntry) {
    // Get a File object representing the file, then use FileReader to read its contents.
    fileEntry.file(function(file) {
       var reader = new FileReader();
       reader.onloadend = function(e) {
         log("Read text <em>" + this.result + "</em> from file " + fullPath);
       };
       reader.readAsText(file);
    }, handleError);

  }, handleError);
}

function handleError(e) {
  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      log('QUOTA_EXCEEDED_ERR');
      break;
    case FileError.NOT_FOUND_ERR:
      log('NOT_FOUND_ERR');
      break;
    case FileError.SECURITY_ERR:
      log('SECURITY_ERR');
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      log('INVALID_MODIFICATION_ERR');
      break;
    case FileError.INVALID_STATE_ERR:
      log('INVALID_STATE_ERR');
      break;
    default:
      log('Unknown error');
      break;
  };
}

var data = document.getElementById("data");
function log(text){
  data.innerHTML += text + "<br />";
}
