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

/*************************************************************************/
quest.directive('desafioInstrucoes', ['$rootScope','$http', '$cookies', function($rootScope, $http, $cookies){
    return{
      restrict: 'E', 
      teamplateUrl:'../../views/templates/desafio-instrucao-1.html',
      scope: {
        id: '=' 
      },
      link: function(scope, element, attribute){
        console.log(scope.id);

        switch(scope.id){
          case 1 :
            scope.text = "Chegamos até  o nosso primeiro desafio, de Sinais e Sintomas.Aqui você deve colocar os testemunhos de pacientes na coluna correta antes de confirmar sua resposta. Não há sintomas especificos para o câncer de ovário, porém quando ocorrem de forma mais frequente e mais graves , alguns sinais podem ser alertas para o câncer. Quais mulheres realmente podem estar com sintomas de câncer de ovário?";
            break;
          case 2:
            scope.text = "Chegamos até  o nosso segundo desafio, de Vantangens e Desvantagens. Aqui teremos dois momentos. No primeiro, leia a história da paciente e defina de acordo com as vantagens e desvantagens de se fazer o teste <strong>BRCA</strong>,se ela fez ou não o teste. <br /> Já no segundo, identifique quais declarações refletem as desvantagens do teste de <strong>BRCA</strong>m";
            break;

        }
        console.log(scope.text);
        scope.next = function(){
          switch(scope.id){
            case 1 :
            $rootScope.isSpecial1 = true;
            $rootScope.desafioInstrucoes = false;
              $rootScope.loadQuestionE1();
              break;
            case 2:
              $rootScope.desafioInstrucoes = false;
              $rootScope.loadQuestion('E2');
              break;

          }
          
        }

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
/*************************************************************************/
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
          var user   = $cookies.getObject('user');

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

          if(user.name){
            scope.name = user.name;
          }

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
 
                $rootScope.moveNext(next,prev);
                $rootScope.go('/jogar');
              
            }else{
              console.log("escolha uma opcao");
            }

            scope.optValue = null;
       
          }
      }
   }

  
}]); 


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

        scope.instrucoes = true;
        scope.instrucaoText = "Chegamos até  o nosso primeiro desafio, de Sinais e Sintomas.Aqui você deve colocar os testemunhos de pacientes na coluna correta antes de confirmar sua resposta. Não há sintomas especificos para o câncer de ovário, porém quando ocorrem de forma mais frequente e mais graves , alguns sinais podem ser alertas para o câncer. Quais mulheres realmente podem estar com sintomas de câncer de ovário?";
 

          console.log($rootScope.questionEspecial);
          var data = $rootScope.questionEspecial[0];
          var indice = 0; 

            scope.isSelected = false;
            scope.data       = '';
            scope.erroMsg    = $rootScope.errorMessage; 
            scope.btnTxt     = 'pronto'; 
            scope.id         = data.Numero;
            scope.titulo     = data.Titulo;
            scope.opcoes     = data.AlternativasEspeciais;
            scope.corretas   = data.RespostasCorretasEspeciais;

            scope.selecionadas = [];

          var totalList = scope.opcoes.length;
          var total     = totalList / 2;
          scope.listA   = [];
          scope.listB   = []; 

          $rootScope.sortElement(scope.opcoes);  

          scope.listA = scope.opcoes.slice(indice,total);
          scope.listB = scope.opcoes.slice(total,totalList); 
       

        scope.next = function(){  
          scope.instrucoes = false;
          console.log(scope.instrucoes);
          return scope.instrucoes;
        }

        scope.listChange = function(list, id){
          var data = {relacoes: list, valor: id}; 
          scope.selecionadas.push(data);
              
        }
   /* TODO: implementar drag and drop */
        scope.onDragComplete=function(data,evt){
           console.log("drag success, data:", data);
        }
        scope.onDropComplete=function(data,evt){
            console.log("drop success, data:", data);
        }

        scope.selectOption = function(list,id){
            // scope.selecionadas.push(id);
            var drags        = [];  
            scope.isSelected = true;
            var option       = scope.corretas[list].Relacoes;
            var acertou      = compareCorrect(option,id,list); 
            var checkHit     = false;

            if(acertou){
              checkHit = true;
            }else{
              checkHit = false;
            }
            var data = {relacao: list, valor: id, acertou: checkHit};
            scope.selecionadas.push(data);
            console.log(scope.selecionadas);
    
        }

        var compareCorrect = function(a,b,list){
          var corrects     = a.split(',');
          var newSelecteds = [];
          var lists        = {};
    
          corrects.forEach(function(el,index,arr){
            if(corrects[index] == b){
              return true;
            }else{
             false;
            }
          }); 

        };

        scope.check = function(){ 
          $rootScope.isSpecial1 = false;
          $rootScope.$apply;
        }


      }


      
  }

 } ] );

/***********************************************************************
## Tabuleiro
**********************************************************************/
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
        var user   = $cookies.getObject('user');
        
        scope.load = false; 

        if(user){
          scope.nome      = user.name;
          scope.ultima    = user.last;
          scope.pontuacao = user.score;
        }

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
          
          switch(el){
            case 11 :
              //special      
              $rootScope.desafioInstrucoes = true;
              $rootScope.loadQuestionE1();
            break;   
            case 20 :
              //special
              $rootScope.loadQuestion('E2.1');
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

/***
***/


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
        console.log($rootScope.userQuestion);

           var escolha = null;
           var question = [];
           var question2 = [];
         scope.isEspecial2 = true;
         scope.isEspecial3 = false;

          scope.optSelected = false;
          scope.optInvalid = false;
          scope.acertou = false;
          scope.optValue = null;
          if(!scope.data){
             question = $rootScope.userQuestion; 
          }else{
            question = scope.data[0];  
          }    

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

          if(scope.id == 'E2.1'){
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


/*********************
  UserService
**********************/

quest.factory('ApiService', ['$rootScope', '$q', '$timeout', '$http', '$location', 'AuthService',
  function ($rootScope, $q, $timeout, $http, $location, AuthService) {

    var userApi = {};

    userApi.getUserData = function(){  

      var deferred = $q.defer(); 
      $rootScope.isLoading = true;
      $http.get('/api/user')
        .then(function success(res){    
            if(res.status === 200){ 
             $rootScope.isLoading = false;
              if(res.data.obj){  
                deferred.resolve(res.data.obj);
              }
            } 
           
        }, function error(res){  
            if(res.status === 500){
            $rootScope.isLoading = false;
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

      var user          = null; 
      var userAuth      = {}; 
      var hour          = 3600000
      var exp           = new Date(Date.now() + hour);
      var cookieOptions = {expires: exp, httpOnly: true}; 
 
 /******************************************************
 # AuthService.login()
 # loga usuario
 ******************************************************/
      userAuth.login = function (username, password) {   
        var deferred    = $q.defer();

        var credentials = {login: username, senha: password }; 
        $rootScope.isLoading = true;
        $http.post('/auth/login', credentials)
          .then(function success(res){ 
            $rootScope.isLoading = false;
            if(res.status === 200){
              // console.log(res);
              if(res.data.logged){
                $cookies.putObject('logged', true, cookieOptions);
                if($cookies.getObject('logged')){
                  deferred.resolve(res.data.logged);
                }
              }
            }

          }, function error(res){
            $rootScope.isLoading = false; 
            $rootScope.error = true; 
            $rootScope.errorMessage = "Erro inesperado!";  

            if(res.status === 500){
              // console.log(res);
              if(res.data.error){
                $cookies.putObject('logged', false);
                deferred.reject(res.data.error);
              }
            }
          });       

          return deferred.promise;
      }; 

 /******************************************************
 # AuthService.logged()
 # verifica se existe usuário
 ******************************************************/
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
    
          $cookies.remove('user');
          $cookies.remove('logged');
         
      };
 
 
 
    return userAuth;

}]); //AuthService ends

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
