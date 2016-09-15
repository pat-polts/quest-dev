
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
