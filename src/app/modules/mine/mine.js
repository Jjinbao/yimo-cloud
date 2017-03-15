'use strict'

angular.module('tab.mine',[])
    .controller('mineCtrl', ['$scope','$state','$http','$ionicViewSwitcher','$ionicHistory','$ionicScrollDelegate','userService', function($scope,$state,$http,$ionicViewSwitcher,$ionicHistory,$ionicScrollDelegate,userService) {


        $scope.$on('$ionicView.beforeEnter',function(){
            $scope.userInfo=userService.userMess;
        })
        /*$http({
            url:'/ym/account/register.api',
            method:'POST',
            params:{
                phone:phone,
                password:md5(password),
                sign:sign
            }
        }).success(function(data){
            console.log(data);
        })*/
        /*$http({
            url:'/ym/account/login.api',
            method:'POST',
            params:{
                phone:phone,
                password:md5(password),
                sign:sign
            }
        }).success(function(data){
            console.log(data);
        })*/

        $scope.mineInfo=function(){
            if(userService.userMess&&userService.userMess.accountId){

            }else{
                $scope.mineLogin();
            }
        }

        $scope.mineLogin=function(){
            $state.go('login',{});
            $ionicViewSwitcher.nextDirection('forward');
        }
    }])