'use strict'
angular.module('swalk.coupon', [])
    .controller('couponCtrl', ['$rootScope', '$scope', 'userService', '$state', '$ionicViewSwitcher', '$ionicScrollDelegate', '$timeout',
        function ($rootScope, $scope, userService, $state, $ionicViewSwitcher, $ionicScrollDelegate, $timeout) {
            $scope.totalCoupons;
            $scope.couponData = {
                count: 0,
                list: []
            };
            $scope.couponName = 0;
            $scope.showLoading = true;
            $scope.nowLoadingData = false;
            $scope.$on('$ionicView.beforeEnter', function () {
                /*if(appType===1){
                 connectWebViewJavascriptBridge(function (bridge) {
                 //回app
                 bridge.callHandler('canGoBack', 1, function (response) {
                 console.log(response);
                 })
                 });
                 }*/
            })
            //post数据
            var postData = {
                userId: userService.userMess.userId,
                offset: 0,
                limit: 10,
                type: $scope.couponName
            };
            $scope.getCoupons = function () {
                postData.userId = userService.userMess.userId;
                userService.couponInfo(postData).then(function (data) {
                    if (data.list.errcode === 10000) {
                        if (postData.type == 0) {
                            $scope.couponData.count = data.list.data.onlineCount;
                        } else if (postData.type == 1) {
                            $scope.couponData.count = parseInt(data.list.data.offlineCount);
                        } else if (postData.type == 2) {
                            $scope.couponData.count = data.list.data.unusedCount;
                        }

                        if (data.list.data.list) {
                            $scope.couponData.list = $scope.couponData.list.concat(data.list.data.list);
                        } else {
                            $scope.couponData = {
                                count: 0,
                                list: []
                            };
                        }
                        $scope.showLoading = false;
                    } else {
                        $scope.showLoading = false;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.nowLoadingData = false;
                })
            }
            $scope.getCoupons();
            $scope.changeType = function (val) {
                if ($scope.couponName === val) {
                    return;
                }
                if ($scope.nowLoadingData) {
                    return;
                } else {
                    $scope.nowLoadingData = true;
                }
                $ionicScrollDelegate.scrollTop(true);
                $scope.couponData = {
                    count: 0,
                    list: []
                };
                $scope.showLoading = true;
                $scope.couponName = val;
                postData.type = val;
                postData.offset = 0;
                $scope.getCoupons();
            }

            $scope.toDetail = function (val) {
                $rootScope.cpDetail = val
                $state.go('couponDetail', {id: val.id});
                $ionicViewSwitcher.nextDirection('forward');
            }

            $scope.swipeLeft = function () {
                if ($scope.couponName < 2) {
                    $scope.changeType($scope.couponName + 1);
                }
            }

            $scope.swipeRight = function () {
                if ($scope.couponName > 0) {
                    $scope.changeType($scope.couponName - 1);
                }
            }
            $scope.goback = function () {
                $scope._goback(-1);
            }

            $scope.loadMoreDate = function () {
                if ($scope.nowLoadingData) {
                    return;
                }
                postData.offset += 10;
                $scope.nowLoadingData = true;
                $scope.getCoupons();
            }
        }])
    .controller('couponDetailCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $scope.detail = $rootScope.cpDetail;
        $scope.useHelp = JSON.parse($scope.detail.remark).content;
    }])
    .controller('couponChoice', ['$rootScope', '$scope', 'userService', '$ionicViewSwitcher', '$state', '$timeout', '$http',
        function ($rootScope, $scope, userService, $ionicViewSwitcher, $state, $timeout, $http) {
            $scope.useCoupons;
            $scope.showChoice = {
                id: null,
                name: null,
                amount: null,
                orderNo: null
            };
            $scope.$on('$ionicView.afterEnter', function () {
                connectWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('getCouponChoice', null, function (res) {
                        $scope.showChoice = res.coupon;
                        getCouponData(res);
                    });
                });
            })
            //var resss={userId:'14490',token:'app_token_63420871-bd80-4183-9e5e-ed59490e284b',orderNo:'ORDTR16122215400000000966'}
            //getCouponData(resss);
            function getCouponData(res) {
                $http({
                    method: "POST",
                    url: urlStr + '/mobile/coupon/useListByOrder',
                    data: {params: {orderNo: res.orderNo}},
                    headers: {
                        'token': res.token,
                        'userId': res.userId
                    }
                }).success(function (data) {
                    if (data.errcode == 10000) {
                        $scope.useCoupons = data.data;
                    }
                }).error(function (data) {
                    $scope.alertTab('获取可用优惠券失败');
                })
            }

            $scope.itemChoice = function (value) {
                if ($scope.showChoice && $scope.showChoice.id == value.id) {
                    $scope.showChoice = {
                        id: null,
                        name: null,
                        amount: null,
                        orderNo: null
                    };
                } else {
                    $scope.showChoice = {
                        id: value.id,
                        amount: value.amount,
                        name: encodeURI(value.name)
                    }
                    connectWebViewJavascriptBridge(function (bridge) {
                        bridge.callHandler('closeSelectCoupon', $scope.showChoice, function (response) {

                        });
                    });
                }
            }

            $scope.toCouponDetail = function (val) {
                $rootScope.cpDetail = val;
                $state.go('couponDetail', {id: val.id});
            }

            $scope.backToApp = function () {
                connectWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('closeSelectCoupon', $scope.showChoice, function (response) {
                    });
                });
            }

            $scope.$on('android.choicecoupon.backbtn',function(){
                $scope.backToApp();
            })
        }])
