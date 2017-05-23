'use strict'
angular.module('tab.home', [])
    .controller('homeCtrl', ['$rootScope', '$scope', '$ionicSlideBoxDelegate', '$state', 'userService', '$ionicHistory', '$ionicViewSwitcher', '$http', '$location', function ($rootScope, $scope, $ionicSlideBoxDelegate, $state, userService, $ionicHistory, $ionicViewSwitcher, $http, $location) {
        console.log('我的应用');
        $scope.toAddApp = function () {
            $state.go('addapp', {});
        }

        connectWebViewJavascriptBridge(function (bridge) {
            //回app
            bridge.callHandler('getAddedApp', null, function (response) {
                $scope.appList=response;
            })
        });

        connectWebViewJavascriptBridge(function (bridge) {
            //回app
            bridge.registerHandler('setAddedApp', function (res) {
                $scope.appList=res
            })
        });

        //应用列表
        // $scope.appList;
        // $http({
        //     url: 'ym/app/list.api',
        //     method: 'POST'
        // }).success(function (data) {
        //     console.log(data);
        //     $scope.appList=data.list;
        // })

        $scope.deleteApp=function(val){
            console.log(val);
            var delApp={appId:val.appId};
            connectWebViewJavascriptBridge(function (bridge) {
                //回app
                bridge.callHandler('setAddedApp',delApp, function (res) {
                    $scope.appList=res
                })
            });
        }
        $scope.openApplication=function(val){
            var openApp={appId:val.appId};
            connectWebViewJavascriptBridge(function (bridge) {
                //回app
                bridge.callHandler('openApplication',openApp, function (res) {

                })
            });
        }

    }])
    .controller('addApp', ['$rootScope', '$scope', '$http', 'userService', '$state', '$ionicViewSwitcher', function ($rootScope, $scope, $http, userService, $state, $ionicViewSwitcher) {

        //应用列表
        $scope.appList;
        $http({
            url: 'ym/app/list.api',
            method: 'POST'
        }).success(function (data) {
            console.log(data);
            $scope.appList=data.list;
        })

        $scope.backApp=function(){
            connectWebViewJavascriptBridge(function (bridge) {
                //回app
                bridge.callHandler('backToApp', null, function (response) {

                })
            });
        }
        $scope.addOneApp=function(val){
            console.log(val);
            connectWebViewJavascriptBridge(function (bridge) {
                //回app
                bridge.callHandler('addApplication', null, function (response) {

                })
            });
            for(var i=0;i<$scope.appList.length;i++){
                if($scope.appList[i].appId==val.appId){
                    $scope.appList.del(i);
                    break;
                }
            }
        }
    }])
