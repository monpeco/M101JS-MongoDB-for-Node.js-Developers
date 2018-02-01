const MongoClient = require('mongodb').MongoClient

// Connection URL
const url = 'mongodb://localhost:27017/'
// Use connect method to connect to the DB server
MongoClient.connect(url, (error, client) => {
  if (error) return process.exit(1)
  
  console.log('Connection is okay')
  var db = client.db('school');  
  //console.log(db.listCollections())
        
  insertDocuments(db, () => {
    client.close()
  })
  
})


const insertDocuments = (db, callback) => {
  var collection = db.collection('books')
  // Insert 3 documents
  collection.insert([
{"_id": "Classical Mechanics", "children": [], "descendants": []},
{"_id": "Quantum Mechanics", "children": [], "descendants": []},
{"_id": "Physics", "children": ["Classical Mechanics", "Quantum Mechanics"], "descendants": ["Classical Mechanics", "Quantum Mechanics"] },
{"_id": "Chemistry", "children": [], "descendants": []},
{"_id": "Science", "children": ["Chemistry", "Physics"], "descendants": ["Chemistry", "Physics", "Classical Mechanics", "Quantum Mechanics"]},
{"_id": "Books", "children": ["Science"], "descendants": ["Science", "Chemistry", "Physics", "Classical Mechanics", "Quantum Mechanics"]},
], (error, result) => {
    if (error) { 
      console.log('error in insert');
      return process.exit(1);
    }
    console.log('result.result.n :' + result.result.n) // will be 3
    console.log('result.ops.length: ' + result.ops.length) // will be 3
    callback(result)
  })
}