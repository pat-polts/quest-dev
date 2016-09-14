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
      transclude: true,
      templateUrl: '../../views/templates/question.html',
      scope: { 
        pergunta: '='
      },
      link: function(scope, element, attribute){

          var index =  1;
          var escolha = null;
          var question = scope.pergunta[0];
          scope.optSelected = false;
          scope.optInvalid = false;
          scope.acertou = false;
          scope.optValue = null;

          scope.id           = question.Numero;
          scope.titulo       = question.Titulo;
          scope.respondida   = question.Respondida;
          scope.alternativas = question.Alternativas;
          scope.correta      = question.ValorAlternativaCorreta;
          scope.pontos       = question.ValorPontuacao;

          scope.name = $cookies.getObject('nome');
    
 
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

              $rootScope.writeQuestion(scope.id, scope.optValue,scope.pontos,scope.acertou);
              $rootScope.isQuestion = false;
              if(scope.id == 'E2' || scope.id == 'E3' || scope.id == 'E4'){ 

                var next = 21;
                var prev = 19;
              }else{
                var next = parseInt(scope.id);
                var prev = parseInt(scope.id) - 1;

              }
                
                $rootScope.moveNext(next,prev);
              
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
        if(scope.ultima == 'E2' || scope.ultima == 'E3' || scope.ultima == 'E4'){
          var index = 20;
        }else{
          var index = scope.ultima;
        }
        

        console.log("last: "+parseInt(scope.ultima));
        console.log("score: "+scope.pontuacao);

        scope.casas    = [];
        scope.blocos = [];
        if(scope.boardData.length !== 0){
          var perguntas = scope.boardData;
            console.log(perguntas[0]);
        }
        var isActive = false;  
        var pushObj = [];
        var especial = false;
        var isSelected = false;
        for (var i = 0; i < totalCasas; i++) { 
            if(i === 11 || i === 20 || i === 25){
              especial = true;
            }else{
              especial = false;
            }
 
            if(i === index){
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
              $rootScope.loadQuestionE1();
            break;   
            case 20 :
              //special
              $rootScope.loadQuestion('E2');
            break;   
            case 24 :
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
