var express = require('express');
var http = require('http');
var fs = require('fs');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var sensorFile="/sys/devices/platform/omap/tsc/ain5";

var notes = [
  {note: "C4", min: 1800, max: 2900},
  {note: "C4#", min: 1350, max: 1800},
  {note: "D4", min: 1050, max: 1350},
  {note: "D4#", min: 850, max: 1050},
  {note: "E4", min: 720, max: 850},
  {note: "F4", min: 620, max: 720},
  {note: "F4#", min: 570, max: 620},
  {note: "G4", min: 500, max: 570},
  {note: "G4#", min: 450, max: 500},
  {note: "A4", min: 400, max: 450},
  {note: "A4#", min: 370, max: 400},
  {note: "B4", min: 320, max: 370},
  {note: "C5", min: 250, max: 320}
]

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

    note = computeMusic(tension)
    if (note) {
      socket.emit("note", note);
    }

    setTimeout(function() {
      readSensor(socket);
    }, 100);
  });
}

function computeMusic(tension) {
  for (var i=0; i<notes.length; i++) {
    if ((tension>notes[i].min)&&(tension<notes[i].max)) {
      return notes[i].note;
    }
  }
}


