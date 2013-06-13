'use strict';

var myapp = angular.module('Kata', []);

function sensorController($scope, socketService) {
  $scope.tension = 13;
  socketService.on('sensor', function (data) {
    $scope.tension = data;
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
