'use strict'

angular.module('swalk.setting',[])
    .controller('setting',['$rootScope','$scope','$state','$ionicViewSwitcher','userService',function($rootScope,$scope,$state,$ionicViewSwitcher,userService){
        $scope.$on('$ionicView.beforeEnter',function(){
            $scope.hideTabBar('hide');
        })
        $scope.clearCache=function(){

        }

      $scope.backApp=function(){
        connectWebViewJavascriptBridge(function (bridge) {
          //回app
          bridge.callHandler('backToApp', null, function (response) {

          })
        });
      }

        $scope.toLogin=function(){
            $state.go('login');
            $ionicViewSwitcher.nextDirection('forward');
        }

        $scope.resetPayPassword=function(){
            $rootScope.modifyPassword='';
            if(userService.userMess.userId){
                $state.go('changetype',{});
                $ionicViewSwitcher.nextDirection('forward');
            }else{
                $scope.toLogin();
            }
        }

        $scope.resetLoginPassword=function(){
            if(userService.userMess.userId){
                $state.go('loginpasswordtype',{});
                $ionicViewSwitcher.nextDirection('forward');
            }else{
                $scope.toLogin();
            }
        }

        $scope.evaluate=function(){
            connectWebViewJavascriptBridge(function (bridge) {
                //回app
                bridge.callHandler('evaluateApp', null, function (response) {

                })
            });
        }

        $scope.userProtocol=function(){
            $state.go('agreement',{});
            $ionicViewSwitcher.nextDirection('forward');
        }

        $scope.about=function(){
            $state.go('about',{});
            $ionicViewSwitcher.nextDirection('forward');
        }
        $scope.connectUs=function(){
            $state.go('contact',{});
            $ionicViewSwitcher.nextDirection('forward');
        }
    }])
