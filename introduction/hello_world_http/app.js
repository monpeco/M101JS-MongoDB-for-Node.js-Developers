// Source: howtonode.org/hello-node

// load the http module to craete an http server
var http = require('http');

// configure our http server to respond with Hello world
var server = http.createServer((request, response) => {
  response.writeHead(200, {"content-type" : "text/plain"});
  response.end("Hello world\n");
});

// listen to port 8080, IP defaults to 127.0.0.1
server.listen(8080);

// put a message on the terminal
console.log('Server running at http://127.0.0.1:8080/');

/* 
https://cpp-monpeco.c9users.io/ 
*/