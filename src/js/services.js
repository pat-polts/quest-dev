"use strict";
//================================================
//# App Factories
//================================================

/*********************
  UserService
**********************/

quest.factory('ApiService', ['$rootScope', '$q', '$timeout', '$http', '$location', 'AuthService',
  function ($rootScope, $q, $timeout, $http, $location, AuthService) {

    var userApi = {};

    userApi.getUserData = function(){ 
      $rootScope.isLoading = true;

      var deferred = $q.defer(); 
      $headers = {"Content-Type": "application/json" };
      $http({method: 'GET', url: '/api/user', headers: $headers})
        .then(function success(res){   
            if(res.status === 200){ 
              if(res.data){ 
                deferred.resolve(res.data.obj);
              }
            } 
           
        }, function error(res){
              /*retorno de erro | string*/ 
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

                  if(!res.data.user){
                     deferred.reject("sessão expirou");
                  }

              if(res.status === 200){ 
                if(res.data){ 
                  deferred.resolve(res.data.obj);
                }
              } 
             
          }, function error(res){
            $rootScope.isLoading = false; 
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

    userApi.getQuestions = function(){ 

      var deferred = $q.defer(); 
     
        $http.get('/api/questions')
          .then(function success(res){  
            console.log(res);
              if(res.status === 200){ 
                if(res.data.obj){ 
                  console.log(res.data.obj);
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

    userApi.setQuestionData = function(id,last){ 

      var deferred = $q.defer();
      $rootScope.isLoading = true;

      if(id && last){
        $http.get('/api/question/',{numero: id, valor: last})
          .then(function success(res){  
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
                  deferred.resolve(res.data.obj); 
              } 
             
          }, function error(res){
            $rootScope.isLoading = false; 
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
        var deferred    = $q.defer();

        var credentials = {login: username, senha: password }; 
        $rootScope.isLoading = true;

        $http.post('/auth/login', credentials)
          .then(function success(res){ 
            $rootScope.isLoading = false;  
            
            if(res.status === 200){
              // console.log(res);
              deferred.resolve(res.data.logged);
            }

          }, function error(res){
            $rootScope.error = true; 
            $rootScope.errorMessage = "Erro inesperado!";  

            if(res.status === 500){
              // console.log(res);
              deferred.reject("nao logado");
            }
          });       

          return deferred.promise;
      }; 

     userAuth.logged = function(){ 

        var deferred = $q.defer();

        $http.get('/auth/status')
        .then(function success(res){ 
          $rootScope.isLoading = false;  
            if(res.status === 200){
            
               deferred.resolve(res.data.logged);
              
            } 
        }, function error(res){
          if(res.data.error){           
            $rootScope.setErro = res.data.error;
            deferred.reject(res.data.error);
          }
        });     

        return deferred.promise;

      };

      userAuth.logout = function(){ 
        var deferred = $q.defer();

        $http.get('/auth/logout')
        .then(function success(res){ 
            $rootScope.isLoading = false;  
              if(res.status === 200){
                 deferred.resolve();
              } 
          }, function error(res){
            if(res.data.error){           
              $rootScope.error = true; 
              $rootScope.errorMessage = res.data.error;  
            }
            deferred.reject();
          }); 

        return deferred.promise;    

      };
 
 
 
    return userAuth;

}]); //AuthService ends

/*********************
  BoardService
**********************/
quest.factory('BoardService', ['$rootScope', '$q', '$timeout', '$http', 'ApiService', 
  function($rootScope, $q, $timeout, $http, ApiService){

    var deferred    = $q.defer();
    var score       = 0;
    var totalHouses = 30;
    var houses = {
          'score' : '10',
          'question' : ['title', 'options', 'correct'],
          'answer' : '',
          'special' : false,
          'x': 0,
          'y':0
    };
    var board     = [1,2,3,4,5,6];
    var boardData = {}; 
    var game      = {}; 
    var move      = false;

    game.getQuestions = function(){ 
      var promise = ApiService.getQuestionData();
        promise.then(function successHandle(data){
            console.log(data);
            $rootScope.boardData.push(data);
         console.log($rootScope.boardData);
        },function successHandle(erro){
            if(erro){
              console.log(erro);
            }
        });
       
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