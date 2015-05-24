angular.module('starter.controllers', [])

//Código do template
.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})
//Código do template

.controller('notificationsCtrl', function($scope, $state, $http, $cordovaVibration) {
 
  //Notifications array
  $scope.notifications= [];

   //Edit function
  $scope.toNotification= function(title){
    $state.go('app.notification',{'title':title});
  };

    //Carriots
    var Carriots = (function() {
      var defaultOptions = {
        apiKey: '042dc072a5a074ed4fea90beebcf427fd370875b7436bca6fbe93c85a8b64ce6', //Atualizada
        apiUrl: 'http://api.carriots.com/'
      };

      //Data acquisition (Get)
      function get(deviceId, options) {
        if (!deviceId) throw new Error('Device ID is not defined');

        return($http({
          method: 'GET',
          url: defaultOptions.apiUrl + 'devices/' + deviceId + '/streams/',
          data: options,
          headers: {
            'carriots.apiKey': defaultOptions.apiKey
          }
        }));
      }

      //Data sending (Send)
      function send(options) {
        return($http({
          url: defaultOptions.apiUrl + 'streams/',
          method: 'POST',
          data: options,
          headers: {
            'carriots.apiKey': defaultOptions.apiKey,
            'Content-Type': 'text/plain; charset=utf-8'
          },
        }));
      }

      //Function used to clear notifications
      function clearNotifications(deviceId,options){
        return($http({
          url: defaultOptions.apiUrl + 'devices/' + deviceId + '/streams/',
          method: 'DELETE',
          data: options,
          headers: {
            'carriots.apiKey': defaultOptions.apiKey,
            'Content-Type': 'text/plain; charset=utf-8'
          }
        }));
      }

      return ({
        get: get,
        send: send,
        clear: clearNotifications
      });
    }());
    //Carriots End

    //Variables (Default values)
    $scope.deviceId='defaultDevice@pedrochubert.pedrochubert';
    $scope.jsonData=JSON.stringify({
      sort: 'at',
      order: -1
    });
    
    //Notification fetching
    $scope.getData = function(){
      Carriots.get($scope.deviceId, $scope.jsonData)
      .success(function(res){
          //Print functions
          console.log(res); //Show the complete result in log
          console.log($scope.notifications); //Show the notification in log       

          //Cryptography

          //Cryptography


          //Notification ordering
          if(res.result){ 
            $scope.notifications = res.result.reverse(); 
          } 
          //Notification ordering
          
          //Vibration
          if ($scope.notifications.length > $scope.comparison){
            console.log('Duração da vibração: ', getConfig());
            
            var firstLaunch = sessionStorage.getItem('launched')
            if(!firstLaunch) {
              sessionStorage.setItem('launched', Date.now());
            }else{
              navigator.vibrate(getConfig() || 1000);
            }
          }
          //Comparison + Vibration
          $scope.comparison = $scope.notifications.length;
      });
    };

    //Vibration setting storage
    function saveConfig(){
      localStorage.setItem('duration', duration);
    };

    //Vibration setting access
    function getConfig(){
      return localStorage.getItem('duration');
    };

    $scope.comparison = $scope.notifications.length;

    setInterval($scope.getData, 3000); //Tempo de refresh das notificações
    //$scope.getData();

    //Function that calls the notification deletion
    $scope.clearNotifications = function(){ //
        Carriots.clear($scope.deviceId);
        $scope.notifications = [];
    }


})

.controller('notificationCtrl', function($scope, $stateParams, $state) { 
    $scope.duration = 1000;
   
   //Vibration setting storage
    function saveConfig(){
      localStorage.setItem('duration', $scope.duration);
    };

    //Vibration setting access
    function getConfig(){
      return localStorage.getItem('duration');
    };

    $scope.setSettings = function() {
      saveConfig();
      $state.go('app.notifications');
    }

    $scope.setDuration = function(){
      console.log("Setando duração: ", $scope.duration);
      saveConfig();
    };
});
