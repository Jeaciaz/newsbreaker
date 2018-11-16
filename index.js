var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

  app.use(express.static('/static'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/template/index.html');
});

var server = app.listen(port, function () {
  console.log("Server running at http://localhost:%d", port);
});
