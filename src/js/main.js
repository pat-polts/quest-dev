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
      redirectTo: '/',
      access: {restricted: true} 
    });
});
quest.run(function ($rootScope, $location, $route, $http, AuthService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      $rootScope.isLoading = true;
      AuthService.getUserStatus()
      .then(function(){
        if (next.access.restricted && !AuthService.isLoggedIn()){
          $location.path('/login');
          $route.reload();
        }
      });
  });
});
