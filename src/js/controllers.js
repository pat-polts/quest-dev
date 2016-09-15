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

    $rootScope.desafioInstrucoes = false;
    $rootScope.desafioId = 0;



    $rootScope.sortElement = function(arr){
      var newEl;
        newEl = arr.sort(function(){
        return 0.3 - Math.random();
      }); 
    };

    $rootScope.setUserCookies = function(name,score,last){ 
      var user          = {'name': name, 'score': score, 'last': last};
      var hour          = 3600000
      var exp           = new Date(Date.now() + hour);
      var cookieOptions = {expires: exp, httpOnly: true}; 

      $cookies.remove('user'); 
      $cookies.putObject('user', user, cookieOptions);  

    };

    $rootScope.loadData = function(){
      var user      = ApiService.getUserData();
      var questions =  ApiService.getQuestions();
      $rootScope.isLoading = true;
 
       user.then(function succesHandle(data){
          $rootScope.isLoading = false;
          $rootScope.userName  = data.name;
          $rootScope.userScore = data.score;
         
          if(isNaN(data.lastQ)){
            $rootScope.userLastAnswer = 1;
          }else if(data.lastQ == 'E2' || data.lastQ == 'E3' || data.lastQ == 'E4'){
            $rootScope.userLastAnswer = 20;
          }else{
            $rootScope.userLastAnswer = data.lastQ;

          }
          $rootScope.$apply;
          $rootScope.setUserCookies($rootScope.userName,$rootScope.userScore , $rootScope.userLastAnswer);


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

/*********************************************
## Carrega questões simples e especial 2
*********************************************/

    $rootScope.loadQuestion = function(id){ 
 
      var question         =  ApiService.getQuestionData(id);

      $rootScope.isLoading        = true;
      $rootScope.userQuestion     = [];
       $rootScope.questionEspecial = [];

     question.then(function succesHandle(data){
      $rootScope.isLoading  = false;
         if(id == 'E2'){
            $rootScope.questionEspecial.push(data);  
            $rootScope.isSpecial1 = false; 
            $rootScope.isSpecial2 = true; 
            $rootScope.isQuestion = false;
            
            $rootScope.$apply;


        }else{ 
          $rootScope.userQuestion.push(data);  
          $rootScope.isQuestion = true;
          $rootScope.$apply;
        }


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
          $rootScope.isSpecial1 = true;
          $rootScope.$apply;
 

       },function errorHandler(erro){
          $rootScope.isLoading = false; 
          console.log(erro);
       });
         
    };
 

    $rootScope.writeQuestion = function(id, val, score, acertou){ 

        var question = ApiService.setQuestionData(id, val);
        console.log('Pergunta: '+id+' Resposta: '+val + ' Pontuação: '+score);

         question.then(function succesHandle(data){  
            if(data){
              $cookies.remove('ultima');
              $cookies.putObject('ultima', id);
              $rootScope.userScore = parseInt(score); 
              $rootScope.$apply;
              $rootScope.isQuestion = false;

            }
               
           },function errorHandler(erro){   
              console.log(erro);
           });
       
    };

    $rootScope.moveNext = function(next, prev){  
        var houses    = document.querySelector(".casas");
        var prevHouse = document.querySelector("#bloco-"+prev)
        var nextHouse = document.querySelector("#bloco-"+next); 
      
        houses.classList.remove('ultimaReposta');
        prevHouse.classList.remove('ultimaReposta');
        prevHouse.classList.add('respondida');  
        nextHouse.classList.add('ultimaReposta'); 

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
     
 
    $rootScope.isQuestion    = false;  
    $rootScope.isRanking = false;
    $rootScope.questionData  = {};

    //refazendo logica menos bagunçada
    $rootScope.userData      = {}; 
    $rootScope.rankData      = {}; 
     $rootScope.userScore;
     $rootScope.userName;
     $rootScope.userLastQ;

     $rootScope.lastPage; 

     $rootScope.openRank = function(){ 
        $rootScope.lastPage = 'ranking';
        $rootScope.isRanking = true;
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

    $rootScope.nextPage = function(){ 
      //
    };


    //assistinda valores  
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
            if(logged){
              console.log($cookies.getObject("logged"));
             return  $location.path('/');
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
  ['$rootScope', '$cookies', '$location',
  function ($rootScope, $cookies, $location) {
    
    // return $cookies.remove('logged');
    

}]);

