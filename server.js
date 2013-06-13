var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

app.use(express.static(__dirname + '/public'));

server.listen(3333);
console.log("Serveur node à l'écoute sur le port 3333");
