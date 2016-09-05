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
        $http.get('/auth/login')
        .then(function success(res){ 
          loginApi = res.data.api;

            $http.post(res.data.api, credentials)

              .then(function successCallback(res) {
                  $rootScope.isLoading = false;

                  if(res.status === 200){

                    var token = res.data;
                    var userData = $cookies.get('udt');
                    $cookies.putObject("udt", token, {secure: true, expires: exp});
                      
                  }

                }, function errorCallback(res) {
                  if(res.status === 500){
                    console.log("usuario/senha incorreto");
                  }else{
                    console.log("erro desconhecido");
                  }
                });

        }, function error(res){
          $rootScope.error = true; 
          $rootScope.errorMessage = "Erro inesperado!";  
        });       

      }; 

      userAuth.logged = function(){ 
        var userData = $cookies.getObject('udt');
        console.log(userData);
        if(userData){
          return true;
        }else{
          return false;
        }
      };

      userAuth.logout = function(){
         var deferred = $q.defer(); 
        $http.get('/auth/logout')
        .success(function(response, status){  
          if(response.logout){
              deferred.resolve();
          }else{
            deferred.reject();
          }
        })
        .error(function() {     
          deferred.reject(); 
        }); 

        return deferred.promise;

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
        "casa1": {
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
        "casa2": {
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
        "casa3": {
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
        "casa4": {
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
        "casa5": {
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
        "casa6": {
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
        "casa7": {
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
        "casa8": {
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
        "casa9": {
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
        "casa10": {
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
        "casa11": {
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
console.log($cookies.getObject('udt'));
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