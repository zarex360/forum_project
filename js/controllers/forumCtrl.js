'use strict';

/* Controllers */

angular.module('Forum.forumCtrl', [])

//The controller that gets all the categories
  .controller('CategoryCtrl', ['$scope', 'HttpServices', function($scope, HttpServices){
    var path = 'category'
    //The server request
    HttpServices.get(path).then(function(response){
      $scope.categories = response['data']['categoryResponse'];
    });

  }])

  //The controller that gets all the topics in a category
  .controller('TopicCtrl', ['$scope', '$location', '$rootScope', '$http', '$routeParams', 'HttpServices', function($scope, $location, $rootScope, $http, $routeParams, HttpServices){
    //Check if a category is set
    if($routeParams['category']){
      var category = {'category': $routeParams['category']};
      var path = '';
      $rootScope.category = $routeParams['category'];
      path = 'topic/' + $routeParams['category'];
      //If it is set then start a service to get all topics
      HttpServices.get(path).then(function(response){
        $scope.topics = response['data']['topicResponse'];
        $scope.topicHref = $routeParams['category'];
      })
    }
    if($location.path() == '/create_topic'){
      HttpServices.get('auth/haveUser').then(function(response){
        var user = response['data']['authUserResponse'];
        if(!user){
          $location.path('/login');
        }
      })
    }

      HttpServices.get('category').then(function(response){
        $scope.categoryList = response['data']['categoryResponse'];
      });
      console.log($rootScope.category);
      
    $scope.createTopic = function(){
      var response;
      var topic = {};
      topic.catId = $scope.topicCreate['category'];
      topic.title = $scope.topicCreate['title'];
      topic.text = $scope.topicCreate['text'];
      HttpServices.get('auth/haveUser').then(function(response){
        topic.user = response['data']['authUserResponse'];
        if(!topic.user){
          console.log('not logged in');
        }else{
          HttpServices.post('topic/create', topic).then(function(response){

          });
        }
      })
    };
    
  }])

  //The controlelr that gets all the post that belongs to a topic
  .controller('PostCtrl', ['$route', '$scope', '$http', '$routeParams', 'HttpServices', 'UserService', '$location', function($route, $scope, $http, $routeParams, HttpServices, UserService, $location){
    //Check if a topic is set
    if($routeParams['topic']){
      //Prepare a variable for the server request
      var params = {};
      //Put in topic name params
      params.categoryName = $routeParams['category'];
      //Put in post id to params
      params.topicId = $routeParams['topic'];
      //If it is set then do a server request to get all posts that belongs to that topic

      //Start the serveice function to get all post in a topic
      HttpServices.get('topic/' + $routeParams['category'] + '/' + $routeParams['topic']).then(function(response){
        if(response['data']['topicResponse'] == false){
          $location.path('/404');
        }
        $scope.topic = response['data']['topicResponse'][0];
      });
      HttpServices.get('topic/' + $routeParams['topic']).then(function(response){
        console.log(response['data']['topicResponse']);
        $scope.posts = response['data']['topicResponse'];
      })
    }

    $scope.comment = function(){
      var comment = {};
      comment.topicId = $routeParams['topic'];
      comment.post = $scope.post['comment'];
      UserService.haveUser().then(function(user){
        comment.user = user['data']['authUserResponse'];
        if(!comment.user){
          $location.path('/login');
        }else{
          HttpServices.post('topic/comment', comment).then(function(response){
            if(response){
              console.log(response);
              $route.reload();
            }
          });
        }
      })
      

    }

  }])