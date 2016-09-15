
quest.controller('tabuleiro',
  ['$rootScope', '$location','$q', '$cookies', 'ApiService',
  function ($rootScope, $location, $q, $cookies, ApiService) {
    // $rootScope.activePage     = $location.path(); 
    $rootScope.isLoading      = false;
    $rootScope.isLoadingGame  = false;
    $rootScope.isSpecial1     = false;
    $rootScope.isSpecial2     = false;
    $rootScope.isSpecial3     = false;
    
    $rootScope.userLogged     = $cookies.getObject('logged') || 'null';
    $rootScope.userName;
    $rootScope.userEmail;
    $rootScope.userScore;
    $rootScope.userLastAnswer;

    $rootScope.userQuestions    = [];
    $rootScope.userQuestion     = [];
    
    $rootScope.users            = [];
    $rootScope.optionSelected   = false;
    $rootScope.gameRank         = [];
    $rootScope.questionEspecial = [];

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
      var cookieOptions = {expires: exp}; 

      $cookies.remove('user'); 
      $cookies.putObject('user', user, cookieOptions);  
        

    };
  

    $rootScope.loadData = function(){ 
      var user      = ApiService.getUserData();
 

      user.then(function succesHandle(data){
      
          $rootScope.userName      = data.name;
          $rootScope.userScore     = data.score;
    
          if(isNaN(data.lastQ) || data.lastQ == ''){
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
       });

      var questions =  ApiService.getQuestions();

       questions.then(function succesHandle(data){  
          $rootScope.isLoading     = false;

          $rootScope.userQuestions.push(data); 
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
      $rootScope.userQuestion.push(data);  
          $rootScope.isLoading = false; 

         if(id == 'E2.1'){
            // $rootScope.questionEspecial.push(data);  
            $rootScope.isSpecial1 = false; 
            $rootScope.isSpecial2 = true; 
            $rootScope.isQuestion = false;
            
            $rootScope.$apply;
            if($rootScope.questionEspecial.length !== 0){
             $rootScope.isLoading  = false;

            }


        }else{ 
          $rootScope.isSpecial1 = false; 
          $rootScope.isSpecial2 = false; 
          $rootScope.isQuestion = true;
          $rootScope.isLoading  = false;
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
        var user   = $cookies.getObject('user');
        var name   = user.name;
        var ultima = user.ultima;
        var pontos = user.pontos;

        console.log('Pergunta: '+id+' Resposta: '+val + ' Pontuação: '+score);

         question.then(function succesHandle(data){  
            if(data){

              $rootScope.userScore = parseInt(score); 
              $rootScope.$apply;
              $rootScope.setUserCookies(name,$rootScope.userScore,id);
              $rootScope.isQuestion = false;

            }
               
           },function errorHandler(erro){   
              console.log(erro);
           });
       
    };

    $rootScope.moveNext = function(next, prev){  
        var user = $cookies.getObject('user');
        console.log(user.ultima);
        var houses    = document.querySelector("#bloco-27");
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
  Login
************************/

quest.controller('authController',
  ['$rootScope', '$scope', '$location', '$http','$cookies', 'AuthService', 'ApiService',
  function ($rootScope, $scope, $location, $http, $cookies, AuthService, ApiService) {

    $rootScope.isLoading  = false;
    $rootScope.userActive = null; 
 
    if($location.path() == '/logout'){
      AuthService.logout();
      return $location.path('/login');
    }


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
             return   $location.path('/');
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
 

//================================================
//# App Controllers
//================================================


/***********************
  Main
************************/

quest.controller('mainController', 
  ['$rootScope', '$scope', '$location', '$q', '$cookies', 'AuthService', 'ApiService',
  function ($rootScope, $scope, $location, $q, $cookies, AuthService, ApiService) {

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
     $rootScope.userQuestions = [];

     $rootScope.lastPage; 
     
    $rootScope.getUserData = function(){
      var user      = ApiService.getUserData();
      $rootScope.isLoading = true;
      user.then(function succesHandle(data){
          $rootScope.isLoading = false;
          $rootScope.userName      = data.name;
          $rootScope.userScore     = data.score;
         
          if(isNaN(data.lastQ) || data.lastQ == ''){
            $rootScope.userLastAnswer = 1;
          }else if(data.lastQ == 'E2' || data.lastQ == 'E3' || data.lastQ == 'E4'){
            $rootScope.userLastAnswer = 20;
          }else{
            $rootScope.userLastAnswer = data.lastQ;

          }
          $rootScope.$apply;
          $rootScope.setUserCookies($rootScope.userName,$rootScope.userScore , $rootScope.userLastAnswer);

          console.log($cookies.getObject('user'));
 

       },function errorHandler(erro){
          console.log(erro);
          $rootScope.isLoading = false;  
       });
     };



    $rootScope.setUserCookies = function(name,score,last){ 
      var user          = {'name': name, 'score': score, 'last': last};
      var hour          = 3600000
      var exp           = new Date(Date.now() + hour);
      var cookieOptions = {expires: exp, secure: true}; 

      $cookies.remove('user'); 
      $cookies.putObject('user', user, cookieOptions);  

    };



     $rootScope.openRank = function(){ 
        $rootScope.lastPage = 'ranking';
        $rootScope.isRanking = true;
     }; 

    $rootScope.go = function (route) {
      $location.path(route);
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
