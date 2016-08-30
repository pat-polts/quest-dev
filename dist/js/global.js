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
      access: {restricted: false}
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
quest.factory('BoardService', ['$rootScope', '$timeout', '$http', 
  function($rootScope, $timeout, $http){

    var score  = 0;
    var houses = {
          0: {
            'score' : '10',
            'question' : '',
            'answer' : '',
            'special' : false
          },
          1: {
            'score' : '10',
            'question' : '',
            'answer' : '',
            'special' : false
          }
    };
    var game   = {};

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
  A definir diretivas html
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

})

/**************************
  Nova diretiva
***************************/
// quest.directive('profile', function($timeout, $window){});

// quest.directive('specials', function($timeout, $window){});

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


    console.log(BoardService.getHouses());
    console.log("Total de pontos: " + $rootScope.score);

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