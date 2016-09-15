
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
