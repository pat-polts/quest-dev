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
      controller: 'authController',
      restricted: false
    })
    .when('/logout', {
      controller: 'authController',
      restricted: true,
      resolve: {
        load: function($rootScope, AuthService){
          return AuthService.logout();
        }
      }
      
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
      templateUrl: '../../views/game_copy.html',
      restricted: true
    }) 
    .otherwise({
      redirectTo: '/login' 
    });
});
quest.run(function ($rootScope, $location, $route, $http, $rootScope, AuthService) { 

  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      if(next && next.$$route && next.$$route.restricted){  
          if(!AuthService.logged()){
          event.preventDefault(); 
            $location.path('/login'); 
           } 
      }
  });
  $rootScope.$on('$stateChangeStart',
    function (event, next, current) { 
        if(next && next.$$route && next.$$route.restricted){       
          if(!AuthService.logged()){
          event.preventDefault(); 
             $location.path('/login'); 
           } 
      }
  });
 
});
