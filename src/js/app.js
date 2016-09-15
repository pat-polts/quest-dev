//================================================
//# App configs
//================================================

var quest = angular.module('questApp', ['ngRoute', 'ngMaterial','ngCookies', 'ngDraggable']);


quest.config(function ($routeProvider,$locationProvider) {
 
  
  $routeProvider.
   when('/', {
      templateUrl: '../../views/saudacoes.html', 
    })
    .when('/login', {
      templateUrl: '../../views/login.html',
      controller: 'authController', 
    })
    .when('/logout', {
      templateUrl: '../../views/login.html',
      controller: 'authController', 
      
    })
    .when('/mais-sobre', {
      templateUrl: '../../views/mais-sobre.html', 
    })
    .when('/vamos-jogar', {
      templateUrl: '../../views/vamos-jogar.html', 
    })
    .when('/jogar', {
      templateUrl: '../../views/game.html', 
    })  
    .when('/jogar/especial-2/historia/', {
      templateUrl: '../../views/templates/question-especial-2_historia-2.html', 
    }) 
    .when('/jogar/especial-2/multipla-escolha-1/', {
      templateUrl: '../../views/templates/question-especial-2_multipla-escolha-1.html', 
    }) 
    .when('/jogar/especial-2/multipla-escolha-2/', {
      templateUrl: '../../views/templates/question-especial-2_multipla-escolha-2.html', 
    }) 
    .when('/jogar/desafio/', {
      templateUrl: '../../views/templates/question-desafio.html', 
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
