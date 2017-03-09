'use strict'

angular.module('swalk.identity', [])
    .controller('identity', ['$rootScope', '$scope', '$interval', '$state', '$stateParams', '$ionicViewSwitcher', 'userService', '$location',
        function ($rootScope, $scope, $interval, $state, $stateParams, $ionicViewSwitcher, userService, $location) {
            $scope.identityType = $stateParams.memery;
            $scope.identity = {
                code: ''
            };

            $scope.pwd = {}
            $scope.btnStyle = {};
            $scope.$on('$ionicView.afterEnter', function () {
                if ($stateParams.from) {
                    $rootScope.modifyPassword = 'never-modity';
                    connectWebViewJavascriptBridge(function (bridge) {
                        bridge.callHandler('getUserLoginMsg', null, function (res) {
                            $scope.userPhone = res.phone;
                            userService.userMess.phone = res.phone;
                            userService.userMess.token = res.token;
                            userService.userMess.userId = res.userId;
                        });
                    });
                } else {
                    $scope.userPhone = userService.userMess.phone;
                }
            })


            $scope.$watchCollection('identity', function (val) {
                try {
                    if (val.code.toString().length === 6) {
                        $scope.btnStyle = {
                            'background-color': 'orange'
                        }
                    } else {
                        $scope.btnStyle = {
                            'background-color': 'darkgrey'
                        }
                    }
                } catch (error) {

                }

            })

            $scope.canSend = true;
            $scope.countTime = 60;
            $scope.buttonName = '获取验证码';
            var intervalId = '';
            $scope.colorObj = {
                'color': 'orange'
            }
            //获取修改支付密码验证码
            $scope.sendCode = function () {
                if (!$scope.canSend) {
                    return;
                }
                $scope.canSend = false;
                userService.sendPayCode(userService.userMess.phone).then(function (data) {
                    console.log('获取到验证码的信息是：',data);
                    if (data.list.errcode === 10000) {
                        $scope.colorObj = {
                            'color': 'darkgray'
                        }

                        intervalId = $interval(function () {
                            if ($scope.countTime > 1) {
                                $scope.buttonName = (--$scope.countTime) + '秒后获取';
                            } else {
                                $interval.cancel(intervalId);
                                $scope.countTime = 60;
                                $scope.buttonName = '重新发送';
                                $scope.canSend = true;
                                $scope.colorObj = {
                                    'color': 'orange'
                                }
                            }
                        }, 1000);
                    }
                })
            }

            //检验用户验证码是否正确
            $scope.checkIdentyCode = function () {
                if ($scope.identity.code && $scope.identity.code.toString().length === 6) {
                    userService.checkPayCode(userService.userMess.phone, $scope.identity.code)
                        .then(
                        function (data) {
                            if (data.list.errcode != 10000) {
                                $scope.alertTab(data.list.message);
                            } else {
                                userService.massageCode = $scope.identity.code;
                                $scope.toReset();
                            }
                        },
                        function (error) {

                        }
                    )
                }
            }

            //验证用户支付密码是否正确
            $scope.checkPayPwd = function () {
                userService.checkPayPwd(userService.userMess.phone, $scope.pwd.val)
                    .then(
                    function (data) {
                        if (data.list.errcode != 10000) {
                            $scope.alertTab(data.list.message);
                        } else {
                            userService.oldPwdValue = $scope.pwd.val;
                            $scope.toReset();
                        }
                    },
                    function (error) {

                    }
                )

            }
            //去修改支付密码页面
            $scope.toReset = function () {
                $state.go('reset', {memery: $scope.identityType});
                $ionicViewSwitcher.nextDirection('forward');
            }

            $scope.goback = function () {
                if ($rootScope.modifyPassword == 'never-modity') {
                    $rootScope.modifyPassword == ''
                    connectWebViewJavascriptBridge(function (bridge) {
                        bridge.callHandler('closeModifyPage', null, function (res) {

                        });
                    });
                } else {
                    $rootScope.modifyPassword = '';
                    $scope._goback(-1);
                }

            }

            $scope.$on('android.modifypassword.backbtn', function () {
                $rootScope.modifyPassword == ''
                connectWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('closeModifyPage', null, function (res) {

                    });
                });
            })

            $scope.$on('$destroy', function (evt) {
                if (intervalId) {
                    $interval.cancel(intervalId);
                }
            })
        }])
