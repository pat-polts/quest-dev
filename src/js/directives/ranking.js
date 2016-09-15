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