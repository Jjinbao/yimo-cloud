'use strict'

angular.module('swalk.login', [])
    .controller('userLogin', ['$scope','$http','$interval','$state','$ionicViewSwitcher','userService','$ionicHistory',
        function ($scope,$http,$interval,$state,$ionicViewSwitcher,userService,$ionicHistory) {
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
                    if(data.result==1){
                        userService.userMess=data;
                        connectWebViewJavascriptBridge(function (bridge) {
                            //回app
                            bridge.callHandler('userMessage', data, function (response) {

                            })
                        });
                        $scope.back();
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

                })
            }

            $scope.toRegister=function(){
                $state.go('register',{operation:1});
                $ionicViewSwitcher.nextDirection('forward');
            }

            $scope.toModify=function(){
                $state.go('register',{operation:2});
                $ionicViewSwitcher.nextDirection('forward');
            }

            $scope.back=function(){
                $state.go('tabs.mine',{})
                $ionicViewSwitcher.nextDirection('back');
            }
        }])
