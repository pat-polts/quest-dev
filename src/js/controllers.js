"use strict";
//================================================
//# App Controllers
//================================================

/* quizz */
quest.controller('QuizCtrl', function($scope, $http, Question, $timeout,$cookieStore,UserAPI) {
    /**
     * redireciona para a tela de login caso o usuario seja invalido
     */
    if(!$cookieStore.get('user')){
        location.href = '#!/user';
     }
    /**
     * Request a Array<question> of the quizAPI
     * @return question
     */
    var questions = [];
    var count     =0;
    var i         = 0;

    Question.query(function (result) {
        questions=result;
        $scope.question = questions[count++];
    }, function (errors) {
        console.log(errors);
    });

    /**
     * Abre uma nova questão se hourerem  questoes
     * a serem respondidas, senão mostar a potuação
     * dbtido pelo usuario
     */
    function openNewQuestion() {
        i = count++;
        if(questions[i]){
            $scope.question = questions[i];
        }else{
            $scope.question = [];
            location.href = '#!/tabuleiro';
        }
    };
    $scope.setAlternative = function (alternative) {
        $scope.showButtonPronto= true;
        $scope.optionSelected = alternative;
    };
    /**
     * A cada alternativa selecionada e incrementado ao score do usuario o valor
     * correspondente dessa, caso seja a correta.
     * @param alternative
     */
    $scope.incrementScore = function (alternative) {
       var alternatives = questions[i].alternatives;
        alternative.class = 'orange';
        /**
         * seta um intervalo de 3 segundos apos a alternativa ser selecionada.
         */
        $timeout(openNewQuestion, 3000);
        /**
         * Pinta a alternaticva correta com a cor verde
         * e a selecionada com a cor laranja.
         */
        $scope.question.alternatives = alternatives.filter(function (alternative) {
            document.getElementById(alternative._id+'X').disabled = true;
            document.getElementById(alternative._id).disabled = true;
            $scope.showButtonPronto= false;
            if(alternative.right == true ){
                alternative.class="green"
            }
             return true;
        });
        $scope.user = $cookieStore.get('user');
        var data = {
            "userId":$scope.user._id,
            "alternative":alternative,
            "question":questions[i]
        };
        /**
         * Incrementa o valor da alternativa ao score do usuario e salva o historico das
         * questoes respondidas no servidor .
         * @return user //atualizado
         */
        UserAPI.putUser(data)
            .then(function success(response) {
                    console.log(response.data);
                    $scope.user = response.data;
            },
            function errorCallback(error) {
                console.log(error)
            });

    };
  }
);
/***********************
  Main
************************/

quest.controller('mainController', ['$rootScope', '$scope', '$location', '$q', 'AuthService', 'BoardService', 'ApiService',
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