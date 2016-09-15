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

/***
***/
