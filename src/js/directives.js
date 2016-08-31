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

/**************************
  Board
***************************/
quest.directive('board', ['BoardService',  function(BoardService){
    return{
      restrict: 'EAC',
      replace: true,
      scope: {
        score: '=score',
        activeHouse: '=activeHouse'
      },
      template: '<canvas id="game" width="1024" height="768" set-height></canvas>',
      link: function(scope, element, attribute){
        var w, h, px, py, loader, manifest, board, house, eHouse,shape, score, profile, activeHouse, question;
        drawBoard();

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
            var x1 =  seq1;
            var x2 =  seq2;
            var y1 = markerStartY;
            var y2 = markerStartY + 40;
            var special = false;

            for (var i = 0; i < 29; i++) {

              if(i < 6){ 
                 createMarker(activeHouse,1,i,special);

              }else if(i > 6 && i < 12){  
                if(i === 11){
                  special = true;
                }
                 createMarker(activeHouse,2,i,special); 
                             
              }else{        

              } 

            }

              
           createjs.Ticker.timingMode = createjs.Ticker.RAF;
           createjs.Ticker.addEventListener("tick", tick);
        
        }
        function createMarker(current,lines,index,special){
          var offsetx = (w / 3) - (56 * 6);
          var offsety = Math.round(h / 3) / 6;
          var color   = "white";
          var circle = new createjs.Shape();
          var currentMark = loader.getResult("currentMarker");
          var marker = new createjs.Shape();

          if(special) color = "#37d349";  
          // console.log(scope.activeHouse);
          // console.log(scope.score);

          switch(lines){
            case 1:
              var x = 56 * (index + 1) + 10;
              var y = 210;
               // console.log(x);
              // 
            break;
            case 2:
            //
              var x = Math.floor(w / 3) + 3;
              if(index === 7){
                var y = 266;
              }else{
                var y = Math.round(offsety) * (index - 1) + 20; 
              }
            break;
            case 3:

            break;
            default:
            //
            break;
          } 

          circle.graphics.beginFill(color).drawCircle(0, 0, 16);
          circle.x = x;
          circle.y = y;
          circle.name = "casa_"+index; 
          circle.on("click", handleMarkClick);
          
          scope.stage.addChild(circle); 


          if(index === current){

            marker.graphics.beginFill("#e8a612").drawRoundRect(0,0,31,45,17);
            marker.x = circle.x - 16;
            marker.y = circle.y - 20;
            scope.stage.addChild(marker); 
          }
          
          
        }
        function createMarkerSpecial(){
          //
        }
        function handleMarkClick(){
          var house = this;
          console.log(house);
        }
        function tick(event){
          scope.stage.update(event);
        }

        function toggleCache(value) {
          // iterate all the children except the fpsLabel, and set up the cache:
          var l = stage.getNumChildren() - 1;

          for (var i = 0; i < l; i++) {
            var shape = scope.stage.getChildAt(i);
            if (value) {
              shape.cache(-radius, -radius, radius * 2, radius * 2);
            } else {
              shape.uncache();
            }
          }
        }
      }
    }
}]);