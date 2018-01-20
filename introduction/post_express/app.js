var express = require('express'),
    engines = require('consolidate'),
    bodyParser = require('body-parser');

var app = express();

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true })); 

// Handler for internal server errors
function errorHandler( req, res, next) {
  //console.error(err.message);
  //console.error(err.stack);
  res.status(500).render('error_template', { error: 'This is not available' });
}

app.get('/',(req, res, next)=>{
  res.render('fruitPicker', {fruits: ['apple', 'orange', 'banana', 'peach']});
});

app.post('/favorite_fruit',(req, res, next)=>{
    
  var favorite = req.body.fruit;
  console.log(favorite);
    
  if(typeof favorite == 'undefined'){
    next('Please choose a fruit');
  }else{
    res.send("Your favorite fruit is " + favorite);
  }
});

app.use(errorHandler);

var server = app.listen(8080, function() {
  var port = server.address().port;
  console.log('Express server listening on port %s.', port);
});
