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
                        $scope.back();
                    }else{
                        $scope.alertTab('用户名或密码错误');
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
