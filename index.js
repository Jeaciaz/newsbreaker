var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var memesSaved = 0;

var app = express();
var port = process.env.PORT || 8080;

app.use('/static', express.static(__dirname + '/static'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/template/index.html');
});

var server = app.listen(port, function () {
    console.log("Server running at http://localhost:%d", port);
});
