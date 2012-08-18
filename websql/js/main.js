var db = openDatabase("short name", "1.0", "display name", 2 * 1024 * 1024); // short name, version, display name, max size
db.transaction(function (tx) {
  tx.executeSql("CREATE TABLE IF NOT EXISTS foo (id unique, text)");
  tx.executeSql("INSERT INTO foo (id, text) VALUES (1, "blah")");
});

// tx.executeSql("DELETE FROM todo WHERE ID=?", [id],
//     html5rocks.webdb.onSuccess,
//     html5rocks.webdb.onError);
// });

// var statement = 'SELECT poemIndex, poemTitle, lineNumber, lineText FROM poems WHERE lineText like "%' + query + '%"'; 

tx.executeSql("SELECT * FROM foo", [], function (tx, results) {
  var len = results.rows.length, i;
  for (i = 0; i < len; i++) {
    log(results.rows.item(i).text);
  }
});

function log(message){
  document.getElementById("data").innerHTML += message + "<br />";
}