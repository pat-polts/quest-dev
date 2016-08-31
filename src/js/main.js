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
