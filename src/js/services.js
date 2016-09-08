"use strict";
//================================================
//# App Factories
//================================================

/*********************
  UserService
**********************/

quest.factory('ApiService', ['$rootScope', '$q', '$timeout', '$http', '$location', 'AuthService',
  function ($rootScope, $q, $timeout, $http, $location,AuthService) {

    var userApi = {};

    userApi.getUserData = function(){ 

      var deferred = $q.defer();
      $rootScope.isLoading = true;

      $http.get('/api/user')
        .then(function success(res){ 
            $rootScope.isLoading = false; 
            if(res.status === 200){ 
              if(res.data){ 
                deferred.resolve(res.data.obj);
              }
            } 
           
        }, function error(res){
            if(res.status === 500){
              if(res.data.error){ 
                $rootScope.error = true; 
                $rootScope.errorMessage = res.data.error;  
                deferred.reject(res.data.error);
              }
            }
        });

        return deferred.promise; 
    };
 

    userApi.getQuestionData = function(q){ 

      var deferred = $q.defer();
      $rootScope.isLoading = true;
      if(q){
        $http.get('/api/question/'+q)
          .then(function success(res){ 
              $rootScope.isLoading = false; 
              if(res.status === 200){ 
                if(res.data){ 
                  deferred.resolve(res.data.obj);
                }
              } 
             
          }, function error(res){
              if(res.status === 500){
                if(res.data.error){ 
                  $rootScope.error = true; 
                  $rootScope.errorMessage = res.data.error;  
                  deferred.reject(res.data.error);
                }
              }
          });
      }

      return deferred.promise; 
    };

    userApi.setQuestionData = function(id,last){ 

      var deferred = $q.defer();
      $rootScope.isLoading = true;

      if(id && last){
        $http.get('/api/question/',{numer: id, valor: last})
          .then(function success(res){ 
              $rootScope.isLoading = false; 
              if(res.status === 200){  
                  deferred.resolve(); 
              } 
             
          }, function error(res){
              if(res.status === 500){
                if(res.data.error){ 
                  $rootScope.error = true; 
                  $rootScope.errorMessage = res.data.error;  
                  deferred.reject(res.data.error);
                }
              }
          });
      }

      return deferred.promise; 
    };

    userApi.getRanking = function(){ 

      var deferred = $q.defer();
      $rootScope.isLoading = true;

        $http.get('/api/ranking')
          .then(function success(res){ 
              $rootScope.isLoading = false; 
              if(res.status === 200){  
                  deferred.resolve(); 
              } 
             
          }, function error(res){
              if(res.status === 500){
                if(res.data.error){ 
                  $rootScope.error = true; 
                  $rootScope.errorMessage = res.data.error;  
                  deferred.reject(res.data.error);
                }
              }
          });
      

      return deferred.promise; 
    };
 
    return userApi;
 
}]);

/*********************
  AuthService
**********************/

quest.factory('AuthService', ['$rootScope', '$q', '$timeout', '$http','$cookies', '$location', 
  function ($rootScope, $q, $timeout, $http, $cookies, $location) {

      var user     = null; 
      var userAuth = {}; 
      var hour     = 3600000
      var exp      = new Date(Date.now() + hour);

      userAuth.api = function(){ 
        $http.get('/api')
        .success(function(response, status){ 
          return response.api; 
        })
        .error(function() {
          $rootScope.error = true; 
          $rootScope.errorMessage = "Problemas com a api";   
        }); 
      };


          // console.log(loginApi);

      userAuth.login = function (username, password) {  
 
        var credentials = {Login: username, Senha: password };
        var loginApi;

        $rootScope.isLoading = true;

        $http.post('/auth/login', credentials)
        .then(function success(res){ 
          $rootScope.isLoading = false;  
          
          return  $location.path('/');  

        }, function error(res){
          $rootScope.error = true; 
          $rootScope.errorMessage = "Erro inesperado!";  
        });       
   
      }; 

     userAuth.logged = function(){ 

        var deferred = $q.defer();

        $http.get('/auth/status')
          
        .success(function(res){ 
          deferred.resolve();
        })
        .error(function() {
          $rootScope.error = true; 
          $rootScope.errorMessage = "Efetue login";   
          deferred.reject();
          return $location.path('/login');
        }); 

          return deferred.promise;

      };

      userAuth.logout = function(){ 
        $http.get('/auth/logout')
          .then(function success(res){ 
            $rootScope.isLoading = false;  
            if(!res.data.logged){

              return $location.path('/login');
            }
          }, function error(res){  
             console.log("erro ao deslogar");
          });      

      };
 
 
 
    return userAuth;

}]); //AuthService ends

/*********************
  BoardService
**********************/
quest.factory('BoardService', ['$rootScope', '$q', '$timeout', '$http', 'ApiService', 
  function($rootScope, $q, $timeout, $http, ApiService){
      var deferred = $q.defer();
    var score  = 0;
    var totalHouses = 30;
    var houses = {
          'score' : '10',
          'question' : ['title', 'options', 'correct'],
          'answer' : '',
          'special' : false,
          'x': 0,
          'y':0
    };
    var board = [1,2,3,4,5,6];
    var boardData = {}; 

    var game   = {}; 
    var move = false;

    game.getQuestions = function(){ 
       $http.get('/api/questions')
         .then(function successCallback(res) {
            $rootScope.isLoading = false;

             if(res.status === 200){
 
                boardData.questions = res.data;
             }

         }, function errorCallback(res) {
            if(res.status === 500){
                console.log("erro ao pegar questao");
             }else{
                console.log("erro desconhecido");
             }
         });

         return boardData;
    };
 
    game.getNext = function(){
     return move;
    };
 
    game.loadNext = function(n){
     if(n){
      move = n;
     }
    };

    game.getGameApi = function(){
      return board;
    };

    game.createBoard = function(){
      var props = [];

      for (var i = 0; i < totalHouses; i++) {
        props[i] = houses;
      }

      return props;
    };

    game.getBoard = function(){
      // for (var i = 0; i < 6; i++) {
      //   board.push(i);
      // }
      return board;
    };

    game.getBoardData = function(){
      return boardData;
    };

    game.getHouses = function(){
      return houses;
    };

    game.getScore = function(){
      return score;
    };

    return game;
}]);