"use strict";
//================================================
//# App Controllers
//================================================

/***********************
  Main
************************/

quest.controller('mainController', ['$rootScope', '$scope', '$location', '$cookies', 'AuthService', 'BoardService', 'ApiService',
  function ($rootScope, $scope, $location, $cookies, AuthService, BoardService, ApiService) {

    $rootScope.isLoading = false;
    $rootScope.activePage   = $location.path(); 
    $rootScope.userActive   = false;
    $rootScope.question     = false;
    $rootScope.special      = false;
    $rootScope.currentLevel = null;
    $rootScope.currentScore = null;
    $rootScope.levels       = [];
    $rootScope.score        = BoardService.getScore();
    $rootScope.boardData    = BoardService.getQuestions();

    $rootScope.activeHouse = false;
    $rootScope.activeScore = false;
    $rootScope.answer        = 0;
    $rootScope.correctAnswer = 0;
    $rootScope.isQuestion    = false;  
    $rootScope.questionData  = {};

    //refazendo logica menos bagunçada
    $rootScope.userData      = {}; 
     $rootScope.userScore;
     $rootScope.userName;
     $rootScope.userLastQ;
     $rootScope.moveMarker = 0;

    $rootScope.loadNextQuestion = function(next){
     $rootScope.moveMarker = next; 
     return $rootScope.moveMarker;
    };

    $rootScope.userGetData = function(){
      // return ApiService.getUserData();
    };

    $rootScope.go = function (route) {
      $location.path(route);
    };

    $rootScope.loadUserData = function(){
       var promise = ApiService.getUserData();
        promise.then(function resolveHandler(user){ 
          $rootScope.userName  = user.name;
          $rootScope.userScore = parseInt(user.score);
          $rootScope.userLastQ = parseInt(user.lastQ); 

        }, function rejectHandler(error){ 
          $rootScope.error = true;
          $rootScope.errorMessage = error;
        }); 

    }; 

    $rootScope.loadQuestionData = function(data){
       var promise = ApiService.getQuestionData(data);
        promise.then(function resolveHandler(question){ 
          $rootScope.questionData  = question; 
          // console.log(question);

        }, function rejectHandler(error){ 
          $rootScope.error = true;
          $rootScope.errorMessage = error;
        }); 

    };

    $rootScope.writeQuestionData = function(num,last){

      if(num && last){

       var promise = ApiService.setQuestionData(num,last);
        promise.then(function resolveHandler(){ 
          return true;

        }, function rejectHandler(error){ 
          $rootScope.error = true;
          $rootScope.errorMessage = error;
        }); 

      }

    };  

    //assistinda valores 
    $rootScope.$watch('moveMarker'); 
    $rootScope.$watch('isQuestion'); 
    $rootScope.$watch('userLastQ', function(value){
      return $rootScope.userLastQ;
    }); 
    $rootScope.$watch('userScore');  

}]);

/***********************
  Login
************************/

quest.controller('authController',
  ['$rootScope', '$scope', '$location', '$http','$cookies', 'AuthService',
  function ($rootScope, $scope, $location, $http, $cookies, AuthService) {

    $rootScope.isLoading  = false;
    $rootScope.userActive = null; 
 

    $rootScope.checkFields = function(){
      if($scope.loginForm.username && $scope.loginForm.password){
        return true;
      }else{
        return false;
      }
    };
   
    $rootScope.login = function () {

      // initial values
      $rootScope.error    = false;
      $rootScope.disabled = true; 
      // $rootScope.isLoading = true;

      if($rootScope.checkFields()){
         
       var promisse =  AuthService.login($scope.loginForm.username, $scope.loginForm.password);
          promisse.then(function success(logged){
            if(logged){
              $location.path('/');
            }
          }, function error(){
              $rootScope.error = true;
              $rootScope.errorMessage = res.data.error;
          });

      }else{
        $rootScope.error = true;
        $rootScope.errorMessage = "Preencha os campos para prosseguir"; 
      }

    };  


    $rootScope.logged = function(){
      AuthService.logged();
    };


}]);

/***********************
  Logout
************************/
quest.controller('logoutController',
  ['$rootScope', '$scope', '$location', 'AuthService',
  function ($rootScope, $scope, $location, AuthService) {
    $rootScope.isLoading = false;

    $rootScope.logout = function () {

      // call logout from service
      // AuthService.logout()
      //   .then(function () {
      //     $rootScope.userActive = false;
      //     $location.path('/login');
      //   });

    };

}]);

/***********************
  Register
************************/

quest.controller('registerController',
  ['$rootScope', '$scope', '$location', 'AuthService',
  function ($rootScope, $scope, $location, AuthService) {
    $rootScope.isLoading = false;

    $rootScope.register = function () {

      // initial values
      $rootScope.error = false;
      $rootScope.disabled = false;
      $rootScope.userActive = false;

      // // call register from service
      // AuthService.register($scope.registerForm.username, $scope.registerForm.password)
      //   // handle success
      //   .then(function () {
      //     $location.path('/login');
      //     $rootScope.disabled = false;
      //     $scope.registerForm = {};
      //   })
      //   // handle error
      //   .catch(function () {
      //     $rootScope.error = true;
      //     $rootScope.errorMessage = "Something went wrong!";
      //     $rootScope.disabled = false;
      //     $scope.registerForm = {};
      //   });

    };

}]);