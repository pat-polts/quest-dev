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

