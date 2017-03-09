'use strict';
angular.module('swalk.suregift', [])
    .controller('suregive', ['$scope', '$state', '$ionicViewSwitcher', '$rootScope', 'userService',
        function ($scope, $state, $ionicViewSwitcher, $rootScope, userService) {
            if (!$rootScope.giveInfo) {
                $state.go('rsb')
            }
            $scope.windowValue = {
                mask: false,
                password: false
            }
            $scope.toMyrsb = function () {
                $state.go('rsb', {});
                $ionicViewSwitcher.nextDirection('back');

            };

            $scope.inputPassword = function () {
                if (!$scope.canClickPay) {
                    return;
                }
                openPayWindow();

            }

            function openPayWindow(){
                var money={money:$rootScope.giveInfo.money};
                connectWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('openPayWindow', money, function (response) {

                    });
                });
            }

            //荣盛币支付回调函数
            connectWebViewJavascriptBridge(function (bridge) {
                bridge.registerHandler('rsbPasswordValue', function (response) {
                    $scope.userPassword=response.password;
                    $scope.startIdentityPay();
                })
            });

            $scope.canclePassword = function () {
                $scope.windowValue = {
                    mask: false,
                    password: false
                }
                $state.go('giftresult', {'status': 1});
            }

            //用户点击确认支付按钮，开始校验
            $scope.userPassword = '';
            $scope.canClickPay = true;
            $scope.inputTimes = 3;
            $scope.startIdentityPay = function () {

                if (!$scope.canClickPay) {
                    return;
                }
                if (!$scope.userPassword || $scope.userPassword.length != 6) {
                    wrongStatus();
                    return;
                } else {
                    $scope.canClickPay = false;//阻止用户再次点击支付按钮
                    $scope.payRSB();
                }
            }

            function wrongStatus(code) {
                if (code === 3) {
                    $scope.alertTab('赠予金额大于可用金额');
                } else if (code === 2) {
                    $scope.alertTab('用户不存在');
                    toResultPage(1);
                } else if (code === 1) {
                    $scope.alertTab('数据错误，稍后再试');
                    toResultPage(1);
                } else {
                    $scope.inputTimes--;
                    if ($scope.inputTimes === 0) {
                        toResultPage(1);
                    }else{
                        $scope.alertTab('密码错误,您还可输入' + $scope.inputTimes + '次',openPayWindow);
                    }
                }
            }

            $scope.payRSB = function () {
                var postData = {
                    params: {
                        password: $scope.userPassword,
                        phone: $rootScope.giveInfo.phone,
                        toUserId: $rootScope.giveInfo.userId,
                        amount: ($rootScope.giveInfo.money * 100).toFixed(0),
                        userId: $rootScope.giftRsb.type === 'A' ? userService.userMess.userId : null,
                        isId: $rootScope.giftRsb.isId
                    }
                };
                userService.giftRsbApi(postData)
                    .then(function (res) {
                        if (res.list.errcode == 4) {   //支付密码错误
                            wrongStatus(4);
                        } else if (res.list.errcode == 3) {
                            wrongStatus(3);
                        } else if (res.list.errcode == 2) {
                            wrongStatus(2);
                        } else if (res.list.errcode == 1) {
                            wrongStatus(1);
                        } else if (res.list.errcode == 10000) {
                            toResultPage(0);
                        }
                        $scope.canClickPay = true;//阻止用户再次点击支付按钮
                    })

            }

            $scope.goback=function(){
                connectWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('closePayWindow', null, function (response) {

                    });
                });
                $scope._goback(-1);
            }

            function toResultPage(val) {
                $state.go('giftresult', {'status': val});
            }

        }])
    .controller('resultgive', ['$scope', '$stateParams', function ($scope, $stateParams) {
        $scope.resultType = $stateParams.status;

    }])
