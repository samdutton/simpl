var customers = new IDBStore({
  dbVersion: 1,
  storeName: 'customer',
  keyPath: 'id',
  autoIncrement: true,
  onStoreReady: function(){
    console.log('Store ready!');
  }
});

var dude = {
  firstname: 'John',
  lastname: 'Doe',
  age: 52,
  emails: [
    'johndoe@example.com',
    'jd@example.com'
  ]
};

var onsuccess = function(id){
  console.log('Yeah, dude inserted! insertId is: ' + id);
}
var onerror = function(error){
  console.log('Oh noes, sth went wrong!', error);
}

customers.put(dude, onsuccess, onerror);
