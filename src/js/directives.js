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
quest.directive('board', ['$rootScope','$http', '$cookies', 'BoardService', 'AuthService',  
  function($rootScope, $http, $cookies, BoardService, AuthService){
    return{
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        boardData: '=', 
        questionData: '=' 
      },
      template: '<canvas id="game" width="1024" height="768"></canvas> ',
      // controller: function(scope, element,attribute){
      //   // $rootScope.moveEl = function(){
      //   //   console.log(1);
      //   // };
      // },
      link: function(scope, element, attribute){
   
        var w, h, px, py, hx, hy, loader, manifest, board, house, especial, challenge, shape, profile, loadHouse, question,user;
 
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
          scope.load = false;
          board        = new createjs.Shape();
          var alertLoad    = new createjs.Shape();
          var alertLoadTxt = new createjs.Text("Carregando informações", "22px Arial", "#c00");
          var palcoW = w /2;
          var palcoH = h / 2;
          var palcoX = (w / 2) / 2;
          var palcoY = (h / 2) / 2;
          var imgBoard = loader.getResult("board");   
          var userCookie = [];  

          board.graphics.beginBitmapFill(imgBoard).drawRect(0, 0, 1024, 768); 

          scope.stage.addChild(board);   
            $rootScope.isLoading = true;

           setTimeout(function () { 
              $rootScope.isLoading = false;  
              boardStart();     
              userCookie = [
                {
                  'nome': $rootScope.userName, 
                  'pontos': $rootScope.userScore, 
                  'ultima': $rootScope.userLastAnswer
                }
              ];

              // if($cookies.getObject().length === 0){
                $cookies.putObject('user', userCookie); 
              // } 
              // console.log($rootScope.userLastAnswer);
              // console.log($rootScope.userQuestion);
             
          },5000); 


          

          createjs.Ticker.timingMode = createjs.Ticker.RAF;
          createjs.Ticker.addEventListener("tick", tick);   
        
        }
        function loadingBoard(){

          // scope.stage.addChild(alertLoad, alertLoadTxt);  


        }
        function boardStart(){
          var userCookie = $cookies.getObject('user');
          var special    = false;  
          var last        =  userCookie[0].ultima;
          if(last === 20){
            var current = 1;
          }else{
            var current     =  last + 1;

          }
          var questions = $rootScope.userQuestions[0];
        //   questions.sort(function(a, b){
        //     var keyA = new Date(a.Numero),
        //         keyB = new Date(b.Numero);
        //     // Compare the 2 dates
        //     if(keyA < keyB) return -1;
        //     if(keyA > keyB) return 1;
        //     return 0;
        // });
          for (var i = 0; i < questions.length; i++) {
            if(questions[i].Numero){
               questions[i].Numero.sort();
            }
          }
          console.log(questions);
          // var qTotal = questions; 
          // var totalCasas = 30;
          // console.log(questions);
        // var active     = false;
        // var especial   = false;
        // var index      = 20;
        // scope.casas    = [];
        // scope.blocos = [];
        // var isActive = false;

        for (var i = 0; i < 30; i++) {

            if(i === 11 || i === 20 || i === 25){
              special = true;
            }

            if(i === index){
              isActive = true;
            }

            scope.casas.push({"id": i,  "isSelected": isActive});
         
          
        } 
        // var bloco_0 = scope.casas.slice(0,6);
        // var bloco_1 = scope.casas.slice(6,12);
        // var bloco_2 = scope.casas.slice(12,18);
        // var bloco_3 = scope.casas.slice(18,20);
        // var bloco_4 = scope.casas.slice(20,28);
        // var bloco_5 = scope.casas.slice(28,30);

        // scope.blocos = [
        //   {"id": 0, "bloco": bloco_0 }, 
        //   {"id": 1, "bloco":  bloco_1 }, 
        //   {"id": 2, "bloco":  bloco_2 }, 
        //   {"id": 3, "bloco":  bloco_3 }, 
        //   {"id": 4, "bloco":  bloco_4 }, 
        //   {"id": 5, "bloco":  bloco_5 } 
        // ];
       

          for (var i = 0; i < 30; i++) {
            
          }


            
            // for (var i = 1; i < 32; i++) { 

            //   if(i < 7){ 
            //      createMarker(current,1,i,special);

            //   }else if(i > 6 && i < 13){  
            //     if(i === 12){
            //       special = true;
            //     }else{
            //       special = false;
            //     }
                 
            //      createMarker(current,2,i,special); 
                             
            //   }else if(i > 13 && i < 20){
            //     special = false;
            //      createMarker(3,i,special); 
                
            //   }else if(i > 19 && i < 22){    
            //     special = false;
            //      createMarker(current,4,i,special);     

              
            //   }else if(i > 22 && i < 29){   
            //     if(i === 23 || i === 27){
            //       special = true;
            //     } else{
            //       special = false;   
            //     }
            //      createMarker(current,5,i,special);  

            //   } else{
            //     if(i > 28 && i < 33){

            //       special = false; 
            //      createMarker(current,6,i,special); 
            //     } 

            //   }

            // }

           
            // return loadQuestion(current);
          
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
            marker.x = circle.x;
            marker.y = circle.y;

            scope.stage.addChild(marker); 
          }

        }
//************************************
//  carrega a pegunta
//************************************
        function moveToNext(){
          // var next = nexsQuest();
          // if(next){
          //   //console.log(maker.x);
          // }
        };
        function loadQuestion(q = ''){ 
      
          if(q){  
           $rootScope.loadQuestionData(q);   
            console.log(1);
            // setTimeout(function () { 
            // console.log(2);
            //   $rootScope.isQuestion   = true;  
            // },200);  

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
          // var house     = this;
          // var houseName = house.name;
          // var alert     = new createjs.Shape();
          // var next      = houseName + 1;
          // var prev      = $rootScope.userLastQ;
          // var question  = scope.boardData.questions;

          // if(prev !==0 && !question[prev].Respondida){
          //   //Ops pulando casas
          //   return handleWrongHouse(prev);
          // }

          //   if(question[houseName]){
          //     if(question[houseName].Respondida){
          //       //proxima casa
          //       return loadQuestion(question[next]);

          //     }else{
          //       //carrega pergunta
          //       return loadQuestion(question[houseName]);

          //     }
          //   }

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
          // console.log(question);
          if(scope.respondida && scope.name == "TopCode"){
            var next = parseInt(scope.id) + 1;
            // scope.optInvalid = true;
            console.log("ja respondida usuario admin");
            // $location.path('/jogar');
          }else{
            // $location.path('/jogar');
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
       
            // console.log(escolha);
          }
          scope.enviaPergunta = function(){ 
              var el            = this;
            if(scope.optValue !== null){
              if(scope.optValue == scope.correta){
                scope.acertou = true;
                $rootScope.userScore += scope.pontos; 
              }

              $rootScope.writeQuestion(scope.id,scope.optValue,scope.pontos,scope.acertou);
              $rootScope.isQuestion = false;
              var next = parseInt(scope.id);
              var prev = parseInt(scope.id) - 1;
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


quest.directive('especialUm', ['$rootScope',  function($rootScope, $http,ApiService){

 return{   
      restrict: 'E', 
      templateUrl: '../../views/templates/especial-1.html',
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
      templateUrl: '',
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

        scope.nome      = parseInt($cookies.getObject('nome'));
        scope.ultima    = parseInt($cookies.getObject('ultima'));
        scope.pontuacao = $cookies.getObject('pontos');

        var totalCasas = 30;
        var active     = false;
        var especial   = false;
        var index = scope.ultima;

        console.log("last: "+scope.ultima);
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
          var el = this.$index + 1; 
          var prev;
          if(id == 11){

          }else{
            $rootScope.loadQuestion(el); 
          }
            
        };

        scope.openRank = function(){
          $rootScope.isQuestion = false;
          $rootScope.isRanking  = false;
        };
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