//================================================
//# App configs
//================================================

var quest = angular.module('questApp', ['ngRoute', 'ngMaterial','ngCookies', 'ngDraggable']);


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
    .when('/jogar/especial-2/historia/', {
      templateUrl: '../../views/templates/question-especial-2_historia-2.html',
      restricted: true
    }) 
    .when('/jogar/especial-2/multipla-escolha-1/', {
      templateUrl: '../../views/templates/question-especial-2_multipla-escolha-1.html',
      restricted: true
    }) 
    .when('/jogar/especial-2/multipla-escolha-2/', {
      templateUrl: '../../views/templates/question-especial-2_multipla-escolha-2.html',
      restricted: true
    }) 
    .when('/jogar/desafio/', {
      templateUrl: '../../views/templates/question-desafio.html',
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
