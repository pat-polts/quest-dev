//================================================
//# App configs
//================================================

var quest = angular.module('questApp', ['ngRoute', 'ngMaterial']);


quest.config(function ($routeProvider,$locationProvider) {
  $routeProvider.
   when('/', {
      templateUrl: '../../views/saudacoes.html', 
    })
    .when('/login', {
      templateUrl: '../../views/login.html',
      controller: 'loginController' 
    })
    .when('/logout', {
      controller: 'logoutController' 
    })
    .when('/register', {
      templateUrl: '../../views/register.html',
      controller: 'registerController' 
    })
    .when('/mais-sobre', {
      templateUrl: '../../views/mais-sobre.html' 
    })
    .when('/vamos-jogar', {
      templateUrl: '../../views/vamos-jogar.html' 
    })
    .when('/game', {
      templateUrl: '../../views/game.html' 
    })
    .when('/board', {
      templateUrl: '../../views/game.html' 
    })
    .otherwise({
      redirectTo: '/' 
    });
});
quest.run(function ($rootScope, $location, $route, $http) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      $rootScope.isLoading = true;
  });
});

//================================================
//# App Factories
//================================================

/*********************
  AuthService
**********************/

quest.factory('AuthService', ['$rootScope', '$q', '$timeout', '$http',
  function ($rootScope, $q, $timeout, $http) {
    $rootScope.isLoading = false;
      var user = null;

      var isLoggedIn = function () {
        if(user) {
          return true;
        } else {
          return false;
        }
      };

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

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post('/auth/login',
          {username: username, password: password})
          // handle success
          .success(function (data, status) {
            if(status === 200 && data.status){
              user = true;
              deferred.resolve();
            } else {
              user = false;
              deferred.reject();
            }
          })
          // handle error
          .error(function (data) {
            user = false;
            deferred.reject();
          });
     
        return deferred.promise;

      };

      var logout = function () {
      $rootScope.isLoading = false;

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/auth/logout')
        // handle success
        .success(function (data) {
          user = false;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    };

    var register = function (username, password) { 
      // create a new instance of deferred
      var deferred = $q.defer();

      $http.post('/auth/register',
        {username: username, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    };
 
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register
    });

  }
]); //AuthService ends

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
        "1": {
          "question": "O que faz com que células normais se tornem células de câncer?",
          "options": {
              "a": "Aumento da apoptose celula",
              "b": "Mutações em células tronco normais ou células progenitoras",
              "c": "Rapidez incontrolada na divisão celular",
              "d": "Envelhecimento celular",
          },
          "answer": "b",
          "score": 10,
          "special": false,
          "userChoice": "none",
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
          "answer": "b",
          "score": 10,
          "special": false,
          "userChoice": "none",
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
          "answer": "b",
          "score": 10,
          "special": false,
          "userChoice": "none",
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
          "answer": "b",
          "score": 10,
          "special": false,
          "userChoice": "none",
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
          "answer": "b",
          "score": 10,
          "special": false,
          "userChoice": "none",
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

/**************************
  Board
***************************/
quest.directive('board', ['BoardService',  function(BoardService){
    return{
      restrict: 'EAC',
      replace: true,
      scope: {
        score: '=score',
        activeHouse: '=activeHouse'
      },
      template: '<canvas id="game" width="1024" height="768" set-height></canvas>',
      link: function(scope, element, attribute){
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

            for (var i = 0; i < 29; i++) {

              if(i < 6){ 
                 createMarker(activeHouse,1,i,special);

              }else if(i > 6 && i < 12){  
                if(i === 11){
                  special = true;
                }
                 createMarker(activeHouse,2,i,special); 
                             
              }else{        

              } 

            }

              
           createjs.Ticker.timingMode = createjs.Ticker.RAF;
           createjs.Ticker.addEventListener("tick", tick);
        
        }
        function createMarker(current,lines,index,special){
          var offsetx = (w / 3) - (56 * 6);
          var offsety = Math.round(h / 3) / 6;
          var color   = "white";
          var circle = new createjs.Shape();
          var currentMark = loader.getResult("currentMarker");
          var marker = new createjs.Shape();

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

          circle.graphics.beginFill(color).drawCircle(0, 0, 16);
          circle.x = x;
          circle.y = y;
          circle.name = "casa_"+index; 
          circle.on("click", handleMarkClick);
          
          scope.stage.addChild(circle); 


          if(index === current){

            marker.graphics.beginFill("#e8a612").drawRoundRect(0,0,31,45,17);
            marker.x = circle.x - 16;
            marker.y = circle.y - 20;
            scope.stage.addChild(marker); 
          }
          
          
        }
        function createMarkerSpecial(){
          //
        }
        function handleMarkClick(){
          var house = this;
          console.log(house);
        }
        function tick(event){
          scope.stage.update(event);
        }

        function toggleCache(value) {
          // iterate all the children except the fpsLabel, and set up the cache:
          var l = stage.getNumChildren() - 1;

          for (var i = 0; i < l; i++) {
            var shape = scope.stage.getChildAt(i);
            if (value) {
              shape.cache(-radius, -radius, radius * 2, radius * 2);
            } else {
              shape.uncache();
            }
          }
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
    $rootScope.board        = BoardService;

    $rootScope.activeHouse   = 0;
    $rootScope.score         = 0;
    $rootScope.answer        = 0;
    $rootScope.correctAnswer = 0;

    $rootScope.go = function (route) {
      $location.path(route);
    };


    // console.log(BoardService.getGameApi());
    // console.log(BoardService.createBoard());
    // console.log("Total de pontos: " + $rootScope.score);

}]);

/***********************
  Login
************************/

quest.controller('loginController',
  ['$rootScope', '$scope', '$location', '$http','AuthService',
  function ($rootScope, $scope, $location, $http, AuthService) {
    $rootScope.isLoading = false;

    $rootScope.userActive = false;

    $scope.login = function () {

      // initial values
      $rootScope.error = false;
      $rootScope.disabled = false;

        $http.post('/auth/login', {username: "demo", password: "teste"});

      // call login from service
      // AuthService.login($scope.loginForm.username, $scope.loginForm.password)
      //   // handle success
      //   .then(function () {
      //     $location.path('/saudacoes');
      //     $rootScope.disabled = false;
      //     $rootScope.userActive = true;
      //     $scope.loginForm = {};
      //   })
      //   // handle error
      //   .catch(function () {
      //     $rootScope.error = true;
      //     $rootScope.errorMessage = "Impossivel logar, registre-se";
      //     $rootScope.disabled = false;
      //     $rootScope.userActive = false;
      //     $scope.loginForm = {};
      //   });

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
      AuthService.logout()
        .then(function () {
          $rootScope.userActive = false;
          $location.path('/login');
        });

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

      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/login');
          $rootScope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $rootScope.error = true;
          $rootScope.errorMessage = "Something went wrong!";
          $rootScope.disabled = false;
          $scope.registerForm = {};
        });

    };

}]);