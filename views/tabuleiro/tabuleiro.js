// 'use strict';

// angular.module('questApp', ['ngRoute','ngCookies'])
//     .config(['$routeProvider', function($routeProvider) {
//         $routeProvider.when('/tabuleiro', {
//             templateUrl: 'tabuleiro/tabuleiro.html',
//             controller: 'TabuleiroCtrl'
//         });
//     }])
//     .controller('TabuleiroCtrl', function($scope,$cookieStore,Question) {
//         $scope.user = $cookieStore.get('user');
//         if($cookieStore.get('progresso')) {
//             for(var i =1; i <= $cookieStore.get('progresso'); i++) {
//                 var casa = document.getElementById(i);
//                 casa.style.backgroundColor = '#bd9c31';
//                 casa.disabled = true;
//             }
//         }
//         if ( !$cookieStore.get('question[1]')) {
//             Question.query(function (questions) {
//                     console.log("GET questions")
//                     questions.forEach(function (question, index) {
//                         $cookieStore.put('question[' + (index + 1) + ']', question);
//                     })
//                 },
//                 function (errors) {
//                     console.log(errors);
//                 });
//         }

//         $scope.openQuiz = function (questionId) {

//             if($cookieStore.get('progresso') ) {
//                 var posicao = $cookieStore.get('progresso');

//                 if(posicao==(questionId-1)){
//                     location.href="#!/question/"+questionId;
//                 }else{
//                     alert("Voce deve completar a casa  "+(++posicao));

//                 }
//             }else{

//                 location.href="#!/question/"+questionId;
//             }
//         }

//     });