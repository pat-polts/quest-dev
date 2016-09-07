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
      restrict: 'EAC',
      replace: true,
      scope: {
        score: '=score',
        boardData: '=boardData',
        lastQuestion: '=lastQuestion'
      },
      template: '<canvas id="game" width="1024" height="768" set-height></canvas>',
      link: function(scope, element, attribute){
            // console.log(element);
        var w, h, px, py, loader, manifest, board, house, eHouse,shape, profile, loadHouse, question,user;
 
        drawBoard(); 
        // var questions = BoardService.getQuestion();  
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
          loader.addEventListener("complete", handleComplete);
          loader.loadManifest(manifest, true, "/dist/assets/");
        }
        function createPaths(obj){
          var item = [];
          var indice = 0; 
          var markerStartX = 60;
          var markerStartY = 210;
          var total = Object.keys(obj).length;

          for (var i = 0; i < total; i++) {
              item[i] =  new createjs.Shape();
              item[i].x =  markerStartX;
              item[i].y = markerStartY;
          }

          return item
        }

        function getCurrentUser(){   
          var user = {};
          user.score = $rootScope.userScore;
          user.lastQ = $rootScope.userLastQ;

          return user;
        }
        function handleComplete(){ 
          var userData = getCurrentUser();

          //tabuleiro
          board = new createjs.Shape();  
          var imgBoard = loader.getResult("board");
            board.graphics.beginBitmapFill(imgBoard).drawRect(0, 0, 1024, 768);
            scope.stage.addChild(board); 

            var special    = false;  
            var lastResp   = userData.lastQ;
            if(lastResp === 1){
              var current = 1;
            }else if(lastResp === 17){
              //apenas para user admin e enquanto todas questões não estão na api
            } 
            else{
               var current    = lastResp + 1;
            }
           
            console.log(lastResp);
             

            for (var i = 1; i < 32; i++) { 

              if(i < 7){ 
                 createMarker(current,1,i,special);

              }else if(i > 6 && i < 13){  
                if(i === 12){
                  special = true;
                }else{
                  special = false;
                }
                 
                 createMarker(current,2,i,special); 
                             
              }else if(i > 13 && i < 20){
                special = false;
                 createMarker(current,3,i,special); 
                
              }else if(i > 19 && i < 22){    
                special = false;
                 createMarker(current,4,i,special);     

              
              }else if(i > 22 && i < 29){   
                if(i === 23 || i === 27){
                  special = true;
                } else{
                  special = false;   
                }
                 createMarker(current,5,i,special);  

              } else{
                if(i > 28 && i < 33){

                  special = false; 
                 createMarker(current,6,i,special); 
                } 

              }

            }

           loadQuestion(current);
           createjs.Ticker.timingMode = createjs.Ticker.RAF;
           createjs.Ticker.addEventListener("tick", tick); 
        
        }

        function createMarker(current,lines,index,special){
          var offsetx     = (w / 3);
          var offsety     = Math.round(h / 3);
          var color       = "white";
          var circle      = new createjs.Shape();
          var currentMark = loader.getResult("currentMarker");
          var marker      = new createjs.Shape(); 

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
 // console.log(y);
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
          
          scope.stage.addChild(circle);  


          if(current === index){

            marker.graphics.beginFill("#e8a612").drawRoundRect(0,0,31,45,17);
            marker.x = circle.x - 16;
            marker.y = circle.y - 20;
            scope.stage.addChild(marker); 
          }
          
        }
//************************************
//  carrega a pegunta
//************************************
        function loadQuestion(q){  
          if(q){
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
        function getUserObj(){
        }
//************************************
//  handle clique na casa
//************************************
        function handleMarkClick(){
          var house     = this;
          var houseName = house.name;
          var alert     = new createjs.Shape();
          var next      = houseName + 1;
          var prev      = houseName - 1;
          var question  = scope.boardData.questions.data;

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
          // var alert = new createjs.Shape(); 
          //   alert.graphics.beginFill("#fff").drawRoundRect(0,0, 500, 180, 10);
          //   txt = new createjs.Text("Responda a "+house+"° pergunta para prosseguir!", "22px Arial", "#c00");
          //   alert.x = 300;
          //   alert.y = 300;
          //   txt.x   = 350;
          //   txt.y   = 350;
          //   alert.on('click',function(event) {
          //     scope.stage.removeChild(alert, txt);
          //     moveMarker(next);
          //   });
          //   scope.stage.addChild(alert,txt);
        }
//************************************
//  move marcador
//************************************
        function moveMarker(q){
         return loadQuestion(q);
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
      templateUrl: '../../views/templates/question_copy.html',
      scope: {
        questionData: '=questionData'
      },
      link: function(scope, element, attribute){
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
        }
          scope.choose = false;

        scope.selectOption = function(){
          var el       = this; 
          escolha  = el.alt.Valor;
          var resposta = el.$index; 

          if(escolha === scope.correct){
            //yep acertou!
            $rootScope.activeScore = scope.score;
            $rootScope.userData.userScore +=  parseInt($rootScope.activeScore);
            console.log("yep");
            console.log("Acertou, mais "+scope.score+" pontos");
          } else{
            console.log("ounch");
            console.log("reposta certa seria: "+scope.correct);
          }
          scope.answered = true;
          $rootScope.activeHouse = scope.id;

          $http.post('/api/question', {numero: scope.id, valor: escolha}, 
            function success(res) {
              if(res.status === 200){
                console.log("ok, move next");
              }            
          }, function error(res){

              if(res.status === 500){
                console.log("erro ao gravar a pergunta");
              }     

          });

          // console.log(el); 
        }

        function loadQuestion(q){  
          if(q){
            console.log(q);
            console.log($rootScope.userData.userScore);
            $rootScope.isLoading = true;
            $http.get('/api/question/'+q)
              .then(function success(res){ 
                $rootScope.isLoading = false;
                if(res.data.question){
                  $rootScope.isQuestion = true;  
                  $rootScope.questionData = res.data.question;  
                }
              }, function error(res){ 
                  console.log("erro ao obter pergunta");
              }); 
          }

        }
        scope.choose = function(){
          if(!escolha){
            console.log("responda a pergunta");
          }
          var next = parseInt($rootScope.activeHouse) + 1;
          console.log(next);
          $rootScope.isQuestion = false;
          return loadQuestion(next);
        }
      }

  }
}]); 