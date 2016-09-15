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