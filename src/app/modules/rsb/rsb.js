'use strict'

angular.module('swalk.myrsb', [])
    .controller('myrsb', ['$rootScope', '$scope', '$state', '$ionicViewSwitcher', '$ionicScrollDelegate', 'userService', '$timeout', function ($rootScope, $scope, $state, $ionicViewSwitcher, $ionicScrollDelegate, userService, $timeout) {
        $scope.inFrom = $state.params.type;
        $scope.$on('$ionicView.afterEnter', function () {
            userService.getABRsb().then(function (data) {
                $scope.rsbObj = data.list.data;
            })
            //用户Id
            $scope.userId = userService.userMess.userId;
            //获取荣盛币详细信息
            userService.rsbInfo(userService.userMess.userId).then(function (data) {
                if (data.list.errcode === 10000) {
                    var myd = data.list.data.rsCoinRecordList;
                    $scope.rsbRecord = myd;
                    for (var i = 0; i < $scope.rsbRecord.length; i++) {
                        if ($scope.rsbRecord[i].type == 'CZ') {
                            $scope.rsbRecord[i].money = ($scope.rsbRecord[i].money * 1.1).toFixed(2);
                        }
                    }
                }
            })
        })
        $rootScope.giftRsb = {};
        $scope.nowStatus = 'noDeadLine';
        $scope.rsbDate;
        $scope.rsbRecord;
        $scope.isInApp = appType;
        $scope.checkStatus = function (val) {
            if ($scope.nowStatus === val) {
                return;
            }
            $scope.nowStatus = val;
            $ionicScrollDelegate.scrollTop(true);
        }
        //购买荣盛币
        $scope.buyRsb = function () {
            $state.go('buyrsb', {});
            $ionicViewSwitcher.nextDirection('forward');
        }

        $scope.explain = function () {
            $state.go('explain', {});
            $ionicViewSwitcher.nextDirection('forward');
        }
        //赠与荣盛币
        $scope.togiftRsb = function (type, value) {
            if (value === 0) {
                $scope.alertTab('您荣盛币余额为0');
                return;
            }

            if (!value) {
                $scope.alertTab('网络故障稍后再试');
                return;
            }

            userService.modifyPassword(userService.userMess.userId).then(function(data){
                if(data.list.errcode==10000){
                    $rootScope.giftRsb.type = type;
                    if (type === 'A') {
                        $rootScope.giftRsb.money = value;
                    }
                    if (type === 'B') {
                        $rootScope.giftRsb.money = value.balance;
                        $rootScope.giftRsb.isId = value.isId;
                    }
                    $state.go('giftrsb', {});
                    $ionicViewSwitcher.nextDirection('forward');
                }else if(data.list.errcode==40002){
                    $rootScope.modifyPassword='rsb-give';
                    $scope.alertTab(data.list.message,modifyPassword);
                }
            })

            function modifyPassword(){
                $state.go('identity',{'memery':'forget'});
                $ionicViewSwitcher.nextDirection('forward');
            }
        }

        $scope.rsbGoback = function () {
            if ($scope.inFrom == 'rsb-buy') {
                $state.go('tabs.mine', {});
                $ionicViewSwitcher.nextDirection('back');
            } else {
                $scope._goback(-1);
            }
        }

        //app端购买荣盛币
        $scope.toBuyRsb = function () {
            var params = {userId: userService.userMess.userId};
            connectWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler('openPay', params, function (response) {
                    console.log(response);
                })
            })
        }
    }])
