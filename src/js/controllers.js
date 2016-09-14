"use strict";
//================================================
//# App Controllers
//================================================

quest.controller('tabuleiro',
  ['$rootScope', '$location','$q', '$cookies', 'ApiService',
  function ($rootScope, $location, $q, $cookies, ApiService) {
    // $rootScope.activePage     = $location.path(); 
    $rootScope.isLoading      = false;
    $rootScope.isLoadingGame  = false;
    $rootScope.isSpecial1     = false;
    $rootScope.isSpecial2     = false;
    $rootScope.isSpecial3     = false;
    
    $rootScope.userLogged     = null;
    $rootScope.userName       = null;
    $rootScope.userEmail      = null;
    $rootScope.userScore      = 0;
    $rootScope.userLastAnswer = null;
    $rootScope.userQuestions  = [];
    $rootScope.userQuestion   = [];
    
    $rootScope.users          = [];
    $rootScope.optionSelected = false;
    $rootScope.gameRank       = [];
    $rootScope.questionEspecial     = [];


    

        $rootScope.sortElement = function(arr){
          var newEl;
            newEl = arr.sort(function(){
              return 0.3 - Math.random();
          }); 
        };

    $rootScope.setUserCookies = function(name,score,last){ 
      $cookies.putObject('nome', name); 
      $cookies.putObject('pontos', score); 
      $cookies.putObject('ultima', last); 
    };

    $rootScope.loadData = function(){
      var user      = ApiService.getUserData();
      var questions =  ApiService.getQuestions();
      $rootScope.isLoading = true;
      //load user info to user globals
       user.then(function succesHandle(data){
          $rootScope.isLoading  = false;
          $rootScope.userName       = data.name;
          $rootScope.userScore      = data.score;
         
          if(isNaN(data.lastQ)){
            $rootScope.userLastAnswer = 1;
          }else if(data.lastQ == 'E2' || data.lastQ == 'E3' || data.lastQ == 'E4'){
            $rootScope.userLastAnswer = data.lastQ;
          }else{
            $rootScope.userLastAnswer = data.lastQ;

          }
          $rootScope.$apply;

          $rootScope.setUserCookies(data.name,data.score, $rootScope.userLastAnswer);


       },function errorHandler(erro){
          console.log(erro);
          $rootScope.isLoading = false; 
       });
        
      //load user info to user globals
       questions.then(function succesHandle(data){  
          $rootScope.isLoading = true; 

          $rootScope.userQuestions.push(data); 
          $rootScope.isLoading     = false;
          $rootScope.$apply;

         
       },function errorHandler(erro){
          $rootScope.isLoading = false; 
          console.log(erro);
       });



    };


    $rootScope.loadQuestion = function(id){ 

      var question         =  ApiService.getQuestionData(id);
      $rootScope.isLoading = true;
     
      $rootScope.userQuestion = [];
     question.then(function succesHandle(data){
        $rootScope.userQuestion.push(data);  
         if(id == 'E2'){
            $rootScope.isSpecial2 = true; 
            $rootScope.isQuestion = false;
        }
        console.log($rootScope.userQuestion);
        $rootScope.isLoading  = false;
        $rootScope.$apply;

       },function errorHandler(erro){
          $rootScope.isLoading = false; 
          console.log(erro);
       });
         
    };

    $rootScope.loadQuestionE1 = function(){ 
      var question         =  ApiService.getQuestionE1();
      $rootScope.isLoading = true;
      $rootScope.questionEspecial = [];
        question.then(function succesHandle(data){
          $rootScope.questionEspecial.push(data);  
          $rootScope.isLoading  = false;
          $rootScope.isSpecial1    = true;
          $rootScope.$apply;
 

       },function errorHandler(erro){
          $rootScope.isLoading = false; 
          console.log(erro);
       });
         
    };
 

    $rootScope.writeQuestion = function(id, val, score, acertou){
        var question = ApiService.setQuestionData(id, val);
        console.log('Pergunta: '+id+' Resposta: '+val + ' Pontuação: '+score);
        if(id == 'E2'){
          $cookies.getObject('ultima');
          $cookies.putObject('ultima', 'E2');
        }

      $rootScope.isLoading = true;
         question.then(function succesHandle(data){  
             $rootScope.isLoading = false;   
              $rootScope.userScore = parseInt(score); 
              $rootScope.$apply;
               
           },function errorHandler(erro){  
             $rootScope.isLoading = false;  
              console.log(erro);
           });

       
    };

    $rootScope.writeEspecial1 = function(id, val, score, acertou){
        var question = ApiService.setQuestionData(id, val);
        // console.log('Pergunta: '+id+' Resposta: '+val + ' Pontuação: '+score);
 
      $rootScope.isLoading = true;
         question.then(function succesHandle(data){  
             $rootScope.isLoading = false;  
              console.log("gravou "+data); 
              $rootScope.userScore = score; 
              $rootScope.$apply;

           },function errorHandler(erro){  
             $rootScope.isLoading = false;  
              console.log(erro);
           });
    };


    $rootScope.moveNext = function(next, prev){
        // var question = ApiService.setQuestionData(id);
             $rootScope.isLoading = true;  
       if(prev == "E2"){
             $rootScope.isSpecial2 = false;
             $rootScope.userQuestion = [];
             $rootScope.isSpecial3 = true;
             $rootScope.isLoading = true; 

            $rootScope.$apply;

             return $rootScope.loadQuestion('E3'); 

       }else{

        var prevHouse = document.querySelector("#bloco-20")
        var nextHouse = document.querySelector("#bloco-20"); 
   
        prevHouse.classList.remove('ultimaReposta');
        prevHouse.classList.add('respondida');
        nextHouse.classList.add('ultimaReposta');
          $rootScope.isSpecial2 = false;
          $rootScope.userQuestion = [];

       }
        // console.log();
    };

    $rootScope.userGetData = function(){
      // return ApiService.getUserData();
    };
     $rootScope.openRank = function(){  
        $rootScope.isLoading = true;  
        $rootScope.isRanking = true;
         var rank = ApiService.getRanking(); 
 
         rank.then(function succesHandle(data){  
              $rootScope.isLoading = false;  
              $rootScope.gameRank.push(data); 
              $rootScope.$apply;

           },function errorHandler(erro){ 
              console.log(erro);
           });
     };

    $rootScope.go = function (route) {
      $location.path(route);
    };


 
    $rootScope.$watch('isLoadingGame', function(value){
       //
       return $rootScope.isLoadingGame;
    }); 
 
    $rootScope.$watch('userLastAnswer', function(value){
       //
       return $rootScope.userLastAnswer;
    }); 
 
    $rootScope.$watch('userScore', function(value){
       //
       // console.log("+ "+value + " total: "+ $rootScope.userScore);
       return $rootScope.userScore;
    }); 
    $rootScope.$watch('userQuestions', function(value){
       //
       // console.log(value);
       return $rootScope.userQuestions;
    });  

}]);
/***********************
  Main
************************/

quest.controller('mainController', 
  ['$rootScope', '$scope', '$location', '$q', 'AuthService', 'BoardService', 'ApiService',
  function ($rootScope, $scope, $location, $q, AuthService, BoardService, ApiService) {

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
    $rootScope.isRanking = false;
    $rootScope.questionData  = {};

    //refazendo logica menos bagunçada
    $rootScope.userData      = {}; 
    $rootScope.rankData      = {}; 
     $rootScope.userScore;
     $rootScope.userName;
     $rootScope.userLastQ;
     $rootScope.moveMarker = 0;

     $rootScope.openRank = function(){
      console.log("ranking");
        $rootScope.isRanking = true;
     };

    $rootScope.loadNextQuestion = function(next){
     $rootScope.moveMarker = next;  
    };

    $rootScope.userGetData = function(){
      // return ApiService.getUserData();
    };

    $rootScope.userQuestionData = function(){
     var promise =  AuthService.getQuestions();
     promise.then(function succesHandle(data){
      console.log(data);
      $rootScope.questionData.push(data);
      $rootScope.$apply;
     },function errorHandler(erro){

     });

    };

    $rootScope.go = function (route) {
      $location.path(route);
    };

    $rootScope.loadRankData = function(){
    
       var promise = ApiService.getRanking();
        promise.then(function resolveHandler(rank){ 
        $rootScope.isLoading = false;
        console.log(rank)
         //  $rootScope.rankData.userName  = user.name;
         //  $rootScope.rankData.userScore = parseInt(user.score);
         //  $rootScope.rankData.userLastQ = parseInt(user.lastQ);  
         // $rootScope.$apply;

        }, function rejectHandler(error){ 
          $rootScope.isLoading = false;
          $rootScope.error = true;
          $rootScope.errorMessage = error;
        }); 

      

    }; 

    $rootScope.loadUserData = function(){
     
       var promise = ApiService.getUserData();
        promise.then(function resolveHandler(user){ 
        $rootScope.isLoading = false;
          $rootScope.userData.userName  = user.name;
          $rootScope.userData.userScore = parseInt(user.score);
          $rootScope.userData.userLastQ = parseInt(user.lastQ);  
         $rootScope.$apply;

        }, function rejectHandler(error){ 
          $rootScope.isLoading = false;
          $rootScope.error = true;
          $rootScope.errorMessage = error;
        }); 

      

    }; 

    $rootScope.loadQuestionData = function(data){
     
       var promise = ApiService.getQuestionData(data);
        promise.then(function resolveHandler(question){ 

          $rootScope.questionData  = question; 

        }, function rejectHandler(error){ 

          $rootScope.setErro(error);
        }); 
     

    };

    // $rootScope.writeQuestionData = function(num,last){

    //   if(num && last){

    //    var promise = ApiService.setQuestionData(num,last);
    //     promise.then(function resolveHandler(){ 
    //       return true;

    //     }, function rejectHandler(error){ 
    //       $rootScope.error = true;
    //       $rootScope.errorMessage = error;
    //     }); 

    //   }

    // };  

    $rootScope.setErro = function(erro){
          $rootScope.isLoading = false;
          $rootScope.error = true;
          $rootScope.errorMessage = error;
    };

    $rootScope.logged = function(){ 
      var promisse = AuthService.logged();
        promisse.then(function success(logged){
          $location.path('/');
          
        }, function error(erro){
           $location.path('/login');
        });
    };


    //assistinda valores 
    $rootScope.$watch('moveMarker'); 
    $rootScope.$watch('isQuestion');  
    $rootScope.$watch('userData', function(value){
       //
    });  
    $rootScope.$watch('questionData', function(value){
       //
    });  

}]);

/***********************
  Login
************************/

quest.controller('authController',
  ['$rootScope', '$scope', '$location', '$http','$cookies', 'AuthService',
  function ($rootScope, $scope, $location, $http, $cookies, AuthService) {

    $rootScope.isLoading  = false;
    $rootScope.userActive = null; 


/*
# retorna true se logado ou string se erro
*/
    $rootScope.logged = function(){
       var promise = AuthService.logged();
        promise.then(function resolveHandler(log){ 
           
            return log; 

        }, function rejectHandler(error){  
            return $rootScope.setErro(error);
        }); 

    }; 

 

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
      $rootScope.disabled = true; 
      // $rootScope.isLoading = true;

      if($rootScope.checkFields()){
         
       var promisse =  AuthService.login($scope.loginForm.username, $scope.loginForm.password);
          promisse.then(function success(logged){
            if(logged === "ok"){
              $location.path('/');
            }else{
              $location.path('/');
            }
          }, function error(erro){
              $rootScope.error = true;
              $rootScope.errorMessage = erro;
          });

      }else{
        $rootScope.error = true;
        $rootScope.errorMessage = "Preencha os campos para prosseguir"; 
      }

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