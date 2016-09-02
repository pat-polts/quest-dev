//================================================
//# App configs
//================================================

var quest = angular.module('questApp', ['ngRoute', 'ngMaterial','ngCookies']);


quest.config(function ($routeProvider,$locationProvider,$cookiesProvider) {

  var expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 1);

  $cookiesProvider.defaults = {expires: expireDate, secure: true};
  // $cookiesProvider.defaults.expires = expireDate;
  // $cookiesProvider.defaults.secure  = true;
  
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
