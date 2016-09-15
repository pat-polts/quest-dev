
quest.directive('loadingGame', ['$rootScope',  function($rootScope, $http,ApiService){

 return{   
      restrict: 'E', 
      templateUrl: '../../views/templates/loading.html',
      scope: {
      },
      link: function(scope, element, attribute){
        scope.erroMsg = $rootScope.errorMessage;
      }
      
  }

 } ] );