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
    .when('/jogar', {
      templateUrl: '../../views/game.html',
      restricted: true
    }) 
    .otherwise({
      redirectTo: '/' 
    });
});

quest.run(function ($rootScope, $location, $route, AuthService) { 
$rootScope.$on('$routeChangeStart', function (next, current) {
      if(next && next.$$route && next.$$route.restricted){
        if(!AuthService.logged()){ 
         $location.path('/login'); 
        } 
      }
  });
$rootScope.$on('$stateChangeStart',function (next, current) { 
        if(next && next.$$route && next.$$route.restricted){      
          if(!AuthService.logged()){ 
            console.log(next);
           $location.path('/login'); 
          } 
      }
});
 
});
