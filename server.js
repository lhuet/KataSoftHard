var express = require('express');
var http = require('http');
var fs = require('fs');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var sensorFile="/sys/devices/platform/omap/tsc/ain5";

app.use(express.static(__dirname + '/public'));

server.listen(3333);
console.log("Serveur node à l'écoute sur le port 3333");



io.sockets.on('connection', function (socket) {
  readSensor(socket)
});


function readSensor(socket) {
  fs.readFile(sensorFile, 'utf8', function (error, data) {
    var tension = Math.round((parseFloat(data)/4096)*1800*2);
    socket.emit("sensor", tension);
    setTimeout(function() {
      readSensor(socket);
    }, 100);
  });
}
