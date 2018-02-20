var express = require('express'),
    engines = require('consolidate');

var app = express();

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
//app.set('views', __dirname, '/views');

function errorHandler(req, res, next) {
    //console.error(err.message);
    //console.error(err.stack);
    res.status(500).render('error_template', { error: 'Page not found' });
}

app.get('/:name', (req, res, next)=>{
    var name = req.params.name;
    console.log(name);
    var getvar1 = req.query.getvar1;
    var getvar2 = req.query.getvar2;
    console.log(getvar1);
    console.log(getvar2);

    res.render('hello', { name : name, getvar1 : getvar1, getvar2 : getvar2 });
});

app.use(errorHandler);

var server = app.listen(8080, ()=>{
    var port = server.address().port;
    console.log('Express server listening on port %s', port);
});

console.log('End');

/*
https://cpp-monpeco.c9users.io/Denver?getvar1=variable1&getvar2=variable_two

Hello, Denver, here are your GET variables:
variable1
variable_two

--

https://cpp-monpeco.c9users.io/that/other

Error: Page not found

*/