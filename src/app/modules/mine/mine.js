'use strict'

angular.module('tab.mine',[])
    .controller('mineCtrl', ['$rootScope','$scope','$state','$http','$ionicViewSwitcher','$ionicModal','$ionicHistory','$ionicScrollDelegate','$ionicActionSheet','userService', function($rootScope,$scope,$state,$http,$ionicViewSwitcher,$ionicModal,$ionicHistory,$ionicScrollDelegate,$ionicActionSheet,userService) {
        $scope.$on('$ionicView.beforeEnter',function(){
            $scope.userInfo=userService.userMess;
            $ionicHistory.clearHistory();
            $scope.hideTabBar('show');
        });
        connectWebViewJavascriptBridge(function (bridge) {
            bridge.registerHandler('userLoginInfoMsg', function (data) {
                userService.userMess = data;
                $scope.userInfo=userService.userMess;
                $scope.$digest();
            })
        });

        $scope.mineInfo=function(){
            if($rootScope.netBreak){
                $scope.alertTab('请检查网络');
                return;
            }
            if(userService.userMess&&userService.userMess.accountId){
                $scope.showUserInfo();
            }else{
                $scope.indexShowModelBackground();
                $scope.showLoginPanel();
                //$scope.showSheet();
            }
        }

        //去登录
        $scope.mineLogin=function(){
            if($rootScope.netBreak){
                $scope.alertTab('请检查网络');
                return;
            }
            $state.go('login',{ragion:'mine'});
            $ionicViewSwitcher.nextDirection('forward');
        }

        //获取用户信息
        $scope.showUserInfo=function(){
            if($rootScope.netBreak){
                $scope.alertTab('请检查网络');
                return;
            }
            $state.go('userinfo',{});
            $ionicViewSwitcher.nextDirection('forward');
        }

        //去注册
        $scope.toRegister=function(){
            if($rootScope.netBreak){
                $scope.alertTab('请检查网络');
                return;
            }
            $state.go('register',{operation:1});
            $ionicViewSwitcher.nextDirection('forward');
        }

        $scope.showSheet=function(){
            var hideSheet=$ionicActionSheet.show({
                buttons:[
                    {text:'登录'},
                    {text:'<span style="background-color: green;color: green">1注册</span>'}
                ],
                titleText:'<span style="background-color: green !important;">22222222</span>',
                buttonClicked:function(index){
                    if(index==0){
                        $scope.mineLogin();
                    }else{
                        $scope.toRegister();
                    }
                    /*var data={type:index};
                    connectWebViewJavascriptBridge(function (bridge) {
                        //回app
                        bridge.callHandler('modifyAvatar', data, function (response) {
                        })
                    });*/
                    return true;
                }
            })
        }

        /*$ionicModal.fromTemplateUrl('./app/modules/mine/model.test.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal
        })
        $scope.openModal = function() {
            $scope.modal.show();
            $scope.showSheet();
        }
        $scope.closeModal = function() {
            console.log('7777777777777777');
            $scope.modal.hide();
        };
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });*/

        //反馈记录
        $scope.helpFeedback=function(){
            var timestamp=$scope.getTimeStamp();
            $state.go('helpAnFeed',{timestamp:timestamp});
            $ionicViewSwitcher.nextDirection('forward');
        }

        //历史记录
        $scope.historyRecord=function(){
            if(userService.userMess&&userService.userMess.accountId){
                $state.go('history',{});
                $ionicViewSwitcher.nextDirection('forward');
            }else{
                $scope.indexShowModelBackground();
                $scope.showLoginPanel();
                return;
            }

        }

        //设置
        $scope.toSet=function(){
            if($rootScope.netBreak){
                $scope.alertTab('请检查网络');
                return;
            }
            $state.go('set',{});
            $ionicViewSwitcher.nextDirection('forward');
        }
    }])