'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

  //The home controller
  .controller('HomeCtrl', ['$scope', 'UserService', function($scope, UserService) {
    UserService.checkUser();
    $scope.$on("menuGet",function() {
      $scope.userName = UserService.getUser();
    })
    $scope.userName = UserService.getUser();

  }])



  //The menu Controller
  .controller('MenuCtrl', ['$http', '$scope', function($http, $scope){

    // initial menu (logged in or not)
    $http.get('../server/menu/getMain').success(function(data){
      //Set the menu data to scope menu, access the data with {{menu}} in index.html
      $scope.mainMenu = data['mainMenuResponse'];
    });

    // Look if the event is set, if it is. then load the new menu (it sets when you login)
    $scope.$on("menuGet",function() {
      //DO a server request to get the menu
      $http.get('../server/menu/getMain').success(function(data){
        //Set the menu data to $scope.menu
        $scope.mainMenu = data['mainMenuResponse'];
      });
    });
    
    
  }])

  //User controller
  .controller('UserCtrl', ['UserService', '$scope', '$rootScope', function(UserService, $scope, $rootScope){

    //User information
    $scope.user = {};
    //User input 
    $scope.loginInput = {};
    $scope.msg = UserService.getMsg;
    //$scope.userName = UserService.getUser;
    //register function
    $scope.register = function(){
      //start register service
      UserService.register($scope.user);
    }

    //Login function
    $scope.login = function(){
      //Start login service
      UserService.login($scope.loginInput);
    }

  }])

  //Logout controller
  .controller('LogoutCtrl', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope){
      //Do a request to the server for clear the session
      $http.get('../server/auth/logout').success(function(){
        //Reset the event
        $rootScope.$broadcast('menuGet');
        //Send the user to the login/registartion page
        $location.path('/login');
      });
    
  }])

  .controller('ProfileCtrl', ['$scope', 'ProfileService', function($scope, ProfileService){
    $scope.profile = null;
    $scope.editProfile = function(){
      ProfileService.edit($scope.profile);
    }
  }])

  //The controller that gets all the categories
  .controller('CategoryCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    $scope.categories = {};
    $scope.topic = {};
    //The server request
    $http.get('../server/menu/getCategories').success(function(data){
      //Put all the categories in the variable categories
      $scope.categories = data['categoryMenuResponse'];
    });

  }])

  //The controller that gets all the topics in a category
  .controller('TopicCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    //Check if a category is set
    if($routeParams['category']){
      var category = {'category': $routeParams['category']};
      //If it is set then do a server request to get all the topics that belongs to that category
      $http.post('../server/topic/getList', category).success(function(data){
       $scope.topics = data['getTopicListResponse'];
       $scope.topicHref = $routeParams['category'];
      })
    }
  }])

  //The controlelr that gets all the post that belongs to a topic
  .controller('PostCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    //Check if a topic is set
    if($routeParams['topic']){
      //Prepare a variable for the server request
      var params = {};
      //Put in topic name params
      params.categoryName = $routeParams['category'];
      //Put in post id to params
      params.topicId = $routeParams['topic'];
      //If it is set then do a server request to get all posts that belongs to that topic
      $http.post('../server/post/getAll', params).success(function(data){
        console.log(data['getAllPostsResponse']);
        $scope.posts = data['getAllPostsResponse']['posts'];
        $scope.topic = data['getAllPostsResponse']['topic'];
      })
    }
  }])


 

