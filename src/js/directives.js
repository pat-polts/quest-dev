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
quest.directive('board', ['$rootScope','$http', 'BoardService',  function($rootScope, $http, BoardService){
    return{
      restrict: 'EAC',
      replace: true,
      scope: {
        score: '=score',
        activeHouse: '=activeHouse',
        boardData: '=boardData',
        userData: '=userData',
        lastAnswer: '=lastAnswer'
      },
      template: '<canvas id="game" width="1024" height="768" set-height></canvas>',
      link: function(scope, element, attribute){
            // console.log(element);
        var w, h, px, py, loader, manifest, board, house, eHouse,shape, score, profile, activeHouse, question;
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
          activeHouse = scope.activeHouse;
          score       = scope.score;
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
        function handleComplete(){

          var imgMarker    = loader.getResult("marker");
          var imgMarkerMask    = loader.getResult("currentMarker");
          var markerStartX = 60;
          var markerStartY = 210;
          var markerX      = markerStartX * 5;
          var boardPath    = BoardService.getBoard();
          var boardData    = BoardService.getBoardData();
          var total        = boardPath.length;
          var markerArr    = [];

          var curves = Math.floor(w / 3);
          var seq1 = Math.floor(curves / 6);
          var seq2 = Math.floor(curves / 7);

          //tabuleiro
          board = new createjs.Shape();
          board.graphics.beginBitmapFill(loader.getResult("board")).drawRect(0, 0, w, h);
          scope.stage.addChild(board); 
          // console.log(seq1);
            var x1         =  seq1;
            var x2         =  seq2;
            var y1         = markerStartY;
            var y2         = markerStartY + 40;
            var special    = false; 
            var current    = getCurrent();
        
             

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
             
           createjs.Ticker.timingMode = createjs.Ticker.RAF;
           createjs.Ticker.addEventListener("tick", tick);
            loadQuestion(current);
            // BoardService.getQuestion();
            // console.log(scope.boardData);
        
        }
        function getCurrent(){
          console.log(scope.lastAnswer);
          return 8;
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
          $http.get('/api/question/'+q)
            .then(function success(res){ 
              if(res.data.question){
                // console.log(res.data.question);
                $rootScope.isQuestion = true;  
                $rootScope.questionData = res.data.question;  
                // $rootScope.$apply();  
              }
            }, function error(res){ 
                console.log("erro ao obter pergunta");
            }); 

            $rootScope.$apply();
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
          var alert = new createjs.Shape(); 
            alert.graphics.beginFill("#fff").drawRoundRect(0,0, 500, 180, 10);
            txt = new createjs.Text("Responda a "+house+"° pergunta para prosseguir!", "22px Arial", "#c00");
            alert.x = 300;
            alert.y = 300;
            txt.x   = 350;
            txt.y   = 350;
            alert.on('click',function(event) {
              scope.stage.removeChild(alert, txt);
              moveMarker(next);
            });
            scope.stage.addChild(alert,txt);
        }
//************************************
//  move marcador
//************************************
        function moveMarker(){
          // var house = circle.index;
          // var hx = house.x;
          // var hy = house.y;
          // var mx = marker.x;
          // var my = marker.y;
          // createjs.TweenJS.get(marker).to({x:mx}, 1000).to({x:hx}, 0).call(onAnimationComplete);
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


quest.directive('question', ['$rootScope','BoardService',  function($rootScope, BoardService){
  return{
      templateUrl: '../../views/templates/question_copy.html',
      scope: {
        questionData: '=questionData'
      },
      link: function(scope, element, attribute){
        var question = scope.questionData;
        console.log(question);
        scope.id     = question.Numero;
        scope.title    = question.Titulo;
        scope.desc     = question.Descricao;
        scope.score    = question.ValorPontuacao;
        scope.answered = question.Respondida;
        scope.options  = question.Alternativas; 
        scope.correct  = question.ValorAlternativaCorreta; 

        scope.selectOption = function(){
          var resposta = this;
          var valor = element;
          console.log(valor);
          scope.answered = true;
        }
        scope.close = function(){
          $rootScope.isQuestion = false;
        }
      }

  }
}]); 