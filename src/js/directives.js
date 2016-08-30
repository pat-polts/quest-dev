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
quest.directive('board', function(){
    return{
      restrict: 'EAC',
      replace: true,
      scope: {},
      template: '<canvas id="game" width="1024" height="768" set-height></canvas>',
      link: function(scope,element, attribute){
        var w, h, px, py, loader, manifest, board, house, eHouse;
        drawBoard();

        function drawBoard(){
          if (scope.stage) {
              scope.stage.autoClear = true;
              scope.stage.removeAllChildren();
              scope.stage.update();
          } else {
              scope.stage = new createjs.Stage(element[0]);
          }
          w = scope.stage.canvas.width;
          h = scope.stage.canvas.height;
          manifest = [
            {src: "current-marker.png", id: "eHouse"},
            {src: "house-marker.png", id: "house"},
            {src: "board.png", id: "board"}
          ];
          loader = new createjs.LoadQueue(false);
          loader.addEventListener("complete", handleComplete);
          loader.loadManifest(manifest, true, "/dist/assets/");
        }
        function handleComplete(){
          console.log(w + " " + h);
          board = new createjs.Shape();
          board.graphics.beginBitmapFill(loader.getResult("board")).drawRect(0, 0, w, h);
          house = new createjs.Shape();
          house.graphics.beginFill("white").drawCircle(0, 0, 10);
          house.x =  40;
          house.y = 150;
           scope.stage.addChild(board, house);
           // scope.stage.addEventListener("stagemousedown", handleJumpStart);
           createjs.Ticker.timingMode = createjs.Ticker.RAF;
           createjs.Ticker.addEventListener("tick", tick);
        
        }
        function tick(event){
          scope.stage.update(event);
        }
      }
    }
});