'use strict';

/* User Controllers */

angular.module('Forum.userCtrl', [])

 //User controller
  .controller('UserCtrl', ['HttpServices', '$scope', '$rootScope', '$location', function(HttpServices, $scope, $rootScope, $location){
    var path = '';
    //User information
    $scope.user = {};
    //User input 
    $scope.loginInput = {};
    var msg = null;
    var error = null;
    //$scope.msg = UserService.getMsg;
    //$scope.userName = UserService.getUser;
    //register function
    $scope.register = function(){
      //start register service
      path = 'auth/register';
      HttpServices.post(path, $scope.user).then(function(response){
        if(response['data']['registerResponse']){
          $scope.msg = function(){
            return 'You can now login!';
          }
        }else{
           $scope.error = function(){
            return 'Username is allready taken!';
           }
          }
        
      })
    }

    //Login function
    $scope.login = function(){
      var userName = null;
      path = 'auth/login'
      //Start login service
      HttpServices.post(path, $scope.loginInput).then(function(response){
        if(response['data']['loginResponse']){
          userName = response['data']['loginResponse'];
          $rootScope.$broadcast('menuGet');
          $location.path('/home');
        }else{
          $scope.msg = function(){
            return 'There has been a error with your information!';
          }
        }

      })
    }

  }])

  //Logout controller
  .controller('LogoutCtrl', ['$scope', 'HttpServices', '$location', '$rootScope', function($scope, HttpServices, $location, $rootScope){
      var path = 'auth/logout'
      //Do a request to the server for lear the session
      HttpServices.get(path).then(function(){
        //Reset the event
        $rootScope.$broadcast('menuGet');
        //Send the user to the login/registartion page
        $location.path('/login');
      });
    
  }])

  .controller('ProfileCtrl', ['$scope', 'HttpServices',  '$location', 'ProfileService', function($scope, HttpServices, $location, ProfileService){
    $scope.profile = null;
    $scope.update = null;
    var path = 'auth/haveUser';
    HttpServices.get(path).then(function(data){
      if(!data['data']['authUserResponse']){
        $location.path('/login');
      }else{
        $scope.editProfile = function(){
            HttpServices.get(path).then(function(data){
              if(!data['data']['authUserResponse']){
              $location.path('/login');
            }else{
            
              if(!$scope.profile.oldPassword){
                $scope.update = 'You need to fill in your old password';
                return;
              }
              ProfileService.edit($scope.profile).then(function(response){
                if(!response){
                  $scope.update = 'Your old password is wrong';
                }else{
                  $scope.update = 'Your information has been updated';
                }
              })
            }
          })

        }
      }
    })

  }])