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
          if(!AuthService.logged() === true){ 
            $location.path('/login'); 
           } 
      }
  });
  $rootScope.$on('$stateChangeStart',
    function (event, next, current) { 
        if(next && next.$$route && next.$$route.restricted){       
          if(!AuthService.logged()){ 
             $location.path('/login'); 
           } 
      }
  });
 
});

"use strict";
//================================================
//# App Factories
//================================================

/*********************
  UserService
**********************/

quest.factory('ApiService', ['$rootScope', '$q', '$timeout', '$http', '$location', 'AuthService',
  function ($rootScope, $q, $timeout, $http, $location,AuthService) {

    var userApi = {};

    userApi.getUserData = function(){ 

      var deferred = $q.defer();
      $rootScope.isLoading = true;

      $http.get('/api/user')
        .then(function success(res){ 
            $rootScope.isLoading = false; 
            if(res.status === 200){ 
              if(res.data){ 
                deferred.resolve(res.data.obj);
              }
            } 
           
        }, function error(res){
            if(res.status === 500){
              if(res.data.error){ 
                $rootScope.error = true; 
                $rootScope.errorMessage = res.data.error;  
                deferred.reject(res.data.error);
              }
            }
        });

        return deferred.promise; 
    };
 

    userApi.getQuestionData = function(q){ 

      var deferred = $q.defer();
      $rootScope.isLoading = true;
      if(q){
        $http.get('/api/question/'+q)
          .then(function success(res){ 
              $rootScope.isLoading = false; 
              if(res.status === 200){ 
                if(res.data){ 
                  deferred.resolve(res.data.obj);
                }
              } 
             
          }, function error(res){
              if(res.status === 500){
                if(res.data.error){ 
                  $rootScope.error = true; 
                  $rootScope.errorMessage = res.data.error;  
                  deferred.reject(res.data.error);
                }
              }
          });
      }

      return deferred.promise; 
    };

    userApi.setQuestionData = function(id,last){ 

      var deferred = $q.defer();
      $rootScope.isLoading = true;

      if(id && last){
        $http.get('/api/question/',{numer: id, valor: last})
          .then(function success(res){ 
              $rootScope.isLoading = false; 
              if(res.status === 200){  
                  deferred.resolve(); 
              } 
             
          }, function error(res){
              if(res.status === 500){
                if(res.data.error){ 
                  $rootScope.error = true; 
                  $rootScope.errorMessage = res.data.error;  
                  deferred.reject(res.data.error);
                }
              }
          });
      }

      return deferred.promise; 
    };

    userApi.getRanking = function(){ 

      var deferred = $q.defer();
      $rootScope.isLoading = true;

        $http.get('/api/ranking')
          .then(function success(res){ 
              $rootScope.isLoading = false; 
              if(res.status === 200){  
                  deferred.resolve(); 
              } 
             
          }, function error(res){
              if(res.status === 500){
                if(res.data.error){ 
                  $rootScope.error = true; 
                  $rootScope.errorMessage = res.data.error;  
                  deferred.reject(res.data.error);
                }
              }
          });
      

      return deferred.promise; 
    };
 
    return userApi;
 
}]);

/*********************
  AuthService
**********************/

quest.factory('AuthService', ['$rootScope', '$q', '$timeout', '$http','$cookies', '$location', 
  function ($rootScope, $q, $timeout, $http, $cookies, $location) {

      var user     = null; 
      var userAuth = {}; 
      var hour     = 3600000
      var exp      = new Date(Date.now() + hour);

      userAuth.api = function(){ 
        $http.get('/api')
        .success(function(response, status){ 
          return response.api; 
        })
        .error(function() {
          $rootScope.error = true; 
          $rootScope.errorMessage = "Problemas com a api";   
        }); 
      };


          // console.log(loginApi);

      userAuth.login = function (username, password) {  
        preventDefault(e);
        var credentials = {Login: username, Senha: password };
        var loginApi;

        $rootScope.isLoading = true;

        $http.post('/auth/login', credentials)
        .then(function success(res){ 
          $rootScope.isLoading = false;  
          
          return  $location.path('/');  

        }, function error(res){
          $rootScope.error = true; 
          $rootScope.errorMessage = "Erro inesperado!";  
        });       
   
      }; 

     userAuth.logged = function(){ 

        var deferred = $q.defer();

        $http.get('/auth/status')
        .then(function success(res){ 
          $rootScope.isLoading = false;  
            if(res.status === 200){
            
               deferred.resolve(true);
              
            } 
        }, function error(res){
          if(res.data.error){           
            $rootScope.error = true; 
            $rootScope.errorMessage = res.data.error;  
          }
          deferred.reject(false);
        });     

        return deferred.promise;

      };

      userAuth.logout = function(){ 
        var deferred = $q.defer();

        $http.get('/auth/logout')
        .then(function success(res){ 
            $rootScope.isLoading = false;  
              if(res.status === 200){
                 deferred.resolve();
              } 
          }, function error(res){
            if(res.data.error){           
              $rootScope.error = true; 
              $rootScope.errorMessage = res.data.error;  
            }
            deferred.reject();
          }); 

        return deferred.promise;    

      };
 
 
 
    return userAuth;

}]); //AuthService ends

/*********************
  BoardService
**********************/
quest.factory('BoardService', ['$rootScope', '$q', '$timeout', '$http', 'ApiService', 
  function($rootScope, $q, $timeout, $http, ApiService){
      var deferred = $q.defer();
    var score  = 0;
    var totalHouses = 30;
    var houses = {
          'score' : '10',
          'question' : ['title', 'options', 'correct'],
          'answer' : '',
          'special' : false,
          'x': 0,
          'y':0
    };
    var board = [1,2,3,4,5,6];
    var boardData = {}; 

    var game   = {}; 
    var move = false;

    game.getQuestions = function(){ 
       $http.get('/api/questions')
         .then(function successCallback(res) {
            $rootScope.isLoading = false;

             if(res.status === 200){
 
                boardData.questions = res.data;
             }

         }, function errorCallback(res) {
            if(res.status === 500){
                console.log("erro ao pegar questao");
             }else{
                console.log("erro desconhecido");
             }
         });

         return boardData;
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
"use strict";
//================================================
//# App Controllers
//================================================

/***********************
  Main
************************/

quest.controller('mainController', ['$rootScope', '$scope', '$location', '$cookies', 'AuthService', 'BoardService', 'ApiService',
  function ($rootScope, $scope, $location, $cookies, AuthService, BoardService, ApiService) {

    $rootScope.isLoading = false;
    $rootScope.activePage   = $location.path(); 
    $rootScope.userActive   = false;
    $rootScope.question     = false;
    $rootScope.special      = false;
    $rootScope.currentLevel = null;
    $rootScope.currentScore = null;
    $rootScope.levels       = [];
    $rootScope.score        = BoardService.getScore();
    $rootScope.boardData    = BoardService.getQuestions();

    $rootScope.activeHouse = false;
    $rootScope.activeScore = false;
    $rootScope.answer        = 0;
    $rootScope.correctAnswer = 0;
    $rootScope.isQuestion    = false;  
    $rootScope.questionData  = {};

    //refazendo logica menos bagunçada
    $rootScope.userData      = {}; 
     $rootScope.userScore;
     $rootScope.userName;
     $rootScope.userLastQ;
     $rootScope.moveMarker = 0;

    $rootScope.loadNextQuestion = function(next){
     $rootScope.moveMarker = next; 
     return $rootScope.moveMarker;
    };

    $rootScope.userGetData = function(){
      // return ApiService.getUserData();
    };

    $rootScope.go = function (route) {
      $location.path(route);
    };

    $rootScope.loadUserData = function(){
       var promise = ApiService.getUserData();
        promise.then(function resolveHandler(user){ 
          $rootScope.userName  = user.name;
          $rootScope.userScore = parseInt(user.score);
          $rootScope.userLastQ = parseInt(user.lastQ); 

        }, function rejectHandler(error){ 
          $rootScope.error = true;
          $rootScope.errorMessage = error;
        }); 

    }; 

    $rootScope.loadQuestionData = function(data){
       var promise = ApiService.getQuestionData(data);
        promise.then(function resolveHandler(question){ 
          $rootScope.questionData  = question; 
          // console.log(question);

        }, function rejectHandler(error){ 
          $rootScope.error = true;
          $rootScope.errorMessage = error;
        }); 

    };

    $rootScope.writeQuestionData = function(num,last){

      if(num && last){

       var promise = ApiService.setQuestionData(num,last);
        promise.then(function resolveHandler(){ 
          return true;

        }, function rejectHandler(error){ 
          $rootScope.error = true;
          $rootScope.errorMessage = error;
        }); 

      }

    };  

    //assistinda valores 
    $rootScope.$watch('moveMarker'); 
    $rootScope.$watch('isQuestion'); 
    $rootScope.$watch('userLastQ', function(value){
      return $rootScope.userLastQ;
    }); 
    $rootScope.$watch('userScore');  

}]);

/***********************
  Login
************************/

quest.controller('authController',
  ['$rootScope', '$scope', '$location', '$http','$cookies', 'AuthService',
  function ($rootScope, $scope, $location, $http, $cookies, AuthService) {

    $rootScope.isLoading  = false;
    $rootScope.userActive = null; 
 

    $rootScope.checkFields = function(){
      if($scope.loginForm.username && $scope.loginForm.password){
        return true;
      }else{
        return false;
      }
    };

    $rootScope.login = function () {

      // initial values
      $rootScope.error    = false;
      $rootScope.disabled = false; 
      // $rootScope.isLoading = true;

      if($rootScope.checkFields()){

        return AuthService.login($scope.loginForm.username, $scope.loginForm.password);

      }else{
        $rootScope.error = true;
        $rootScope.errorMessage = "Preencha os campos para prosseguir";
      }

    };  


    $rootScope.logged = function(){
      AuthService.logged();
    };


}]);

/***********************
  Logout
************************/
quest.controller('logoutController',
  ['$rootScope', '$scope', '$location', 'AuthService',
  function ($rootScope, $scope, $location, AuthService) {
    $rootScope.isLoading = false;

    $rootScope.logout = function () {

      // call logout from service
      // AuthService.logout()
      //   .then(function () {
      //     $rootScope.userActive = false;
      //     $location.path('/login');
      //   });

    };

}]);

/***********************
  Register
************************/

quest.controller('registerController',
  ['$rootScope', '$scope', '$location', 'AuthService',
  function ($rootScope, $scope, $location, AuthService) {
    $rootScope.isLoading = false;

    $rootScope.register = function () {

      // initial values
      $rootScope.error = false;
      $rootScope.disabled = false;
      $rootScope.userActive = false;

      // // call register from service
      // AuthService.register($scope.registerForm.username, $scope.registerForm.password)
      //   // handle success
      //   .then(function () {
      //     $location.path('/login');
      //     $rootScope.disabled = false;
      //     $scope.registerForm = {};
      //   })
      //   // handle error
      //   .catch(function () {
      //     $rootScope.error = true;
      //     $rootScope.errorMessage = "Something went wrong!";
      //     $rootScope.disabled = false;
      //     $scope.registerForm = {};
      //   });

    };

}]);
//================================================
//# App Directives
//================================================

/**************************
  Define altura div
***************************/
quest.directive('setHeight', function($timeout, $window){

  return{
    link: function(scope, element, attrs){

    scope.height = $window.innerHeight + 'px';
    element.css('height',scope.height);
    
    angular.element($window).bind('resize', function(){
          scope.height = $window.innerHeight + 'px';
      element.css('height',scope.height);
          // manuall $digest required as resize event 
          scope.$digest();
       });

    }
  }

});
/******************************************
  Define posição e dimensões das perguntas
*******************************************/
quest.directive('setQuestion', function($timeout, $window){

  return{
      link: function(scope, element, attrs){  
        var width, height;
        scope.palco = angular.element(document).find("canvas");
        height = scope.palco[0]['offsetHeight'] - 50;
        width  = scope.palco[0]['offsetWidth'] - 50;

        scope.palcoW = width+"px";
        scope.palcoH = height+"px"; 

        element.css('height',scope.palcoH);
    		element.css('width',scope.palcoW);

    		angular.element($window).bind('resize', function(){
          height = scope.palco[0]['offsetHeight'] - 50;
          width  = scope.palco[0]['offsetWidth'] - 50;
            scope.palcoW = width+"px";
            scope.palcoH = height+"px"; 
          
             element.css('height',scope.palcoH);
    			   element.css('width',scope.palcoW);

    	       scope.$digest();
        });
      }
    }
});

/**************************
  Board
***************************/
quest.directive('board', ['$rootScope','$http', 'BoardService', 'AuthService',  function($rootScope, $http, BoardService, AuthService){
    return{
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        score: '=score',
        boardData: '=boardData' 
      },
      controller: ['$scope', function boardController($scope) {
        $scope.moveToNext = function(next){
          console.log(next);
        }
      }],
      template: '<canvas id="game" width="1024" height="768" set-height></canvas>',
      // controller: function(scope, element,attribute){
      //   // $rootScope.moveEl = function(){
      //   //   console.log(1);
      //   // };
      // },
      link: function(scope, element, attribute){
   
        var w, h, px, py, loader, manifest, board, house, eHouse,shape, profile, loadHouse, question,user;
 
        drawBoard();   
        function drawBoard(){
          if (scope.stage) {
              scope.stage.autoClear = true;
              scope.stage.removeAllChildren();
              scope.stage.update();
          } else {
              scope.stage = new createjs.Stage(element[0]);
          }
          // score       = scope.userData.userScore; 
          w           = scope.stage.canvas.width;
          h           = scope.stage.canvas.height;

          manifest = [
            {src: "current-marker.png", id: "currentMarker"},
            {src: "house-marker.png", id: "marker"},
            {src: "board.png", id: "board"}
          ]; 

          loader = new createjs.LoadQueue(false);  
          loader.addEventListener("progress", handleProgress);
          loader.addEventListener("complete", handleComplete);
          loader.loadManifest(manifest, true, "/dist/assets/");
 
        }
        function handleProgress(){
         //on progress, before loading
          

        }
        function handleComplete(){  
          
          board        = new createjs.Shape();
          var alertLoad    = new createjs.Shape();
          var alertLoadTxt = new createjs.Text("Carregando informações", "22px Arial", "#c00");
          var palcoW = w /2;
          var palcoH = h / 2;
          var palcoX = (w / 2) / 2;
          var palcoY = (h / 2) / 2;
          var imgBoard = loader.getResult("board");     

          board.graphics.beginBitmapFill(imgBoard).drawRect(0, 0, 1024, 768); 

          scope.stage.addChild(board);   
 

           setTimeout(function () {  
             boardStart();  
          },4000); 

          

          createjs.Ticker.timingMode = createjs.Ticker.RAF;
          createjs.Ticker.addEventListener("tick", tick);   
        
        }
        function loadingBoard(){

          // scope.stage.addChild(alertLoad, alertLoadTxt);  


        }
        function boardStart(){
        
          var special    = false;  
          var last        =  $rootScope.userLastQ;
          if(last === 17){
            var current = 1;
          }else{
            var current     =  $rootScope.userLastQ + 1;

          }
            
            for (var i = 1; i < 32; i++) { 

              if(i < 7){ 
                 createMarker(1,i,special);

              }else if(i > 6 && i < 13){  
                if(i === 12){
                  special = true;
                }else{
                  special = false;
                }
                 
                 createMarker(2,i,special); 
                             
              }else if(i > 13 && i < 20){
                special = false;
                 createMarker(3,i,special); 
                
              }else if(i > 19 && i < 22){    
                special = false;
                 createMarker(4,i,special);     

              
              }else if(i > 22 && i < 29){   
                if(i === 23 || i === 27){
                  special = true;
                } else{
                  special = false;   
                }
                 createMarker(5,i,special);  

              } else{
                if(i > 28 && i < 33){

                  special = false; 
                 createMarker(6,i,special); 
                } 

              }

            }

             
            $rootScope.$watch('isQuestion',function(value){
              if(value == false){
                moveToNext();
              }
            });

            return loadQuestion(current);
          
        }

        function createMarker(lines,index,special){

          
          var offsetx     = (w / 3);
          var offsety     = Math.round(h / 3);
          var color       = "white";
          var circle      = new createjs.Shape();
          var currentMark = loader.getResult("currentMarker");
          var marker      = new createjs.Shape();  
          var last        =  $rootScope.userLastQ;
          if(last === 17){
            var current     =  1;    
          }else{
            var current     =  $rootScope.userLastQ + 1;
          }
          
         

          var line1x = Math.round(offsetx) /  6;
          var line2y = Math.round(offsety) /  6;

          if(special) color = "#37d349";  

          switch(lines){
            case 1:
              var x = Math.round(line1x) * (index);
              var y = 210;
              
            break;
            case 2:
              var x1 = Math.round(line1x) * 6;
              var x = x1; 
              if(index === 7){
                var y = offsety;  
              }else{
                var y = offsety + ( Math.round(line2y) * (index - 7) ) + index; 
              } 
         
            break;
            case 3:
              var y2 = offsety + ( Math.round(line2y) * 5 ) + 12;
              var y  = y2;
              var x1 = (Math.round(line1x) * 6) + 16;

              if(index === 14){
                  var x =  x1 + (14 * 2);
              }else{
                var x3 = x1 + (14 * 2);
                 var x = x3 + (index * 2) * (index - 14) + index;
              }

            break;
            case 4:
              var x1 = (Math.round(line1x) * 6) + 16;
                var x3 = x1 + (14 * 2);
               if(index === 20){
                  var y =  offsety + ( Math.round(line2y) * (11 - 7) ) + 11;
               }else{
                var y =  offsety + ( Math.round(line2y) * (10 - 7) ) + 10;
               }
                var x = x3 + (19 * 2) * (19 - 14) + 19;

            break;
            case 5:
              var y  =  offsety + ( Math.round(line2y) * (10 - 7) ) + 10;
              var x5 = (Math.round(offsetx * 2)) - 50;

              if(index === 23){
                var x = x5;
              }else{
                var x = x5 + (index * 2) * (index - 23) - 5;
              }
 
            break;
            case 6:
              var x5 = (Math.round(offsetx * 2)) - 50; 
              var y6 = offsety + ( Math.round(line2y) * (11 - 7) ) + 11;
             if(index === 29){
                  var y =  429;

             }else if(index === 30){
                var y =  459;
             }else{
                var y =  489;
             }
              
                var x = x5 + (28 * 2) * (28 - 23) - 5;
 
            break;
            default:
            //
            break;
          } 

          circle.graphics.beginStroke('#9a9c9e').beginFill(color).drawCircle(0, 0, 12);
          circle.x = x;
          circle.y = y;
          circle.name = index; 
          circle.on("click", handleMarkClick);
          circle.on("stagemousemove", handleData);
          
          scope.stage.addChild(circle);   

          if(current === index){
            marker.graphics.beginFill("#e8a612").drawRoundRect(0,0,31,45,17);
            marker.name = current;
            marker.x = circle.x - 16;
            marker.y = circle.y - 20;
            scope.stage.addChild(marker); 
          }

        }
//************************************
//  carrega a pegunta
//************************************
        function moveToNext(){
          var next = BoardService.getNext();
          if(next){
            //console.log(maker.x);
          }
        };
        function loadQuestion(q = ''){ 
      
          if(q){  
           $rootScope.loadQuestionData(q);   
            console.log(1);
            setTimeout(function () { 
            console.log(1);
              $rootScope.isQuestion   = true;  
            },200);  

            // $rootScope.isQuestion = true; 
            // $http.get('/api/question/'+q)
            //   .then(function success(res){ 
            //     if(res.data.question){
            //       $rootScope.isQuestion = true;  
            //       $rootScope.questionData = res.data.question;  
            //     }
            //   }, function error(res){ 
            //       console.log("erro ao obter pergunta");
            //   }); 
          }

        }
        function handleData(){
          // console.log($rootScope.userLastQ);
        }
//************************************
//  handle clique na casa
//************************************
        function handleMarkClick(){ 
          var house     = this;
          var houseName = house.name;
          var alert     = new createjs.Shape();
          var next      = houseName + 1;
          var prev      = $rootScope.userLastQ;
          var question  = scope.boardData.questions;

          if(prev !==0 && !question[prev].Respondida){
            //Ops pulando casas
            return handleWrongHouse(prev);
          }

            if(question[houseName]){
              if(question[houseName].Respondida){
                //proxima casa
                return loadQuestion(question[next]);

              }else{
                //carrega pergunta
                return loadQuestion(question[houseName]);

              }
            }

        }
//************************************
//  handle clique na casa errada
//************************************
        function handleWrongHouse(house){
         alert("Responda a pergunta"+ house+ "antes de prosseguir");
        }
//************************************
//  move marcador
//************************************
        function moveMarker(){
          console.log(1);
         if($rootScope.moveMarker){
          console.log("move")
          return loadQuestion($rootScope.userLasQ);
         }else{
          console.log("no move");
         }
        }

        $rootScope.nextQuestion = function(q){
          return loadQuestion(q);

        }

//************************************
//  carrega info usuario
//************************************
        function loadProfile(){

        }
        function onAnimationComplete(){
          console.log(this);
        }
        function tick(event){ 
          scope.stage.update(event);
        }

        
      }
    }
}]);


quest.directive('question', ['$rootScope', '$http', 'BoardService',  function($rootScope, $http,BoardService){
  return{   
      restrict: 'E',
      transclude: true,
      templateUrl: '../../views/templates/question_copy.html',
      scope: {
        questionData: '=questionData'
      },
      link: function(scope, element, attribute,boardController){
        var question = scope.questionData; 
        var escolha = null;
        if(question){

          scope.id     = question.Numero;
          scope.title    = question.Titulo;
          scope.desc     = question.Descricao;
          scope.score    = question.ValorPontuacao;
          scope.answered = question.Respondida;
          scope.options  = question.Alternativas; 
          scope.correct  = question.ValorAlternativaCorreta; 

          $rootScope.userLastQ = scope.id;
        } 

        scope.selectOption = function(){
          var el       = this; 
          var resposta = el.$index; 
          escolha      = el.alt.Valor;
          // scope.answered = false;
          // if(scope.answered){
          //   alert("Ops! ja respondida, clique em pronto para prosseguir");
          // }else{
              if(escolha === scope.correct){
                scope.choose = escolha;
                scope.answered = true;

                  $rootScope.userScore +=  parseInt(scope.score);
                  // $rootScope.alertWin(userScore);
                  alert("Yep! Resposta certa, você ganhou mais: "+scope.score +"pontos. Seu total atual é de: "+$rootScope.userScore);
              } else{
                  alert("Ounch! Resposta certa seria: "+scope.correct);
              } 

        }


        function loadQuestion(q = ''){ 
    
          if(q){  
           $rootScope.loadQuestionData(q);   

            setTimeout(function () { 
              $rootScope.isQuestion   = true;  
            },500);  

            // $rootScope.isQuestion = true; 
            // $http.get('/api/question/'+q)
            //   .then(function success(res){ 
            //     if(res.data.question){
            //       $rootScope.isQuestion = true;  
            //       $rootScope.questionData = res.data.question;  
            //     }
            //   }, function error(res){ 
            //       console.log("erro ao obter pergunta");
            //   }); 
          }

        }
 
        scope.choose = function(){ 
            $rootScope.isQuestion = false; 
          if(escolha !== ''){   
            // return BoardService.loadNext(next);
           //$rootScope.writeQuestionData(scope.id,$rootScope.userLastQ);
          }else{ 
              alert("Escolha uma das alternativas");
          }
        }
      }

  }
}]); 