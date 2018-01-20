var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var url = 'mongodb://localhost:27017/video';

MongoClient.connect(url, function(err, client) {

    assert.equal(null, err);
    console.log("Successfully connected to server");

    // change the recieved parameter to a 'client'
    var db = client.db('video');  // must have the collection name

    // Find some documents in our collection
    db.collection('movies').find({}).toArray(function(err, docs) {

        // Print the documents returned
        docs.forEach(function(doc) {
            console.log(doc.title);
        });

        // Close the DB
        client.close();
    });

    // Declare success
    console.log("Called find()");
});


