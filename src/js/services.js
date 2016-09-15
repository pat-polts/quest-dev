"use strict";
//================================================
//# App Factories
//================================================


/*********************
  BoardService
**********************/
quest.factory('BoardService', ['$rootScope', '$q', '$timeout', '$http', 'ApiService', 
  function($rootScope, $q, $timeout, $http, ApiService){

    var deferred    = $q.defer();
    var score       = 0;
    var totalHouses = 30;
    var houses = {
          'score' : '10',
          'question' : ['title', 'options', 'correct'],
          'answer' : '',
          'special' : false,
          'x': 0,
          'y':0
    };
    var board     = [1,2,3,4,5,6];
    var boardData = {}; 
    var game      = {}; 
    var move      = false;

    game.getQuestions = function(){ 
      var promise = ApiService.getQuestionData();
        promise.then(function successHandle(data){
            console.log(data);
            $rootScope.boardData.push(data);
         console.log($rootScope.boardData);
        },function successHandle(erro){
            if(erro){
              console.log(erro);
            }
        });
       
    };
 
    game.getNext = function(){
     return move;
    };
 
    game.loadNext = function(n){
     if(n){
      move = n;
     }
    };

    game.getGameApi = function(){
      return board;
    };

    game.createBoard = function(){
      var props = [];

      for (var i = 0; i < totalHouses; i++) {
        props[i] = houses;
      }

      return props;
    };

    game.getBoard = function(){
      // for (var i = 0; i < 6; i++) {
      //   board.push(i);
      // }
      return board;
    };

    game.getBoardData = function(){
      return boardData;
    };

    game.getHouses = function(){
      return houses;
    };

    game.getScore = function(){
      return score;
    };

    return game;
}]);