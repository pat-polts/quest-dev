//================================================
//# App Factories
//================================================

/*********************
  AuthService
**********************/

quest.factory('AuthService', ['$rootScope', '$q', '$timeout', '$http','$cookies', '$location',
  function ($rootScope, $q, $timeout, $http,$cookies, $location) {

      var user     = null;
      // var session = req.session; 
      var token;
      var userAuth = {};


      userAuth.login = function (username, password) {  
      var deferred = $q.defer();
      $rootScope.isLoading = true;

        $http.post('http://via.events/jogoquest/api/Usuarios/Logar', {Login: username, Senha: password})
          // handle success
          .success(function (data, status) {
              $rootScope.isLoading = false;

              $cookies.put('usersSession', data);
              $rootScope.error    = false; 

              $location.path('/');
              deferred.resolve();
            // if(status === 200){
            //   //user logged 
            //   token = data;

            //   $cookies.put('usersSession', token);
            //   $rootScope.error    = false; 
            //   deferred.resolve();

            // }else if(status === 500) {

            //   $rootScope.error = true; 
            //   $rootScope.errorMessage = "Usuario ou login incorretos";  
            //   deferred.reject();

            // } else {
            //   $rootScope.error = true;
            //   $rootScope.errorMessage = "Serviço indisponivel";     
            //   deferred.reject(); 
            // }
          })
          // handle error
          .error(function () {
              $rootScope.error = true;
              $rootScope.errorMessage = "Serviço indisponivel";    
          });
     
        return deferred.promise;

      };

      userAuth.logged = function(){
        if($cookies.get('usersSession')){
          return true; 
        }else{
          return false;

        }
      };

      userAuth.logout = function(){
        $cookies.remove('usersSession');
        $location.path('/login');

      }
 
 
    return userAuth;

}]); //AuthService ends

/*********************
  BoardService
**********************/
quest.factory('BoardService', ['$rootScope', '$q', '$timeout', '$http', 
  function($rootScope, $q, $timeout, $http){
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