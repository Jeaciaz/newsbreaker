var http = require('http');
var fs = require('fs');

var server = http.createServer(function(request, response) {
  fs.readFile('./template/index.html', function(error, data) {
    if (error) {
      response.writeHead(404, {'Content-Type': 'text/plain'});
      response.end('Resource not found');
    } else {
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end(data);
    }
  });
});

var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
