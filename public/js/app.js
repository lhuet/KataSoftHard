'use strict';

var myapp = angular.module('Kata', []);

function sensorController($scope, socketService, synthService) {
  $scope.tension = 13;
  $scope.note="";
  socketService.on('sensor', function (data) {
    $scope.tension = data;
  });
  synthService.on('note', function (data) {
    $scope.note=data;
  });
};

myapp.factory('socketService', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    }
  };
});

myapp.factory('synthService', function ($rootScope) {
  var socket = io.connect();
  var note="";
  var delay = 0;
  var velocity = 127;
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        if (!(args[0]===note)) {
          var noteValueOff = notes[note];
          var noteValueOn = notes[args[0]];
          MIDI.noteOff(0, noteValueOff, delay + 0.75);
          MIDI.noteOn(0, noteValueOn, velocity, delay);
          note = args[0];
        }
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    }
  };
});


window.onload = function () {
  MIDI.loadPlugin({
    soundfontUrl: "./soundfont/",
    instrument: "acoustic_grand_piano",
    callback: function() {
      console.log("Ready to play !");
      MIDI.setVolume(0, 127);
    }
  });
};

var notes = {
  "C4": 60,
  "C4#": 61,
  "D4": 62,
  "D4#": 63,
  "E4": 64,
  "F4": 65,
  "F4#": 66,
  "G4": 67,
  "G4#": 68,
  "A4": 69,
  "A4#": 70,
  "B4": 71,
  "C5": 72
}

