var express = require('express'),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
    
var app = express();

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
//app.set('views', __dirname, '/views');

MongoClient.connect('mongodb://localhost:27017/video', (err, Client) => {
  
  assert.equal(null, err);
  console.log('Successfully connected to MongoDB');
  
  var db = Client.db('video');
  
  app.get('/', (req, res)=>{
    
    db.collection('movies').find({}).toArray((err, docs)=> {
      
      assert.equal(null, err);
      console.log(docs);
      res.render('movies', {'movies' : docs} );
      
    });
    
  });
  
  app.use((req, res)=>{
    res.sendStatus(404);
  });
  
  var server = app.listen(8080, ()=>{
    var port = server.address().port;
    console.log('Express server listening on port %s', port)
  });
  
});