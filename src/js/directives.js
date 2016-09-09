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

/**************************
  Board
***************************/
quest.directive('board', ['$rootScope','$http', 'BoardService', 'AuthService',  function($rootScope, $http, BoardService, AuthService){
    return{
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        score: '=score',
        boardData: '=boardData' 
      },
      controller: ['$scope', function boardController($scope) {
        $scope.moveToNext = function(next){
          console.log(next);
        }
      }],
      template: '<canvas id="game" width="1024" height="768"></canvas>',
      // controller: function(scope, element,attribute){
      //   // $rootScope.moveEl = function(){
      //   //   console.log(1);
      //   // };
      // },
      link: function(scope, element, attribute){
   
        var w, h, px, py, loader, manifest, board, house, eHouse,shape, profile, loadHouse, question,user;
 
        drawBoard();   
        function drawBoard(){
          if (scope.stage) {
              scope.stage.autoClear = true;
              scope.stage.removeAllChildren();
              scope.stage.update();
          } else {
              scope.stage = new createjs.Stage(element[0]);
          }
          // score       = scope.userData.userScore; 
          w           = scope.stage.canvas.width;
          h           = scope.stage.canvas.height;

          manifest = [
            {src: "current-marker.png", id: "currentMarker"},
            {src: "house-marker.png", id: "marker"},
            {src: "board.png", id: "board"}
          ]; 

          loader = new createjs.LoadQueue(false);  
          loader.addEventListener("progress", handleProgress);
          loader.addEventListener("complete", handleComplete);
          loader.loadManifest(manifest, true, "/dist/assets/");
 
        }
        function handleProgress(){
         //on progress, before loading
          

        }
        function handleComplete(){  
          
          board        = new createjs.Shape();
          var alertLoad    = new createjs.Shape();
          var alertLoadTxt = new createjs.Text("Carregando informações", "22px Arial", "#c00");
          var palcoW = w /2;
          var palcoH = h / 2;
          var palcoX = (w / 2) / 2;
          var palcoY = (h / 2) / 2;
          var imgBoard = loader.getResult("board");     

          board.graphics.beginBitmapFill(imgBoard).drawRect(0, 0, 1024, 768); 

          scope.stage.addChild(board);   
 

           setTimeout(function () {  
             boardStart();  
          },4000); 

          

          createjs.Ticker.timingMode = createjs.Ticker.RAF;
          createjs.Ticker.addEventListener("tick", tick);   
        
        }
        function loadingBoard(){

          // scope.stage.addChild(alertLoad, alertLoadTxt);  


        }
        function boardStart(){
        
          var special    = false;  
          var last        =  $rootScope.userLastQ;
          if(last === 17){
            var current = 1;
          }else{
            var current     =  $rootScope.userLastQ + 1;

          }
            
            for (var i = 1; i < 32; i++) { 

              if(i < 7){ 
                 createMarker(1,i,special);

              }else if(i > 6 && i < 13){  
                if(i === 12){
                  special = true;
                }else{
                  special = false;
                }
                 
                 createMarker(2,i,special); 
                             
              }else if(i > 13 && i < 20){
                special = false;
                 createMarker(3,i,special); 
                
              }else if(i > 19 && i < 22){    
                special = false;
                 createMarker(4,i,special);     

              
              }else if(i > 22 && i < 29){   
                if(i === 23 || i === 27){
                  special = true;
                } else{
                  special = false;   
                }
                 createMarker(5,i,special);  

              } else{
                if(i > 28 && i < 33){

                  special = false; 
                 createMarker(6,i,special); 
                } 

              }

            }

             
            $rootScope.$watch('isQuestion',function(value){
              if(value == false){
                moveToNext();
              }
            });

            return loadQuestion(current);
          
        }

        function createMarker(lines,index,special){

          
          var offsetx     = (w / 3);
          var offsety     = Math.round(h / 3);
          var color       = "white";
          var circle      = new createjs.Shape();
          var currentMark = loader.getResult("currentMarker");
          var marker      = new createjs.Shape();  
          var last        =  $rootScope.userLastQ;
          if(last === 17){
            var current     =  1;    
          }else{
            var current     =  $rootScope.userLastQ + 1;
          }
          
         

          var line1x = Math.round(offsetx) /  6;
          var line2y = Math.round(offsety) /  6;

          if(special) color = "#37d349";  

          switch(lines){
            case 1:
              var x = Math.round(line1x) * (index);
              var y = 210;
              
            break;
            case 2:
              var x1 = Math.round(line1x) * 6;
              var x = x1; 
              if(index === 7){
                var y = offsety;  
              }else{
                var y = offsety + ( Math.round(line2y) * (index - 7) ) + index; 
              } 
         
            break;
            case 3:
              var y2 = offsety + ( Math.round(line2y) * 5 ) + 12;
              var y  = y2;
              var x1 = (Math.round(line1x) * 6) + 16;

              if(index === 14){
                  var x =  x1 + (14 * 2);
              }else{
                var x3 = x1 + (14 * 2);
                 var x = x3 + (index * 2) * (index - 14) + index;
              }

            break;
            case 4:
              var x1 = (Math.round(line1x) * 6) + 16;
                var x3 = x1 + (14 * 2);
               if(index === 20){
                  var y =  offsety + ( Math.round(line2y) * (11 - 7) ) + 11;
               }else{
                var y =  offsety + ( Math.round(line2y) * (10 - 7) ) + 10;
               }
                var x = x3 + (19 * 2) * (19 - 14) + 19;

            break;
            case 5:
              var y  =  offsety + ( Math.round(line2y) * (10 - 7) ) + 10;
              var x5 = (Math.round(offsetx * 2)) - 50;

              if(index === 23){
                var x = x5;
              }else{
                var x = x5 + (index * 2) * (index - 23) - 5;
              }
 
            break;
            case 6:
              var x5 = (Math.round(offsetx * 2)) - 50; 
              var y6 = offsety + ( Math.round(line2y) * (11 - 7) ) + 11;
             if(index === 29){
                  var y =  429;

             }else if(index === 30){
                var y =  459;
             }else{
                var y =  489;
             }
              
                var x = x5 + (28 * 2) * (28 - 23) - 5;
 
            break;
            default:
            //
            break;
          } 

          circle.graphics.beginStroke('#9a9c9e').beginFill(color).drawCircle(0, 0, 12);
          circle.x = x;
          circle.y = y;
          circle.name = index; 
          circle.on("click", handleMarkClick);
          circle.on("stagemousemove", handleData);
          
          scope.stage.addChild(circle);   

          if(current === index){
            marker.graphics.beginFill("#e8a612").drawRoundRect(0,0,31,45,17);
            marker.name = current;
            marker.x = circle.x - 16;
            marker.y = circle.y - 20;
            scope.stage.addChild(marker); 
          }

        }
//************************************
//  carrega a pegunta
//************************************
        function moveToNext(){
          var next = BoardService.getNext();
          if(next){
            //console.log(maker.x);
          }
        };
        function loadQuestion(q = ''){ 
      
          if(q){  
           $rootScope.loadQuestionData(q);   
            console.log(1);
            setTimeout(function () { 
            console.log(1);
              $rootScope.isQuestion   = true;  
            },200);  

            // $rootScope.isQuestion = true; 
            // $http.get('/api/question/'+q)
            //   .then(function success(res){ 
            //     if(res.data.question){
            //       $rootScope.isQuestion = true;  
            //       $rootScope.questionData = res.data.question;  
            //     }
            //   }, function error(res){ 
            //       console.log("erro ao obter pergunta");
            //   }); 
          }

        }
        function handleData(){
          // console.log($rootScope.userLastQ);
        }
//************************************
//  handle clique na casa
//************************************
        function handleMarkClick(){ 
          var house     = this;
          var houseName = house.name;
          var alert     = new createjs.Shape();
          var next      = houseName + 1;
          var prev      = $rootScope.userLastQ;
          var question  = scope.boardData.questions;

          if(prev !==0 && !question[prev].Respondida){
            //Ops pulando casas
            return handleWrongHouse(prev);
          }

            if(question[houseName]){
              if(question[houseName].Respondida){
                //proxima casa
                return loadQuestion(question[next]);

              }else{
                //carrega pergunta
                return loadQuestion(question[houseName]);

              }
            }

        }
//************************************
//  handle clique na casa errada
//************************************
        function handleWrongHouse(house){
         alert("Responda a pergunta"+ house+ "antes de prosseguir");
        }
//************************************
//  move marcador
//************************************
        function moveMarker(){
          console.log(1);
         if($rootScope.moveMarker){
          console.log("move")
          return loadQuestion($rootScope.userLasQ);
         }else{
          console.log("no move");
         }
        }

        $rootScope.nextQuestion = function(q){
          return loadQuestion(q);

        }

//************************************
//  carrega info usuario
//************************************
        function loadProfile(){

        }
        function onAnimationComplete(){
          console.log(this);
        }
        function tick(event){ 
          scope.stage.update(event);
        }

        
      }
    }
}]);


quest.directive('question', ['$rootScope', '$http', 'BoardService',  function($rootScope, $http,BoardService){
  return{   
      restrict: 'E',
      transclude: true,
      templateUrl: '../../views/templates/question_copy.html',
      scope: {
        questionData: '=questionData'
      },
      link: function(scope, element, attribute,boardController){
        var question = scope.questionData; 
        var escolha = null;
        if(question){

          scope.id     = question.Numero;
          scope.title    = question.Titulo;
          scope.desc     = question.Descricao;
          scope.score    = question.ValorPontuacao;
          scope.answered = question.Respondida;
          scope.options  = question.Alternativas; 
          scope.correct  = question.ValorAlternativaCorreta; 

          $rootScope.userLastQ = scope.id;
        } 

        scope.selectOption = function(){
          var el       = this; 
          var resposta = el.$index; 
          escolha      = el.alt.Valor;
          // scope.answered = false;
          // if(scope.answered){
          //   alert("Ops! ja respondida, clique em pronto para prosseguir");
          // }else{
              if(escolha === scope.correct){
                scope.choose = escolha;
                scope.answered = true;

                  $rootScope.userScore +=  parseInt(scope.score);
                  // $rootScope.alertWin(userScore);
                  alert("Yep! Resposta certa, você ganhou mais: "+scope.score +"pontos. Seu total atual é de: "+$rootScope.userScore);
              } else{
                  alert("Ounch! Resposta certa seria: "+scope.correct);
              } 

        }


        function loadQuestion(q = ''){ 
    
          if(q){  
           $rootScope.loadQuestionData(q);   

            setTimeout(function () { 
              $rootScope.isQuestion   = true;  
            },500);  

            // $rootScope.isQuestion = true; 
            // $http.get('/api/question/'+q)
            //   .then(function success(res){ 
            //     if(res.data.question){
            //       $rootScope.isQuestion = true;  
            //       $rootScope.questionData = res.data.question;  
            //     }
            //   }, function error(res){ 
            //       console.log("erro ao obter pergunta");
            //   }); 
          }

        }
 
        scope.choose = function(){ 
            $rootScope.isQuestion = false; 
          if(escolha !== ''){   
            // return BoardService.loadNext(next);
           //$rootScope.writeQuestionData(scope.id,$rootScope.userLastQ);
          }else{ 
              alert("Escolha uma das alternativas");
          }
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