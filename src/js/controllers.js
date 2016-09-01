
//================================================
//# App Controllers
//================================================

/***********************
  Main
************************/

quest.controller('mainController', ['$rootScope', '$scope', '$location', 'AuthService', 'BoardService',
  function ($rootScope, $scope, $location, AuthService, BoardService) {

    $rootScope.isLoading = false;
    $rootScope.activePage   = $location.path(); 
    $rootScope.userActive   = false;
    $rootScope.question     = false;
    $rootScope.special      = false;
    $rootScope.currentLevel = null;
    $rootScope.currentScore = null;
    $rootScope.levels       = [];
    $rootScope.score        = BoardService.getScore();
    $rootScope.boardData    = BoardService.getBoardData();

    $rootScope.activeHouse   = 0;
    $rootScope.score         = 0;
    $rootScope.answer        = 0;
    $rootScope.correctAnswer = 0;
    $rootScope.isQuestion = false; 

    $rootScope.go = function (route) {
      $location.path(route);
    };

    $rootScope.$watch('isQuestion', function(){
      console.log($rootScope.isQuestion);
    });

}]);

/***********************
  Login
************************/

quest.controller('loginController',
  ['$rootScope', '$scope', '$location', '$http','AuthService',
  function ($rootScope, $scope, $location, $http, AuthService) {
    $rootScope.isLoading = false;

    $rootScope.userActive = false;

    $scope.login = function () {

      // initial values
      $rootScope.error = false;
      $rootScope.disabled = false;

      // $http.post('/auth/login', {username: req.body.username, password: req.body.password});

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password) 

    };

}]);

/***********************
  Logout
************************/
quest.controller('logoutController',
  ['$rootScope', '$scope', '$location', 'AuthService',
  function ($rootScope, $scope, $location, AuthService) {
    $rootScope.isLoading = false;

    $rootScope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $rootScope.userActive = false;
          $location.path('/login');
        });

    };

}]);

/***********************
  Register
************************/

quest.controller('registerController',
  ['$rootScope', '$scope', '$location', 'AuthService',
  function ($rootScope, $scope, $location, AuthService) {
    $rootScope.isLoading = false;

    $rootScope.register = function () {

      // initial values
      $rootScope.error = false;
      $rootScope.disabled = false;
      $rootScope.userActive = false;

      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/login');
          $rootScope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $rootScope.error = true;
          $rootScope.errorMessage = "Something went wrong!";
          $rootScope.disabled = false;
          $scope.registerForm = {};
        });

    };

}]);