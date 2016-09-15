
/***********************
  Login
************************/

quest.controller('authController',
  ['$rootScope', '$scope', '$location', '$http','$cookies', 'AuthService', 'ApiService',
  function ($rootScope, $scope, $location, $http, $cookies, AuthService, ApiService) {

    $rootScope.isLoading  = false;
    $rootScope.userActive = null; 
 
    if($location.path() == '/logout'){
      AuthService.logout();
      return $location.path('/login');
    }


/*
# retorna true se logado ou string se erro
*/
    $rootScope.logged = function(){
       var promise = AuthService.logged();
        promise.then(function resolveHandler(log){ 
           
            return log; 

        }, function rejectHandler(error){  
            return $rootScope.setErro(error);
        }); 

    }; 

 

    $rootScope.checkFields = function(){
      if($scope.loginForm.username && $scope.loginForm.password){
        return true;
      }else{
        return false;
      }
    };
   
    $rootScope.login = function () {

      // initial values
      $rootScope.error    = false;
      $rootScope.disabled = true; 
      // $rootScope.isLoading = true;

      if($rootScope.checkFields()){
         
       var promisse =  AuthService.login($scope.loginForm.username, $scope.loginForm.password);
          promisse.then(function success(logged){
            if(logged){
              console.log($cookies.getObject("logged"));
             return   $location.path('/');
            }
          }, function error(erro){
              $rootScope.error = true;
              $rootScope.errorMessage = erro;
          });

      }else{
        $rootScope.error = true;
        $rootScope.errorMessage = "Preencha os campos para prosseguir"; 
      }

    };  
 

}]);
 
