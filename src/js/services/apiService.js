
/*********************
  UserService
**********************/

quest.factory('ApiService', ['$rootScope', '$q', '$timeout', '$http', '$location', 'AuthService',
  function ($rootScope, $q, $timeout, $http, $location, AuthService) {

    var userApi = {};

    userApi.getUserData = function(){  

      var deferred = $q.defer(); 
      $http.get('/api/user')
        .then(function success(res){    
            if(res.status === 200){ 
              if(res.data.obj){ 

                deferred.resolve(res.data.obj);
              }
            } 
           
        }, function error(res){  
            if(res.status === 500){
              if(res.data.error){ 
                $rootScope.error        = true; 
                $rootScope.errorMessage = res.data.error;  

                deferred.reject(res.data.error);
              }
            }
        });

        return deferred.promise; 
    };
 

    userApi.getQuestionData = function(q){ 

      var deferred = $q.defer(); 
      if(q){
        $http.get('/api/question/'+q)
          .then(function success(res){    

              if(res.status === 200){ 
                if(res.data.obj){ 
                  deferred.resolve(res.data.obj);
                }
              } 
             
          }, function error(res){ 
              if(res.status === 500){
                if(res.data.error){ 
                  $rootScope.error = true; 
                  $rootScope.errorMessage = res.data.error;  
                  deferred.reject(res.data.error);
                }
              }
          });
      }

      return deferred.promise; 
    };

    userApi.getQuestions = function(){ 

      var deferred = $q.defer();  
     
        $rootScope.isLoading = true;  
        $http.get('/api/questions')
          .then(function success(res){   
              if(res.status === 200){ 
                if(res.data.obj.length !== 0){ 
                 $rootScope.isLoading = false;   
                  deferred.resolve(res.data.obj);
                }
              } 
             
          }, function error(res){ 
                 $rootScope.isLoading = false;  

              if(res.status === 500){ 
                if(res.data.error){ 
                  $rootScope.error = true; 
                  $rootScope.errorMessage = res.data.error;  
                  deferred.reject(res.data.error);
                }
              }

          });
      

      return deferred.promise; 
    };
/*********************************************************
********* Grava questão simples e especiai E2 a E4 atualmente
*** passar numero = id pergunta valor = ultima respondida

*********************************************************/
    userApi.setQuestionData = function(id,last){ 

      var deferred = $q.defer(); 

      $rootScope.isLoading = true;
      if(id && last){
        $http.post('/api/question/',{numero: id, valor: last})
          .then(function success(res){   
              if(res.status === 200){ 
                if(res.data.ok){
                  $rootScope.isLoading = false;   
                   deferred.resolve(res.data.ok); 
                } 
                 
              } 
             
          }, function error(res){  
              if(res.status === 500){
                if(res.data.error){ 
                 $rootScope.isLoading = false;   
                  $rootScope.error = true; 
                  $rootScope.errorMessage = res.data.error;  
                  deferred.reject(res.data.error);
                }
              }
          });
      }else{
        console.log("pergunta nao enviada");
      }

      return deferred.promise; 
    };



    userApi.getQuestionE1 = function(){ 

      var deferred = $q.defer();  
     
        $http.get('/api/especial1')
          .then(function success(res){  
              if(res.status === 200){ 
                if(res.data.obj.length !== 0){  
                // console.log(res.data.obj);
                  deferred.resolve(res.data.obj);
                }
              } 
             
          }, function error(res){ 

              if(res.status === 500){ 
                if(res.data.error){ 
                  $rootScope.error = true; 
                  $rootScope.errorMessage = res.data.error;  
                  deferred.reject(res.data.error);
                }
              }

          });
      

      return deferred.promise; 
    };

    userApi.getQuestionE2 = function(){ 

      var deferred = $q.defer();  
     
        $http.get('/api/especial2')
          .then(function success(res){  
              if(res.status === 200){ 
                if(res.data.obj.length !== 0){  
                console.log("especial 2 "+res.data.obj);
                  deferred.resolve(res.data.obj);
                }
              } 
             
          }, function error(res){ 

              if(res.status === 500){ 
                if(res.data.error){ 
                  $rootScope.error = true; 
                  $rootScope.errorMessage = res.data.error;  
                  deferred.reject(res.data.error);
                }
              }

          });
      

      return deferred.promise; 
    };

    userApi.getRanking = function(){ 

      var deferred = $q.defer(); 

          $rootScope.isLoading  = true;
        $http.get('/api/ranking')
          .then(function success(res){  
              if(res.status === 200){  
                if(res.data.obj){
                  $rootScope.isLoading  = false;
                  deferred.resolve(res.data.obj); 
                }
              } 
             
          }, function error(res){ 
          $rootScope.isLoading  = false;
              if(res.status === 500){
                if(res.data.error){ 
                  $rootScope.error = true; 
                  $rootScope.errorMessage = res.data.error;  
                  deferred.reject(res.data.error);
                }
              }
          });
      

      return deferred.promise; 
    };
 
    return userApi;
 
}]);
