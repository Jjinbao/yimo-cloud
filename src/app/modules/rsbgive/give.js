'use strict'

angular.module('swalk.rsbgift', [])
    .controller('giftrsb', ['$rootScope', '$scope', '$state', '$ionicViewSwitcher', 'userService', function ($rootScope, $scope, $state, $ionicViewSwitcher, userService) {
        $scope.$on('$ionicView.beforeEnter', function () {
            /*if(appType===1){
             connectWebViewJavascriptBridge(function (bridge) {
             //回app
             bridge.callHandler('canGoBack', 2, function (response) {
             console.log(response);
             })
             });
             }*/
        })
        if (!$rootScope.giftRsb) {
            $state.go('rsb')
        }
        //接受信息
        $scope.giveInfo = {
            phone: '',
            money: '',
            userId: ''
        };

        //检查用户手机号
        $scope.phoneTip = '';
        $scope.$watch('giveInfo.phone', function (val) {
            if (val && val.length === 11) {
                checkPhone(val);
            } else {
                $scope.phoneTip = '';
            }
        });

        //校验手机号
        function checkPhone(val) {
            var phoneReg = /^1[3|5|7|8]\d{9}$/;
            if (!phoneReg.exec(val)) {
                $scope.phoneTip = '请输入正确的手机号';
                //$scope.giveInfo.phone = '';
                return;
            }else if(val==userService.userMess.phone){
                $scope.phoneTip = '不能赠与自己';
                //$scope.giveInfo.phone = '';
                return;
            }else {
                remotePhone(val);
            }
        }

        function remotePhone(phone) {
            userService.checkGiftPhone(phone).then(function (data) {
                if (data.list.errcode === 10000) {
                    $scope.giveInfo.userId = data.list.data;
                } else {
                    $scope.phoneTip = '手机号未注册盛行天下';
                }
            })
        }

        //检查用户荣盛币对比
        $scope.moneyTip = '';
        $scope.$watch('giveInfo.money', function (value) {
            if (!value) {
                return;
            }
            if (isNaN(value)) {
                $scope.moneyTip = '请输入正确的数字';
                $scope.giveInfo.money = '';
            } else {
                if (value == 0) {
                    $scope.moneyTip = '赠与金额不能为0';
                    $scope.giveInfo.money = '';
                } else if (eval(value) > eval($rootScope.giftRsb.money)) {
                    $scope.moneyTip = '荣盛币余额不足';
                    $scope.giveInfo.money = '';
                } else {
                    $scope.moneyTip = '';
                }
            }
        });
        $scope.backrsb = function () {
            $state.go('rsb', {});
            $ionicViewSwitcher.nextDirection('back');
        };
        $scope.togive = function () {
            if (!$scope.phoneTip) {

            }
            if (!$scope.moneyTip) {

            }
            $rootScope.giveInfo = $scope.giveInfo;
            $state.go('ensureGive', {});
            $ionicViewSwitcher.nextDirection('forward');
        };
    }])