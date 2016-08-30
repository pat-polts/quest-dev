//================================================
//# App configs
//================================================

var quest = angular.module('questApp', ['ngRoute', 'ngMaterial']);


quest.config(function ($routeProvider,$locationProvider) {
  $routeProvider.
   when('/', {
      templateUrl: '../../views/saudacoes.html',
      access: {restricted: true}
    })
    .when('/login', {
      templateUrl: '../../views/login.html',
      controller: 'loginController',
      access: {restricted: false}
    })
    .when('/logout', {
      controller: 'logoutController',
      access: {restricted: true}
    })
    .when('/register', {
      templateUrl: '../../views/register.html',
      controller: 'registerController',
      access: {restricted: false}
    })
    .when('/mais-sobre', {
      templateUrl: '../../views/mais-sobre.html',
      access: {restricted: true}
    })
    .when('/vamos-jogar', {
      templateUrl: '../../views/vamos-jogar.html',
      access: {restricted: true}
    })
    .when('/game', {
      templateUrl: '../../views/game.html',
      access: {restricted: true}
    })
    .when('/board', {
      templateUrl: '../../views/game.html',
      access: {restricted: true}
    })
    .otherwise({
      redirectTo: '/'
    });
});
quest.run(function ($rootScope, $location, $route, $http, AuthService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      AuthService.getUserStatus()
      .then(function(){
        if (next.access.restricted && !AuthService.isLoggedIn()){
          $location.path('/login');
          $route.reload();
        }
      });
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

      // send a post request to the server
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
    var board = {
      "casas" : {
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
        },
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
quest.directive('board', function(){
    return{
      restrict: 'EAC',
      replace: true,
      scope: {},
      template: '<canvas id="game" width="1024" height="768" set-height></canvas>',
      link: function(scope,element, attribute){
        var w, h, px, py, loader, manifest, board, house, eHouse;
        drawBoard();

        function drawBoard(){
          if (scope.stage) {
              scope.stage.autoClear = true;
              scope.stage.removeAllChildren();
              scope.stage.update();
          } else {
              scope.stage = new createjs.Stage(element[0]);
          }
          w = scope.stage.canvas.width;
          h = scope.stage.canvas.height;
          manifest = [
            {src: "current-marker.png", id: "eHouse"},
            {src: "house-marker.png", id: "house"},
            {src: "board.png", id: "board"}
          ];
          loader = new createjs.LoadQueue(false);
          loader.addEventListener("complete", handleComplete);
          loader.loadManifest(manifest, true, "/dist/assets/");
        }
        function handleComplete(){
          console.log(w + " " + h);
          board = new createjs.Shape();
          board.graphics.beginBitmapFill(loader.getResult("board")).drawRect(0, 0, w, h);
          house = new createjs.Shape();
          house.graphics.beginFill("white").drawCircle(0, 0, 10);
          house.x =  40;
          house.y = 150;
           scope.stage.addChild(board, house);
           // scope.stage.addEventListener("stagemousedown", handleJumpStart);
           createjs.Ticker.timingMode = createjs.Ticker.RAF;
           createjs.Ticker.addEventListener("tick", tick);
        
        }
        function tick(event){
          scope.stage.update(event);
        }
      }
    }
});

//================================================
//# App Controllers
//================================================

/***********************
  Main
************************/

quest.controller('mainController', ['$rootScope', '$scope', '$location', 'AuthService', 'BoardService',
  function ($rootScope, $scope, $location, AuthService, BoardService) {

    $rootScope.activePage   = $location.path(); 
    $rootScope.userActive   = false;
    $rootScope.question     = false;
    $rootScope.special      = false;
    $rootScope.currentLevel = null;
    $rootScope.currentScore = null;
    $rootScope.levels       = [];
    $rootScope.score        = BoardService.getScore();
    $rootScope.board        = BoardService;

    $rootScope.go = function (route) {
      $location.path(route);
    };


    console.log(BoardService.getGameApi());
    // console.log(BoardService.createBoard());
    // console.log("Total de pontos: " + $rootScope.score);

}]);

/***********************
  Login
************************/

quest.controller('loginController',
  ['$rootScope', '$scope', '$location', 'AuthService',
  function ($rootScope, $scope, $location, AuthService) {

    $rootScope.userActive = false;

    $scope.login = function () {

      // initial values
      $rootScope.error = false;
      $rootScope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
          $location.path('/saudacoes');
          $rootScope.disabled = false;
          $rootScope.userActive = true;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $rootScope.error = true;
          $rootScope.errorMessage = "Invalid username and/or password";
          $rootScope.disabled = false;
          $rootScope.userActive = false;
          $scope.loginForm = {};
        });

    };

}]);

/***********************
  Logout
************************/
quest.controller('logoutController',
  ['$rootScope', '$scope', '$location', 'AuthService',
  function ($rootScope, $scope, $location, AuthService) {

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

    $rootScope.register = function () {

      // initial values
      $rootScope.error = false;
      $rootScope.disabled = true;
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