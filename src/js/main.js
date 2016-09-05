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
      controller: 'authController.logout()',
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
quest.run(function ($rootScope, $location, $route, $http, $cookies, AuthService) {
        console.log($cookies.getAll());

  $rootScope.$on('$routeChangeStart',
    function (event, next, current,$rootScope) {
      // $rootScope.isLoading = true; 
      if(next && next.$$route && next.$$route.restricted){
        // console.log($cookies.get('udt'));
          // if(!$cookies.get('udt')){
          //   $location.path('/login'); 
          // }
      }
  });
  $rootScope.$on('$stateChangeStart',
    function (event, next, current) { 
        if(next && next.$$route && next.$$route.restricted){ 
        // console.log($cookies.get('udt'));
           // console.log($cookies.getObject('udt'));
          // if(!$cookies.get('udt')){
          //   $location.path('/login'); 
          // }
      }
  });
});
