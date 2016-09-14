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
      redirectTo: '/' 
    });
});

quest.run(function ($rootScope, $location, $route, AuthService) { 
$rootScope.$on('$routeChangeStart', function (next, current) {
      if(next && next.$$route && next.$$route.restricted){
        if(!AuthService.logged()){ 
         $location.path('/login'); 
        } 
      }
  });
$rootScope.$on('$stateChangeStart',function (next, current) { 
        if(next && next.$$route && next.$$route.restricted){      
          if(!AuthService.logged()){ 
            console.log(next);
           $location.path('/login'); 
          } 
      }
});
 
});

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


quest.directive('question', ['$rootScope', '$http', '$cookies', '$location',  
  function($rootScope, $http, $cookies, $location){
  return{   
      restrict: 'E', 
      templateUrl: '../../views/templates/question.html',
      scope: { 
        pergunta: '='
      },
      link: function(scope, element, attribute){

          var index         =  0;
          var escolha       = null;
          var question      = scope.pergunta[0];

          scope.optSelected = false;
          scope.optInvalid  = false;
          scope.acertou     = false;
          scope.optValue    = null;

          scope.id           = question.Numero;
          scope.titulo       = question.Titulo;
          scope.respondida   = question.Respondida;
          scope.alternativas = question.Alternativas;
          scope.correta      = question.ValorAlternativaCorreta;
          scope.pontos       = question.ValorPontuacao;
            
            if(question.Descricao){
              var desc = question.Descricao;
              var desc2 = desc.split('<br />');
              if(desc2.length !== 0){
                scope.descricaoList = [];
                desc2.forEach(function(e,i,a){
                  console.log(e);
                  if(e !== ''){
                       scope.descricaoList.push(e);
                  }
                });
                
              }else{
                scope.descricao    = question.Descricao;

              }
            }


          scope.name = $cookies.getObject('nome');
    // console.log(question);
 
          scope.responder = function(){ 
            if(scope.optSelected){
              //jaescolhido
              console.log("valor "+ scope.optValue +" já escolhido");
            }else{
              var el            = this;
              var elIndex       = el.$index;
              var escolha       = el.data.Valor;  
              var pClass        = 'valor-'+escolha;
              var childValor    = document.querySelector('#v'+elIndex); 
              var childAllValor = document.querySelector('p.valor'); 

                childAllValor.classList.remove('selected'); 
                childValor.classList.add('selected'); 

              scope.optSelected = true; 
               scope.optValue  = escolha;
            }
              // scope.enviaPergunta();
            // console.log(escolha);
          }
          scope.enviaPergunta = function(){ 
              var el            = this;
            if(scope.optValue){
              if(scope.optValue == scope.correta){
                scope.acertou = true;
                $rootScope.userScore += scope.pontos; 
              } 

              $rootScope.writeQuestion(scope.id, scope.optValue,$rootScope.userScore,scope.acertou);
              $rootScope.isQuestion = false; 
        
                var next = parseInt(scope.id);
                var prev = parseInt(scope.id)  - 1;  
 
                // $rootScope.moveNext(next,prev);
                $rootScope.go('/jogar');
              
            }else{
              console.log("escolha uma opcao");
            }

            scope.optValue = null;
       
          }
      }
   }

  
}]); 



quest.directive('msgErro', ['$rootScope',  function($rootScope, $http,BoardService){

 return{   
      restrict: 'E', 
      templateUrl: '../../views/templates/erro.html',
      scope: {
      },
      link: function(scope, element, attribute){
        scope.erroMsg = $rootScope.errorMessage;
      }
      
  }

 } ] );   


quest.directive('loadingGame', ['$rootScope',  function($rootScope, $http,ApiService){

 return{   
      restrict: 'E', 
      templateUrl: '../../views/templates/loading.html',
      scope: {
      },
      link: function(scope, element, attribute){
        scope.erroMsg = $rootScope.errorMessage;
      }
      
  }

 } ] );
quest.directive('ranking', ['$rootScope',  function($rootScope, $http,ApiService){

 return{   
      restrict: 'E', 
      templateUrl: '../../views/templates/ranking.html',
      scope: {
        ranking: '='
      },
      link: function(scope, element, attribute){
        scope.erroMsg = $rootScope.errorMessage;
        console.log(scope.ranking);
        // scope.nome = $cookies.getObject('nome');
        scope.close = function(){
          $rootScope.isRanking = false;

        }
      }
      
  }

 } ] );

quest.directive('tabuleiro', ['$rootScope', '$http','$q', '$cookies', 
  function($rootScope, $http, $q,$cookies){

 return{   
      restrict: 'E', 
      templateUrl: '../../views/tabuleiro.html',
      scope: {  
        boardData: '='
      },
      link: function(scope, element, attribute){   
        var userCookie = [];
        scope.load = false; 

        var user = 

        scope.nome      = $cookies.getObject('nome');
        scope.ultima    = $cookies.getObject('ultima');
        scope.pontuacao = $cookies.getObject('pontos');

        var totalCasas = 30;
        var active     = false;
        var especial   = false; 
        var index      = scope.ultima; 

        console.log("last: "+scope.ultima);
        console.log("score: "+scope.pontuacao);

        scope.casas  = [];
        scope.blocos = [];

        if(scope.boardData.length !== 0){
          var perguntas = scope.boardData;
            // console.log(perguntas[0]);
        }
        var isActive   = false;  
        var pushObj    = [];
        var especial   = false;
        var isSelected = false;

        for (var i = 0; i < totalCasas; i++) {  
            if(i === 11 || i === 20 || i === 25){
              especial = true;
            }else{
              especial = false;
            }
 
            if(i == index){
              // console.log(perguntas[0][i]);
              isSelected = true;
            }else{
              isSelected = false;
            }

            pushObj = {"id": i, "isSelected": isSelected, "special": especial};
            scope.casas.push(pushObj);
        }  

        var bloco_0 = scope.casas.slice(0,6);
        var bloco_1 = scope.casas.slice(6,12);
        var bloco_2 = scope.casas.slice(12,18);
        var bloco_3 = scope.casas.slice(18,20);
        var bloco_4 = scope.casas.slice(20,28);
        var bloco_5 = scope.casas.slice(28,30);

        scope.blocos = [
          {"id": 0, "bloco": bloco_0 }, 
          {"id": 1, "bloco":  bloco_1 }, 
          {"id": 2, "bloco":  bloco_2 }, 
          {"id": 3, "bloco":  bloco_3 }, 
          {"id": 4, "bloco":  bloco_4 }, 
          {"id": 5, "bloco":  bloco_5 } 
        ];
   

        scope.openQ = function(id){
          var el = id; 
          var pgt = id + 1;
          console.log(el);
          switch(el){
            case 11 :
              //special
              $rootScope.loadQuestionE1();
            break;   
            case 20 :
              //special
              $rootScope.loadQuestion('E2');
            break;   
            case 25 :
              //special
              // $rootScope.loadQuestionE5();
            break;  
            default:
              //simples
              $rootScope.loadQuestion(pgt); 
            break;   
          }
       
            
        };

        scope.openRank = function(){
          $rootScope.isQuestion = false;
          $rootScope.isRanking  = false;
        };
      }
      
  }

 } ] );   

/********************************************************************************************
* SINAIS E SINTOMAS :: especial 1
* diretiva: <sinais-e-sintomas ng-if ="isSpecial1" data="questionEspecial"></sinais-e-sintomas>
* html: question-especial-1.html
* dados: api $rootScope.loadQuestionE1()
/********************************************************************************************/

quest.directive('sinaisESintomas', ['$rootScope','$http',  function($rootScope, $http, ApiService){

 return{   
      restrict: 'E', 
      templateUrl: '../../views/templates/question-especial-1.html',
      scope: {
        data: '='
      },    

      link: function(scope, element, attribute){
        console.log($rootScope.questionEspecial);
        var data = $rootScope.questionEspecial[0];
        var indice = 0; 
          scope.isSelected = false;
          scope.data = '';
          scope.erroMsg = $rootScope.errorMessage; 
          scope.btnTxt = 'pronto'; 
          scope.id = data.Numero;
          scope.titulo = data.Titulo;
          scope.opcoes = data.AlternativasEspeciais;
          scope.corretas = data.RespostasCorretasEspeciais;

        scope.selecionadas = [];

        var totalList = scope.opcoes.length;
        var total = totalList / 2;
        scope.listA = [];
        scope.listB = []; 

        $rootScope.sortElement(scope.opcoes);  

        scope.listA = scope.opcoes.slice(indice,total);
        scope.listB = scope.opcoes.slice(total,totalList); 


        scope.listChange = function(list, id){
             
              var data = {relacoes: list, valor: id}; 
              scope.selecionadas.push(data);
              
        }
   
        scope.onDragComplete=function(data,evt){
           console.log("drag success, data:", data);
        }
        scope.onDropComplete=function(data,evt){
            console.log("drop success, data:", data);
        }

        scope.selectOption = function(list,id){
            // scope.selecionadas.push(id);
            var drags = [];  
            scope.isSelected = true;
            var option = scope.corretas[list].Relacoes;
            var acertou = compareCorrect(option,id,list); 
            var checkHit = false;
            if(acertou){
              checkHit = true;
            }else{
              checkHit = false;
            }
            var data = {relacoes: list, valor: id, acertou: checkHit};
            scope.selecionadas.push(data);
            console.log(scope.selecionadas);
    
        }

        var compareCorrect = function(a,b,list){
          var corrects = a.split(',');
          var newSelecteds = [];
            var lists = {};
    
          corrects.forEach(function(el,index,arr){
            if(corrects[index] == b){
              //
             // lists += {list: {"correct": true, "valor": b }};
            return true;
            }else{
             false;
            }

          }); 
             // newSelecteds.push(lists);
           

        };

        scope.check = function(){ 
            $rootScope.isSpecial1 = false;
            $rootScope.$apply;
        }


      }


      
  }

 } ] );



/********************************************************************************************
* VANTAGENS E DISVANTAGENS :: especial 2
* diretiva: <sinais-e-sintomas ng-if ="isSpecial1" data="questionEspecial"></sinais-e-sintomas>
* html: question-especial-1.html
* dados: api $rootScope.loadQuestionE1()
/********************************************************************************************/

quest.directive('vantagensEDisvantagens', ['$rootScope','$http', '$cookies',
 function($rootScope, $http, $cookies, ApiService){
  return{
    restrict: 'E', 
    templateUrl: '../../views/templates/question-especial-2.html',
    scope:{
      data: '='
    },

     link: function(scope, element, attribute){
        // console.log(data);
           var escolha = null;
           var question = [];
           var question2 = [];
         scope.isEspecial2 = true;
         scope.isEspecial3 = false;

          scope.optSelected = false;
          scope.optInvalid = false;
          scope.acertou = false;
          scope.optValue = null;

         question = scope.data[0];      

            scope.id           = question.Numero;
            scope.titulo       = question.Titulo;
            scope.respondida   = question.Respondida;
            scope.alternativas = question.Alternativas;
            scope.correta      = question.ValorAlternativaCorreta;
            scope.pontos       = question.ValorPontuacao;
            scope.descricao       = question.Descricao;

            question = scope.data;

           console.log(scope.id );
 
          
          if(scope.respondida && scope.name == "TopCode"){
            // var next = parseInt(scope.id) + 1;
           
            console.log("ja respondida usuario admin");
             
          } else{
            // $location.path('/jogar');
          }

          if(scope.id == 'E2'){
            scope.img    = 'img-suzana-desenho.png';
            scope.btnTxt = 'proximo';
          }else{
            scope.img    = 'img-maria-desenho.png';
            scope.btnTxt = 'proximo';
          }

          scope.responder = function(val){ 
            if(scope.optSelected){
              //jaescolhido
              console.log("valor "+ scope.optValue +" já escolhido");
            }else{
              var el            = this;
              var elIndex       = el.$index;
              var escolha       = val;  
              var pClass        = 'valor';
              var childValor    = document.querySelector('#v'+elIndex); 
              var childAllValor = document.querySelector('p.valor'); 

              childAllValor.classList.remove('selected'); 
              childValor.classList.add('selected'); 

              scope.optSelected = true; 
              scope.optValue  = escolha;
            }
       
            // console.log(escolha);
          }
          scope.next = function(id){ 
            console.log(id)
             if(id == 'E2' || id == 'E3' || id == 'E4' ||  id == 'E5'){
              
              switch(id){
                case 'E2': 
                //
                break;
                case 'E3':
                  $rootScope.go('/jogar/especial-2/historia/');
                break;
                case 'E4':
                  $rootScope.go('/jogar/especial-2/multipla-escolha-2');
                break;
                case 'E5':
                  $rootScope.go('/jogar/desafio/');
                break;
              }

            }else{
              scope.enviaPergunta();
            }
              // scope.enviaPergunta();
           
          }

          scope.enviaPergunta = function(){ 
              var el            = this;
            if(scope.optValue !== null){
              if(scope.optValue == scope.correta){
                scope.acertou = true;
                $rootScope.userScore += scope.pontos; 
              }

              $rootScope.writeQuestion(scope.id,scope.optValue,$rootScope.userScore,scope.acertou);
 
                var next = 'E3';
                var prev = 'E2';

                $rootScope.moveNext(next,prev); 
              
            }else{
              console.log("escolha uma opcao");
            }
            scope.optValue = null;
          }
    } 

  }
}]);

/*
** VANTAGENS E DISVANTAGENS :: especial 3
*/

quest.directive('vantagensEDisvantagens2', ['$rootScope','$http', '$cookies',
 function($rootScope, $http, $cookies, ApiService){
  return{
    restrict: 'E', 
    templateUrl: '../../views/templates/question-especial-3.html',
    scope:{
      data: '='
    },

     link: function(scope, element, attribute){
        scope.isEspecial2    = false;
        scope.isEspecial3    = true;
        scope.optSelected    = false;
        scope.optInvalid     = false;
        scope.acertou        = false;
        scope.optValue       = null;

        var escolha = null;
        // var question = []; 
        $rootScope.isLoading = true;  

       
           var question = scope.data; 

            scope.id           = question.Numero;
            scope.titulo       = question.Titulo;
            scope.respondida   = question.Respondida;
            scope.alternativas = question.Alternativas;
            scope.correta      = question.ValorAlternativaCorreta;
            scope.pontos       = question.ValorPontuacao;
            scope.descricao       = question.Descricao;

           // console.log(scope.data);
        // if(scope.data.length !== 0){

        // } else{
        //   console.log("sem dados");
        // }
          
          if(scope.respondida && scope.name == "TopCode"){
            
           
            console.log("ja respondida usuario admin");
             
          } else{
            // $rootScope.isQuestion = false;
            // $rootScope.isSpecial3 = false;
            // exit;
            // $location.path('/jogar');
          }
 
            scope.img    = 'img-maria-desenho.png';
            scope.btnTxt = 'proximo';
       
          scope.check = function(){
            $rootScope.isSpecial3 = false;
            $rootScope.$apply;
          }

          scope.responder = function(val){ 
            if(scope.optSelected){
              //jaescolhido
              console.log("valor "+ scope.optValue +" já escolhido");
            }else{
              var el            = this;
              var elIndex       = el.$index;
              var escolha       = val;  
              var pClass        = 'valor';
              var childValor    = document.querySelector('#v'+elIndex); 
              var childAllValor = document.querySelector('p.valor'); 

              childAllValor.classList.remove('selected'); 
              childValor.classList.add('selected'); 

              scope.optSelected = true; 
              scope.optValue  = escolha;
            }
       
            // console.log(escolha);
          }
          scope.check = function(){ 
            scope.enviaPergunta();
              // scope.enviaPergunta();
           
          }

          scope.enviaPergunta = function(){ 
              var el            = this;
            if(scope.optValue !== null){
              if(scope.optValue == scope.correta){
                scope.acertou = true;
                $rootScope.userScore += scope.pontos; 
              }

              $rootScope.writeQuestion(scope.id,scope.optValue,$rootScope.userScore,scope.acertou);
 
                var next = 'E4';
                var prev = 'E3';

                $rootScope.moveNext(next,prev); 
              
            }else{
              console.log("escolha uma opcao");
            }
            scope.optValue = null;
          }
    } 

  }
}]);


quest.directive('faseCompleta', ['$rootScope', '$q', 'ApiService', function($rootScope, $http, $q, ApiService){

 return{   
      restrict: 'E', 
      templateUrl: '../../views/fase-completa.html',
      scope: {  
      },
      link: function(scope, element, attribute){  
         //

      }
    }
 
 }]);        

"use strict";
//================================================
//# App Factories
//================================================

/*********************
  UserService
**********************/

quest.factory('ApiService', ['$rootScope', '$q', '$timeout', '$http', '$location', 'AuthService',
  function ($rootScope, $q, $timeout, $http, $location, AuthService) {

    var userApi = {};

    userApi.getUserData = function(){  

      var deferred = $q.defer(); 
      $http.get('/api/user')
        .then(function success(res){    
            if(res.status === 200){ 
              if(res.data.obj){ 

                deferred.resolve(res.data.obj);
              }
            } 
           
        }, function error(res){  
            if(res.status === 500){
              if(res.data.error){ 
                $rootScope.error        = true; 
                $rootScope.errorMessage = res.data.error;  

                deferred.reject(res.data.error);
              }
            }
        });

        return deferred.promise; 
    };
 

    userApi.getQuestionData = function(q){ 

      var deferred = $q.defer(); 
      if(q){
        $http.get('/api/question/'+q)
          .then(function success(res){    

              if(res.status === 200){ 
                if(res.data.obj){ 
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

    userApi.getQuestions = function(){ 

      var deferred = $q.defer();  
     
        $rootScope.isLoading = true;  
        $http.get('/api/questions')
          .then(function success(res){   
              if(res.status === 200){ 
                if(res.data.obj.length !== 0){ 
                 $rootScope.isLoading = false;   
                  deferred.resolve(res.data.obj);
                }
              } 
             
          }, function error(res){ 
                 $rootScope.isLoading = false;  

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
/*********************************************************
********* Grava questão simples e especiai E2 a E4 atualmente
*** passar numero = id pergunta valor = ultima respondida

*********************************************************/
    userApi.setQuestionData = function(id,last){ 

      var deferred = $q.defer(); 

      $rootScope.isLoading = true;
      if(id && last){
        $http.post('/api/question/',{numero: id, valor: last})
          .then(function success(res){   
              if(res.status === 200){ 
                if(res.data.ok){
                  $rootScope.isLoading = false;   
                   deferred.resolve(res.data.ok); 
                } 
                 
              } 
             
          }, function error(res){  
              if(res.status === 500){
                if(res.data.error){ 
                 $rootScope.isLoading = false;   
                  $rootScope.error = true; 
                  $rootScope.errorMessage = res.data.error;  
                  deferred.reject(res.data.error);
                }
              }
          });
      }else{
        console.log("pergunta nao enviada");
      }

      return deferred.promise; 
    };



    userApi.getQuestionE1 = function(){ 

      var deferred = $q.defer();  
     
        $http.get('/api/especial1')
          .then(function success(res){  
              if(res.status === 200){ 
                if(res.data.obj.length !== 0){  
                // console.log(res.data.obj);
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

    userApi.getQuestionE2 = function(){ 

      var deferred = $q.defer();  
     
        $http.get('/api/especial2')
          .then(function success(res){  
              if(res.status === 200){ 
                if(res.data.obj.length !== 0){  
                console.log("especial 2 "+res.data.obj);
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

    userApi.getRanking = function(){ 

      var deferred = $q.defer(); 

          $rootScope.isLoading  = true;
        $http.get('/api/ranking')
          .then(function success(res){  
              if(res.status === 200){  
                if(res.data.obj){
                  $rootScope.isLoading  = false;
                  deferred.resolve(res.data.obj); 
                }
              } 
             
          }, function error(res){ 
          $rootScope.isLoading  = false;
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
        var deferred    = $q.defer();

        var credentials = {login: username, senha: password }; 
        $http.post('/auth/login', credentials)
          .then(function success(res){ 
            
            if(res.status === 200){
              // console.log(res);
              if(res.data.logged){
                 deferred.resolve(res.data.logged);
              }
            }

          }, function error(res){
            $rootScope.error = true; 
            $rootScope.errorMessage = "Erro inesperado!";  

            if(res.status === 500){
              // console.log(res);
              if(res.data.error){
                deferred.reject(res.data.error);
              }
            }
          });       

          return deferred.promise;
      }; 

     userAuth.logged = function(){ 

        var deferred = $q.defer();

        $http.get('/auth/status')
        .then(function success(res){ 
            if(res.status === 200){
            
               deferred.resolve(res.data.logged);
              
            } 
        }, function error(res){
          if(res.data.error){           
            $rootScope.setErro = res.data.error;
            deferred.reject(res.data.error);
          }
        });     

        return deferred.promise;

      };

      userAuth.logout = function(){ 
        var deferred = $q.defer();

        $http.get('/auth/logout')
        .then(function success(res){   
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
      $cookies.remove('nome');
      $cookies.remove('pontos');
      $cookies.remove('ultima');

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
            $rootScope.userLastAnswer = 20;
          }else{
            $rootScope.userLastAnswer = data.lastQ;

          }
          $rootScope.$apply;
          console.log(data.lastQ);
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


    $rootScope.loadQuestion = function(id){ 
console.log(id);
      var question         =  ApiService.getQuestionData(id);
      $rootScope.isLoading = true;
     
      $rootScope.userQuestion = [];
       $rootScope.questionEspecial = [];
     question.then(function succesHandle(data){
         if(id == 'E2'){
            $rootScope.questionEspecial.push(data);  
            $rootScope.isSpecial1 = false; 
            $rootScope.isSpecial2 = true; 
            $rootScope.isQuestion = false;

        }else{
          $rootScope.userQuestion.push(data);  
          $rootScope.isQuestion = true;
        }
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
          var houses = document.querySelector(".casas");
          var prevHouse = document.querySelector("#bloco-"+prev)
          var nextHouse = document.querySelector("#bloco-"+next); 
      
          houses.classList.remove('ultimaReposta');
          prevHouse.classList.remove('ultimaReposta');
          prevHouse.classList.add('respondida');  
          nextHouse.classList.add('ultimaReposta'); 

        // console.log();
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