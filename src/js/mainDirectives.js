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
