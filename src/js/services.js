//================================================
//# App Factories
//================================================

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
          .then(function success(res){ 
            $rootScope.isLoading = false;  

             if(res.status === 200){

                deferred.resolve();
                return deferred.promise;

              }else if(res.status === 500){

                deferred.reject();
                return deferred.promise;

              }else{

                deferred.reject();
                return deferred.promise;
              }

            
          }, function error(res){ 
             deferred.reject();
             return deferred.promise;
          });     

          return deferred.promise;

      };

      userAuth.logout = function(){ 
        // $http.get('/auth/logout')
        //   .then(function success(res){ 
        //     $rootScope.isLoading = false;  
        //     if(!res.data.logged){

        //       return $location.path('/login');
        //     }
        //   }, function error(res){  
        //      console.log("erro ao deslogar");
        //   });      

      };
 
 
 
    return userAuth;

}]); //AuthService ends

/*********************
  BoardService
**********************/
quest.factory('BoardService', ['$rootScope', '$q', '$timeout', '$http', '$cookies', 
  function($rootScope, $q, $timeout, $http,$cookies){
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
    var boardData = {
        "1": {
          "question": "O que faz com que células normais se tornem células de câncer?",
          "options": {
              "a": "Aumento da apoptose celula",
              "b": "Mutações em células tronco normais ou células progenitoras",
              "c": "Rapidez incontrolada na divisão celular",
              "d": "Envelhecimento celular",
          },
          "correctAnswer": "b",
          "answer": "",
          "isActive": true,
          "score": 10,
          "special": false, 
          "x": 0,
          "y": 0
        },
        "2": {
          "question": "O que faz com que células normais se tornem células de câncer?",
          "options": {
              "a": "Aumento da apoptose celula",
              "b": "Mutações em células tronco normais ou células progenitoras",
              "c": "Rapidez incontrolada na divisão celular",
              "d": "Envelhecimento celular",
          },
          "correctAnswer": "b",
          "answer": "",
          "isActive": false,
          "score": 10,
          "special": false, 
          "x": 0,
          "y": 0
        },
        "3": {
          "question": "O que faz com que células normais se tornem células de câncer?",
          "options": {
              "a": "Aumento da apoptose celula",
              "b": "Mutações em células tronco normais ou células progenitoras",
              "c": "Rapidez incontrolada na divisão celular",
              "d": "Envelhecimento celular",
          },
          "correctAnswer": "b",
          "answer": "",
          "isActive": false,
          "score": 10,
          "special": false, 
          "x": 0,
          "y": 0
        },
        "4": {
          "question": "O que faz com que células normais se tornem células de câncer?",
          "options": {
              "a": "Aumento da apoptose celula",
              "b": "Mutações em células tronco normais ou células progenitoras",
              "c": "Rapidez incontrolada na divisão celular",
              "d": "Envelhecimento celular",
          },
          "correctAnswer": "b",
          "answer": "",
          "isActive": false,
          "score": 10,
          "special": false, 
          "x": 0,
          "y": 0
        },
        "5": {
          "question": "O que faz com que células normais se tornem células de câncer?",
          "options": {
              "a": "Aumento da apoptose celula",
              "b": "Mutações em células tronco normais ou células progenitoras",
              "c": "Rapidez incontrolada na divisão celular",
              "d": "Envelhecimento celular",
          },
          "correctAnswer": "b",
          "answer": "",
          "isActive": false,
          "score": 10,
          "special": false, 
          "x": 0,
          "y": 0
        },
        "6": {
          "question": "O que faz com que células normais se tornem células de câncer?",
          "options": {
              "a": "Aumento da apoptose celula",
              "b": "Mutações em células tronco normais ou células progenitoras",
              "c": "Rapidez incontrolada na divisão celular",
              "d": "Envelhecimento celular",
          },
          "correctAnswer": "b",
          "answer": "",
          "isActive": false,
          "score": 10,
          "special": false, 
          "x": 0,
          "y": 0
        },
        "7": {
          "question": "O que faz com que células normais se tornem células de câncer?",
          "options": {
              "a": "Aumento da apoptose celula",
              "b": "Mutações em células tronco normais ou células progenitoras",
              "c": "Rapidez incontrolada na divisão celular",
              "d": "Envelhecimento celular",
          },
          "correctAnswer": "b",
          "answer": "",
          "isActive": false,
          "score": 10,
          "special": false, 
          "x": 0,
          "y": 0
        },
        "8": {
          "question": "O que faz com que células normais se tornem células de câncer?",
          "options": {
              "a": "Aumento da apoptose celula",
              "b": "Mutações em células tronco normais ou células progenitoras",
              "c": "Rapidez incontrolada na divisão celular",
              "d": "Envelhecimento celular",
          },
          "correctAnswer": "b",
          "answer": "",
          "isActive": false,
          "score": 10,
          "special": false, 
          "x": 0,
          "y": 0
        },
        "9": {
          "question": "O que faz com que células normais se tornem células de câncer?",
          "options": {
              "a": "Aumento da apoptose celula",
              "b": "Mutações em células tronco normais ou células progenitoras",
              "c": "Rapidez incontrolada na divisão celular",
              "d": "Envelhecimento celular",
          },
          "correctAnswer": "b",
          "answer": "",
          "isActive": false,
          "score": 10,
          "special": false, 
          "x": 0,
          "y": 0
        },
        "10": {
          "question": "O que faz com que células normais se tornem células de câncer?",
          "options": {
              "a": "Aumento da apoptose celula",
              "b": "Mutações em células tronco normais ou células progenitoras",
              "c": "Rapidez incontrolada na divisão celular",
              "d": "Envelhecimento celular",
          },
          "correctAnswer": "b",
          "answer": "",
          "isActive": false,
          "score": 10,
          "special": false, 
          "x": 0,
          "y": 0
        },
        "11": {
          "question": "O que faz com que células normais se tornem células de câncer?",
          "options": {
              "a": "Aumento da apoptose celula",
              "b": "Mutações em células tronco normais ou células progenitoras",
              "c": "Rapidez incontrolada na divisão celular",
              "d": "Envelhecimento celular",
          },
          "correctAnswer": "b",
          "answer": "",
          "isActive": false,
          "score": 10,
          "special": false, 
          "x": 0,
          "y": 0
        }
    };

    var game   = {}; 
    game.getQuestion = function(){ 
          // $http.get('/api/question')
          // .then(function successCallback(response) {
          //     console.log($cookies);
          //     $http.get(response.api)
          //       .then(function successCallback(res) {
          //           $rootScope.isLoading = false;

          //           if(res.status === 200){
 
          //               console.log(res);
          //           }

          //         }, function errorCallback(res) {
          //           if(res.status === 500){
          //             console.log("erro ao pegar questao");
          //           }else{
          //             console.log("erro desconhecido");
          //           }
          //         });

          //   }, function errorCallback(response) {
          //     console.log(response);
          //   });
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