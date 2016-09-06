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
      $rootScope.isLoading = true;
        $http.get('/api/user')
        .then(function success(res){ 
            if(res.data.user){
              $rootScope.isLoading = false;
              var user = res.data.user;

              $rootScope.userData.userName       = user.Nome;
              $rootScope.userData.userScore      = user.Pontuacao + 'pts';
              return userApi.setActiveHouse(user.UltimaPerguntaRespondida); 

            }
           
        }, function error(res){
          if(res.data.error){
            $rootScope.error = true; 
            $rootScope.errorMessage = res.data.error;  
          }
        }); 
    };

    userApi.setActiveHouse = function(data){
      $rootScope.activeHouse = data; 
      // $rootScope.$apply();
      return $rootScope.acttiveHouse;
    };

    userApi.getActiveHouse = function(){ 
      return $rootScope.acttiveHouse;
    };

    $rootScope.$watch('activeHouse', function(){
      // console.log($rootScope.activeHouse);
    }); 
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
          
        .success(function(res){ 
          deferred.resolve();
        })
        .error(function() {
          $rootScope.error = true; 
          $rootScope.errorMessage = "Efetue login";   
          deferred.reject();
          return $location.path('/login');
        }); 

          return deferred.promise;

      };

      userAuth.logout = function(){ 
        $http.get('/auth/logout')
          .then(function success(res){ 
            $rootScope.isLoading = false;  
            if(!res.data.logged){

              return $location.path('/login');
            }
          }, function error(res){  
             console.log("erro ao deslogar");
          });      

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
    $rootScope.activeHouse = ApiService.getActiveHouse();

    var game   = {}; 
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

    game.getActiveHouse = function(){ 
      return $rootScope.activeHouse;
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
quest.directive('board', ['$rootScope','$http', 'BoardService', 'ApiService',  function($rootScope, $http, BoardService, ApiService){
    return{
      restrict: 'EAC',
      replace: true,
      scope: {
        score: '=score',
        boardData: '=boardData'
      },
      template: '<canvas id="game" width="1024" height="768" set-height ng-model="activeHouse"></canvas>',
      link: function(scope, element, attribute){
            // console.log(element);
        var w, h, px, py, loader, manifest, board, house, eHouse,shape, score, profile, activeHouse, question;
        drawBoard();
        // var questions = BoardService.getQuestion();  
        function drawBoard(){
          if (scope.stage) {
              scope.stage.autoClear = true;
              scope.stage.removeAllChildren();
              scope.stage.update();
          } else {
              scope.stage = new createjs.Stage(element[0]);
          }
          activeHouse = "";
          // score       = scope.userData.userScore;
          w           = scope.stage.canvas.width;
          h           = scope.stage.canvas.height;

          manifest = [
            {src: "current-marker.png", id: "currentMarker"},
            {src: "house-marker.png", id: "marker"},
            {src: "board.png", id: "board"}
          ];
          loader = new createjs.LoadQueue(false);
          loader.addEventListener("complete", handleComplete);
          loader.loadManifest(manifest, true, "/dist/assets/");
        }
        function createPaths(obj){
          var item = [];
          var indice = 0; 
          var markerStartX = 60;
          var markerStartY = 210;
          var total = Object.keys(obj).length;

          for (var i = 0; i < total; i++) {
              item[i] =  new createjs.Shape();
              item[i].x =  markerStartX;
              item[i].y = markerStartY;
          }

          return item
        }
        function handleComplete(){

          var imgMarker    = loader.getResult("marker");
          var imgMarkerMask    = loader.getResult("currentMarker");
          var markerStartX = 60;
          var markerStartY = 210;
          var markerX      = markerStartX * 5;
          var boardPath    = BoardService.getBoard();
          var boardData    = BoardService.getBoardData();
          var total        = boardPath.length;
          var markerArr    = [];

          var curves = Math.floor(w / 3);
          var seq1 = Math.floor(curves / 6);
          var seq2 = Math.floor(curves / 7);

          //tabuleiro
          board = new createjs.Shape();
          board.graphics.beginBitmapFill(loader.getResult("board")).drawRect(0, 0, w, h);
          scope.stage.addChild(board); 
          // console.log(seq1);
            var x1         =  seq1;
            var x2         =  seq2;
            var y1         = markerStartY;
            var y2         = markerStartY + 40;
            var special    = false; 
            var current    = getCurrent();
        
             

            for (var i = 1; i < 32; i++) { 

              if(i < 7){ 
                 createMarker(current,1,i,special);

              }else if(i > 6 && i < 13){  
                if(i === 12){
                  special = true;
                }else{
                  special = false;
                }
                 
                 createMarker(current,2,i,special); 
                             
              }else if(i > 13 && i < 20){
                special = false;
                 createMarker(current,3,i,special); 
                
              }else if(i > 19 && i < 22){    
                special = false;
                 createMarker(current,4,i,special);     

              
              }else if(i > 22 && i < 29){   
                if(i === 23 || i === 27){
                  special = true;
                } else{
                  special = false;   
                }
                 createMarker(current,5,i,special);  

              } else{
                if(i > 28 && i < 33){

                  special = false; 
                 createMarker(current,6,i,special); 
                } 

              }

            }
             
           createjs.Ticker.timingMode = createjs.Ticker.RAF;
           createjs.Ticker.addEventListener("tick", tick);
            loadQuestion(current);
            // BoardService.getQuestion();
            // console.log(scope.boardData);
        
        }
        function getCurrent(){
          console.log(BoardService.getActiveHouse());
          console.log($rootScope.activeHouse);
          console.log(":: "+ApiService.getActiveHouse());
          // console.log(activeHouse);
          return 5;
        }
        function createMarker(current,lines,index,special){
          var offsetx     = (w / 3);
          var offsety     = Math.round(h / 3);
          var color       = "white";
          var circle      = new createjs.Shape();
          var currentMark = loader.getResult("currentMarker");
          var marker      = new createjs.Shape(); 

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
 // console.log(y);
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
          
          scope.stage.addChild(circle);  


          if(current === index){

            marker.graphics.beginFill("#e8a612").drawRoundRect(0,0,31,45,17);
            marker.x = circle.x - 16;
            marker.y = circle.y - 20;
            scope.stage.addChild(marker); 
          }
          
        }
//************************************
//  carrega a pegunta
//************************************
        function loadQuestion(q){ 
          $http.get('/api/question/'+q)
            .then(function success(res){ 
              if(res.data.question){
                // console.log(res.data.question);
                $rootScope.isQuestion = true;  
                $rootScope.questionData = res.data.question;   
                // $rootScope.$apply();  
              }
            }, function error(res){ 
                console.log("erro ao obter pergunta");
            }); 

            // 
        }
//************************************
//  handle clique na casa
//************************************
        function handleMarkClick(){
          var house     = this;
          var houseName = house.name;
          var alert     = new createjs.Shape();
          var next      = houseName + 1;
          var prev      = houseName - 1;
          var question  = scope.boardData.questions.data;

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
          var alert = new createjs.Shape(); 
            alert.graphics.beginFill("#fff").drawRoundRect(0,0, 500, 180, 10);
            txt = new createjs.Text("Responda a "+house+"° pergunta para prosseguir!", "22px Arial", "#c00");
            alert.x = 300;
            alert.y = 300;
            txt.x   = 350;
            txt.y   = 350;
            alert.on('click',function(event) {
              scope.stage.removeChild(alert, txt);
              moveMarker(next);
            });
            scope.stage.addChild(alert,txt);
        }
//************************************
//  move marcador
//************************************
        function moveMarker(){
          // var house = circle.index;
          // var hx = house.x;
          // var hy = house.y;
          // var mx = marker.x;
          // var my = marker.y;
          // createjs.TweenJS.get(marker).to({x:mx}, 1000).to({x:hx}, 0).call(onAnimationComplete);
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


quest.directive('question', ['$rootScope','BoardService',  function($rootScope, BoardService){
  return{
      templateUrl: '../../views/templates/question_copy.html',
      scope: {
        questionData: '=questionData'
      },
      link: function(scope, element, attribute){
        var question = scope.questionData;
        console.log(question);
        scope.id     = question.Numero;
        scope.title    = question.Titulo;
        scope.desc     = question.Descricao;
        scope.score    = question.ValorPontuacao;
        scope.answered = question.Respondida;
        scope.options  = question.Alternativas; 
        scope.correct  = question.ValorAlternativaCorreta; 

        scope.selectOption = function(){
          var resposta = this;
          var valor = element;
          console.log(element.$$hashKey);
          scope.answered = true;
        }
        scope.close = function(){
          $rootScope.isQuestion = false;
        }
      }

  }
}]); 

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

    $rootScope.activeHouse = ApiService.getActiveHouse();
    $rootScope.answer        = 0;
    $rootScope.correctAnswer = 0;
    $rootScope.isQuestion = false;  
    $rootScope.questionData = {};


    $rootScope.userData      = {}; 

    $rootScope.userGetData = function(){
      return ApiService.getUserData();
    };

    $rootScope.go = function (route) {
      $location.path(route);
    };
 
    $rootScope.$watch('activeHouse', function(){
      // console.log($rootScope.activeHouse);
    }); 
    $rootScope.$watch('isQuestion'); 

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