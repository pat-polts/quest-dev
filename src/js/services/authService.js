
/*********************
  AuthService
**********************/

quest.factory('AuthService', ['$rootScope', '$q', '$timeout', '$http','$cookies', '$location', 
  function ($rootScope, $q, $timeout, $http, $cookies, $location) {

      var user          = null; 
      var userAuth      = {}; 
      var hour          = 3600000
      var exp           = new Date(Date.now() + hour);
      var cookieOptions = {expires: exp, httpOnly: true}; 
 
 /******************************************************
 # AuthService.login()
 # loga usuario
 ******************************************************/
      userAuth.login = function (username, password) {   
        var deferred    = $q.defer();

        var credentials = {login: username, senha: password }; 
        $rootScope.isLoading = true;
        $http.post('/auth/login', credentials)
          .then(function success(res){ 
            $rootScope.isLoading = false;
            if(res.status === 200){
              // console.log(res);
              if(res.data.logged){
                $cookies.putObject('logged', true, cookieOptions);
                if($cookies.getObject('logged')){
                  deferred.resolve(res.data.logged);
                }
              }
            }

          }, function error(res){
            $rootScope.isLoading = false; 
            $rootScope.error = true; 
            $rootScope.errorMessage = "Erro inesperado!";  

            if(res.status === 500){
              // console.log(res);
              if(res.data.error){
                $cookies.putObject('logged', false);
                deferred.reject(res.data.error);
              }
            }
          });       

          return deferred.promise;
      }; 

 /******************************************************
 # AuthService.logged()
 # verifica se existe usuário
 ******************************************************/
     userAuth.logged = function(){ 

        var deferred = $q.defer();

        $http.get('/auth/status')
        .then(function success(res){ 
            if(res.status === 200){
            
               deferred.resolve(res.data.logged);
              
            } 
        }, function error(res){
          if(res.data.error){           
            $rootScope.setErro = res.data.error;
            deferred.reject(res.data.error);
          }
        });     

        return deferred.promise;

      };

      userAuth.logout = function(){ 
    
          $cookies.remove('user');
          $cookies.remove('logged');
         
      };
 
 
 
    return userAuth;

}]); //AuthService ends