'use strict'

angular.module('swalk.login', [])
    .controller('userLogin', ['$rootScope','$scope','$http','$interval','$state','$ionicViewSwitcher','userService','$ionicHistory','$stateParams','$location',
        function ($rootScope,$scope,$http,$interval,$state,$ionicViewSwitcher,userService,$ionicHistory,$stateParams,$location) {
            $scope.$on('$ionicView.beforeEnter',function(){
                $scope.hideTabBar('hide');
            })
            $scope.userInfo={
                name:'',
                password:''
            }

            $scope.chearName=function(){
                $scope.userInfo.name='';
            }
            $scope.chearPassword=function(){
                $scope.userInfo.password='';
            }
            $scope.toLogin=function(){
                $http({
                    url:urlStr+'ym/account/login.api',
                    method:'POST',
                    params:{
                        phone:$scope.userInfo.name,
                        password:md5($scope.userInfo.password),
                        sign:md5('ymy'+md5($scope.userInfo.password)+$scope.userInfo.name)
                    }
                }).success(function(data){
                    console.log(data);
                    data.realPassword=$scope.userInfo.password;
                    if(data.result==1){
                        userService.userMess=data;
                      if($stateParams.ragion=='mine'){
                        connectWebViewJavascriptBridge(function (bridge) {
                          //回app
                          bridge.callHandler('userMessage', data, function (response) {

                          })
                        });
                      }else if($stateParams.ragion=='commont'){
                          connectWebViewJavascriptBridge(function (bridge) {
                              //回app
                              bridge.callHandler('userMessage', data, function (response) {

                              })
                          });
                          $location.path($rootScope.isDetailLogin.url);
                          $ionicViewSwitcher.nextDirection('back');
                      }else{
                          $scope._goback(-1);
                      }

                        //$scope.back();
                    }else if(data.result==102){
                        $scope.alertTab('手机号输入错误');
                    }else if(data.result==103){
                        $scope.alertTab('手机号未注册');
                    }else if(data.result==104){
                        $scope.alertTab('账号封停,1小时后重试');
                    }else if(data.result==105){
                        $scope.alertTab('密码错误');
                    }else if(data.result==106){
                        $scope.alertTab('系统错误，稍后重试');
                    }

                }).error(function(){
                    $scope.alertTab('网络异常,请检查网络');
                })
            }

            $scope.toRegister=function(){
                $state.go('register',{operation:3});
                $ionicViewSwitcher.nextDirection('forward');
            }

            $scope.toModify=function(){
                $state.go('register',{operation:2});
                $ionicViewSwitcher.nextDirection('forward');
            }

            $scope.back=function(){
                if($rootScope.isDetailLogin&&$rootScope.isDetailLogin.flag&&$rootScope.isDetailLogin.flag=='infoDetail'){
                    $location.path($rootScope.isDetailLogin.url);
                    $ionicViewSwitcher.nextDirection('back');
                }
                if($stateParams.ragion=='reg'||$stateParams.ragion=='setPassword'){
                  connectWebViewJavascriptBridge(function (bridge) {
                    //回app
                    bridge.callHandler('backToApp', null, function (response) {

                    })
                  });
                    // $state.go('tabs.mine',{});
                    // $ionicViewSwitcher.nextDirection('back');
                }else if($stateParams.ragion=='mine'){
                  connectWebViewJavascriptBridge(function (bridge) {
                    //回app
                    bridge.callHandler('backToApp', null, function (response) {

                    })
                  });
                }else{
                    $scope._goback(-1);
                }
                // $state.go('tabs.mine',{})
                // $ionicViewSwitcher.nextDirection('back');
            }
        }])
