angular.module('starter.controllers', [])

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

.controller('notificationsCtrl', function($scope, $state, $http) {
  $scope.notifications= [];
  
   //Função do clique (tela de edição)
  $scope.toNotification= function(title){
    $state.go('app.notification',{'title':title});
  };
  //Função do clique ( tela de edição)

      //Carriots
    var Carriots = (function() {
      var defaultOptions = {
        apiKey: '797d069957c5c46cc0fc78c73565d07f51d6391cf3e5863f4ba4156de05c543e', //Atualizada
        apiUrl: 'http://api.carriots.com/'
      };

      //Get Data
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

      //Send Data
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
    $scope.deviceId='campainha@gtperegrino.gtperegrino';
    $scope.jsonData=JSON.stringify({
      sort: 'at',
      order: -1
    });
    
    //Função que busca as notificações
    $scope.getData = function(){
      Carriots.get($scope.deviceId, $scope.jsonData)
      .success(function(res){
          console.log(res);
          console.log($scope.notifications); //Mostra o Array 
          if(res.result){
            $scope.notifications = res.result.reverse(); //Ordena o array
          } 
      });
    };

    setInterval($scope.getData, 3000); //Tempo de refresh das notificações
    //$scope.getData();

    $scope.clearNotifications = function(){
        Carriots.clear($scope.deviceId);
        $scope.notifications = [];
    }


})

.controller('notificationCtrl', function($scope, $stateParams) {
});
