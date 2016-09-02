//================================================
//# App configs
//================================================

var quest = angular.module('questApp', ['ngRoute', 'ngMaterial','ngCookies']);


quest.config(function ($routeProvider,$locationProvider) {
  $routeProvider.
   when('/', {
      templateUrl: '../../views/saudacoes.html',
      restricted: true 
    })
    .when('/login', {
      templateUrl: '../../views/login.html',
      controller: 'authController' 
    })
    .when('/logout', {
      controller: 'authController',
      restricted: true 
    })
    .when('/register', {
      templateUrl: '../../views/register.html',
      controller: 'authController',
      restricted: true 
    })
    .when('/mais-sobre', {
      templateUrl: '../../views/mais-sobre.html',
      restricted: true 
    })
    .when('/vamos-jogar', {
      templateUrl: '../../views/vamos-jogar.html',
      restricted: true
    })
    .when('/game', {
      templateUrl: '../../views/game.html',
      restricted: true
    }) 
    .when('/board', {
      templateUrl: '../../views/game.html' 
    })

    .otherwise({
      redirectTo: '/login' 
    });
});
quest.run(function ($rootScope, $location, $route, $http, $cookies) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      // $rootScope.isLoading = true;
      if(next && next.$$route && next.$$route.restricted){
          if(!$cookies.get('usersSession')){
            $location.path('/login'); 
          }
      }
  });
  $rootScope.$on('$stateChangeStart',
    function (event, next, current) {
      // $rootScope.isLoading = true; 
  });
});

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

        $http.post('http://via.events/jogoquest/api/Usuarios/Logar', {Login: username, Senha: password})
          // handle success
          .success(function (data, status) {

              $cookies.put('usersSession', data, {secure: true});
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
    }  

    var getUserStatus = function () {
      return $http.get('/auth/status') 
        .success(function (data) {
          if(data.status){
            user = true;
          } else {
            user = false;
          }
        }) 
        .error(function (data) {
          user = false;
        });
      };

      var login = function (username, password) { 

        // send a post request to the server
        $http.post('http://via.events/jogoquest/api/Usuarios/Logar',
          {Login: username, Senha: password})
          // handle success
          .success(function (data, status) {
            if(status === 200){
              console.log("token: "+data);
            } else {
              console.log(status);
            //  console.log("Usuario ou Senha incorreta" + data);
            }
          })
          // handle error
          .error(function (data) {
            console.log("erro" + data);
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
//================================================
//# App Directives
//================================================

/**************************
  Define altura div
***************************/
quest.directive('setHeight', function($timeout, $window){

  return{
    link: function(scope, element, attrs){

    scope.height = $window.innerHeight + 'px';
    element.css('height',scope.height);
    
    angular.element($window).bind('resize', function(){
          scope.height = $window.innerHeight + 'px';
      element.css('height',scope.height);
          // manuall $digest required as resize event 
          scope.$digest();
       });
    

    }
  }

});
/******************************************
  Define posição e dimensões das perguntas
*******************************************/
quest.directive('setQuestion', function($timeout, $window){

  return{
      link: function(scope, element, attrs){  
        var width, height;
        scope.palco = angular.element(document).find("canvas");
        height = scope.palco[0]['offsetHeight'] - 50;
        width  = scope.palco[0]['offsetWidth'] - 50;

        scope.palcoW = width+"px";
        scope.palcoH = height+"px"; 

        element.css('height',scope.palcoH);
    		element.css('width',scope.palcoW);

    		angular.element($window).bind('resize', function(){
          height = scope.palco[0]['offsetHeight'] - 50;
          width  = scope.palco[0]['offsetWidth'] - 50;
            scope.palcoW = width+"px";
            scope.palcoH = height+"px"; 
          
             element.css('height',scope.palcoH);
    			   element.css('width',scope.palcoW);

    	       scope.$digest();
        });
      }
    }
});

/**************************
  Board
***************************/
quest.directive('board', ['$rootScope','BoardService',  function($rootScope, BoardService){
    return{
      restrict: 'EAC',
      replace: true,
      scope: {
        score: '=score',
        activeHouse: '=activeHouse',
        boardData: '=boardData'
      },
      template: '<canvas id="game" width="1024" height="768" set-height></canvas>',
      link: function(scope, element, attribute){
            // console.log(element);
        var w, h, px, py, loader, manifest, board, house, eHouse,shape, score, profile, activeHouse, question;
        drawBoard();

        function drawBoard(){
          if (scope.stage) {
              scope.stage.autoClear = true;
              scope.stage.removeAllChildren();
              scope.stage.update();
          } else {
              scope.stage = new createjs.Stage(element[0]);
          }
          activeHouse = scope.activeHouse;
          score       = scope.score;
          w           = scope.stage.canvas.width;
          h           = scope.stage.canvas.height;

          manifest = [
            {src: "current-marker.png", id: "currentMarker"},
            {src: "house-marker.png", id: "marker"},
            {src: "board.png", id: "board"}
          ];
          loader = new createjs.LoadQueue(false);
          loader.addEventListener("complete", handleComplete);
          loader.loadManifest(manifest, true, "/dist/assets/");
        }
        function createPaths(obj){
          var item = [];
          var indice = 0; 
          var markerStartX = 60;
          var markerStartY = 210;
          var total = Object.keys(obj).length;

          for (var i = 0; i < total; i++) {
              item[i] =  new createjs.Shape();
              item[i].x =  markerStartX;
              item[i].y = markerStartY;
          }

          return item
        }
        function handleComplete(){

          var imgMarker    = loader.getResult("marker");
          var imgMarkerMask    = loader.getResult("currentMarker");
          var markerStartX = 60;
          var markerStartY = 210;
          var markerX      = markerStartX * 5;
          var boardPath    = BoardService.getBoard();
          var boardData    = BoardService.getBoardData();
          var total        = boardPath.length;
          var markerArr    = [];

          var curves = Math.floor(w / 3);
          var seq1 = Math.floor(curves / 6);
          var seq2 = Math.floor(curves / 7);

          //tabuleiro
          board = new createjs.Shape();
          board.graphics.beginBitmapFill(loader.getResult("board")).drawRect(0, 0, w, h);
          scope.stage.addChild(board); 
          // console.log(seq1);
            var x1 =  seq1;
            var x2 =  seq2;
            var y1 = markerStartY;
            var y2 = markerStartY + 40;
            var special = false;

            for (var i = 1; i < 29; i++) { 

              if(i < 6){ 
                 createMarker(1,1,i,special);

              }else if(i > 6 && i < 12){  
                if(i === 11){
                  special = true;
                }
                 createMarker(1,2,i,special); 
                             
              }else{        

              } 

            }
             
           createjs.Ticker.timingMode = createjs.Ticker.RAF;
           createjs.Ticker.addEventListener("tick", tick);
        
        }
        function createMarker(current,lines,index,special){
          var offsetx     = (w / 3) - (56 * 6);
          var offsety     = Math.round(h / 3) / 6;
          var color       = "white";
          var circle      = new createjs.Shape();
          var currentMark = loader.getResult("currentMarker");
          var marker      = new createjs.Shape(); 

          if(special) color = "#37d349";  
          // console.log(scope.activeHouse);
          // console.log(scope.score);

          switch(lines){
            case 1:
              var x = 56 * (index + 1) + 10;
              var y = 210;
               // console.log(x);
              // 
            break;
            case 2:
            //
              var x = Math.floor(w / 3) + 3;
              if(index === 7){
                var y = 266;
              }else{
                var y = Math.round(offsety) * (index - 1) + 20; 
              }
            break;
            case 3:

            break;
            default:
            //
            break;
          } 

          circle.graphics.beginStroke('#9a9c9e').beginFill(color).drawCircle(0, 0, 12);
          circle.x = x;
          circle.y = y;
          circle.name = "casa"+index; 
          circle.on("click", handleMarkClick);
          
          scope.stage.addChild(circle); 


          if(current === index){

            marker.graphics.beginFill("#e8a612").drawRoundRect(0,0,31,45,17);
            marker.x = circle.x - 16;
            marker.y = circle.y - 20;
            scope.stage.addChild(marker); 
          }
          
          
        }
//************************************
//  carrega a pegunta
//************************************
        function loadQuestion(q){
          $rootScope.isQuestion = true;   
          $rootScope.$apply();
        }
//************************************
//  handle clique na casa
//************************************
        function handleMarkClick(){
          var house     = this;
          var houseName = house.name;
          var alert     = new createjs.Shape();

          // console.log(scope.boardData[houseName].isActive);

          if(scope.boardData[houseName].isActive){
            return loadQuestion(scope.boardData[houseName]);
          }else{
            alert.graphics.beginFill("#fff").drawRoundRect(0,0, 500, 180, 10);
            txt = new createjs.Text("Responda a pergunta para prosseguir!", "22px Arial", "#c00");
            alert.x = 300;
            alert.y = 300;
            txt.x = 350;
            txt.y = 350;
            alert.on('click',function(event) {
              scope.stage.removeChild(alert, txt);
            });
            scope.stage.addChild(alert,txt);
          }
        }
        function tick(event){
          scope.stage.update(event);
        }

        
      }
    }
}]);


quest.directive('question', ['$rootScope','BoardService',  function($rootScope, BoardService){
  return{
      templateUrl: '../../views/templates/question.html',
      link: function(scope, element, attribute){
        scope.question = "teste";
        scope.alternativas = []; 

        scope.close = function(){
          $rootScope.isQuestion = false;
        }
      }

  }
}]); 

//================================================
//# App Controllers
//================================================

/***********************
  Main
************************/

quest.controller('mainController', ['$rootScope', '$scope', '$location', 'AuthService', 'BoardService',
  function ($rootScope, $scope, $location, AuthService, BoardService) {

    $rootScope.isLoading = false;
    $rootScope.activePage   = $location.path(); 
    $rootScope.userActive   = false;
    $rootScope.question     = false;
    $rootScope.special      = false;
    $rootScope.currentLevel = null;
    $rootScope.currentScore = null;
    $rootScope.levels       = [];
    $rootScope.score        = BoardService.getScore();
    $rootScope.boardData    = BoardService.getBoardData();

    $rootScope.activeHouse   = 0;
    $rootScope.score         = 0;
    $rootScope.answer        = 0;
    $rootScope.correctAnswer = 0;
    $rootScope.isQuestion = false; 
<<<<<<< HEAD
    $rootScope.userToken = false; 
=======
>>>>>>> 954673d6b114df46c188b8ff47479af3a637c8d9

    $rootScope.go = function (route) {
      $location.path(route);
    };

<<<<<<< HEAD
    $rootScope.$watch('isQuestion');
=======
    $rootScope.$watch('isQuestion', function(){
      console.log($rootScope.isQuestion);
    });
>>>>>>> 954673d6b114df46c188b8ff47479af3a637c8d9

}]);

/***********************
  Login
************************/

quest.controller('authController',
  ['$rootScope', '$scope', '$location', '$http','$cookies', 'AuthService',
  function ($rootScope, $scope, $location, $http, $cookies, AuthService) {

    $rootScope.isLoading  = false;
    $rootScope.userActive = null;
    $rootScope.userToken  = false; 

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
      $rootScope.disabled = false; 
      // $rootScope.isLoading = true;


      if($rootScope.checkFields()){
        AuthService.login($scope.loginForm.username, $scope.loginForm.password) 
          .then(function () {
            $rootScope.isLoading = false;
            $location.path('/');
            $rootScope.disabled = false;
            $scope.registerForm = {};  
          })
          // handle error
          .catch(function () {
            $rootScope.error = true;
            $rootScope.errorMessage = "Something went wrong!";   
          });
      }else{
        $rootScope.error = true;
        $rootScope.errorMessage = "Preencha os campos para prosseguir";
      }

<<<<<<< HEAD
    };

    $rootScope.isUser = function(){
      if($cookies.get('usersSession')){
        return AuthService.logged();
      }
    };
=======
      // $http.post('/auth/login', {username: req.body.username, password: req.body.password});

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password) 
>>>>>>> 954673d6b114df46c188b8ff47479af3a637c8d9

    $rootScope.logout = function(){
      return AuthService.logout(); 
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