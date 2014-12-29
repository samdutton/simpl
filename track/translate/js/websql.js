

function transactionErrorHandler(error) {
    alert("Transaction error: " + error.message + ", code: " + error.code);
}
 
function transactionSuccessHandler() {
//    alert("Transaction successful.");
}

function queryErrorHandler(transaction, error) {
	// !!!hack -- not sure of a better way...
	if (error.message === "constraint failed") {
		alert("A framegrab has already been saved for this time.");
	} else {
	    console.log("Sorry -- something went wrong: " + error.message + ", code: " + error.code + 
			". Sam Dutton would appreciate if you could email this error to sam.dutton@gmail.com.");
	}
	
    return false;
}
 
var db = openDatabase('framegrabs', '1.0', 'Framegrabs', 1024 ^ 1024); // short name, version, display name, max size (made up number...)
db.transaction(function (tx) {
//	tx.executeSql('DROP TABLE IF EXISTS framegrabs');
	tx.executeSql('CREATE TABLE IF NOT EXISTS framegrabs (dataUrl, pageTitle, pageUrl, timecode FLOAT(2), videoSrc, UNIQUE(pageUrl, videoSrc, timecode))', 
		[], null, queryErrorHandler);
}, transactionErrorHandler, transactionSuccessHandler);

function showResults(transaction, results) {
	if (results.rows && results.rows.length > 0) {
		var i, message = "", prop;
		for (i = 0; i !== results.rows.length; ++i) {
			message += "Item " + i + "\n";
			var row = results.rows.item(i);
			for (prop in row) {
				if (row.hasOwnProperty(prop)) {
					message += prop + ": " + row[prop] + "\n";
				}
			}
			message += "\n";
		}
		if (message !== "") {
			alert(message);
		}	
	}
}

function handleResults(tx, results, callback) {
	callback(results.rows);
}

// see also doReadQuery() below
function doQuery(statement, querySuccessHandler, parameters) {
	db.transaction(function (tx) {
		tx.executeSql(statement, parameters, querySuccessHandler, queryErrorHandler);
	}, transactionErrorHandler, transactionSuccessHandler);
}

// uses Database readTransaction() method, supposedly faster than transaction()
function doReadQuery(statement, querySuccessHandler, parameters) {
	db.readTransaction(function (tx) {
		tx.executeSql(statement, parameters, querySuccessHandler, queryErrorHandler);
	}, transactionErrorHandler, transactionSuccessHandler);
}

function getData(statement, callback) {
	doReadQuery(statement, 
		function(tx, results) { // query success handler
			handleResults(tx, results, callback);		
	});
}

// function storeFramegrab(request) {
	// var statement = "INSERT INTO framegrabs (dataUrl, pageTitle, pageUrl, timecode, videoSrc) VALUES (?, ?, ?, ?, ?)";
	// doQuery(statement, null, [request.dataUrl, request.pageTitle, request.pageUrl, request.timecode, request.videoSrc]);
// }

// function deleteFramegrabs(pageUrl, videoSrc) {
    // doQuery("DELETE FROM framegrabs WHERE pageUrl = '" + pageUrl + "' AND videoSrc = '" + videoSrc + "'");
// }
