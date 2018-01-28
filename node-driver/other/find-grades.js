const MongoClient = require('mongodb').MongoClient

// Connection URL
const url = 'mongodb://localhost:27017/'
// Use connect method to connect to the DB server
MongoClient.connect(url, (error, client) => {
  if (error) return process.exit(1)
  
  console.log('Connection is okay')
  var db = client.db('school');  
  //console.log(db.listCollections())
        
  findDocuments(db, () => {
    client.close()
  })
  
})


var findDocuments = (db, callback) => {
  // Get the documents collection
  var cursor = db.collection('grades').find({})
  cursor.sort({"grade": -1});
  cursor.skip(4);
  cursor.limit(2);
  
  cursor.forEach((doc)=>{
    console.log(doc);
  },(err)=>{
    if (err) return process.exit(-1);
    return process.exit(0);
  });
  console.log('the result:');
}