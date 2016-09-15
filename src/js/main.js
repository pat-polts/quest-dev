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
      controller: 'logoutController',
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
      redirectTo: '/login' 
    });
});

quest.run(function ($rootScope, $location, $route, $cookies, $q, AuthService) { 
  $rootScope.$on('$routeChangeStart', function (next, current) {
      if(!$cookies.get('logged')){ 
       
         $location.path('/login'); 
       
      }
  });

 
});
