'use strict'

angular.module('swalk.stay.detail', [])
    .controller('stayDetail', ['$rootScope', '$scope', '$ionicHistory', '$stateParams', '$state','$timeout', 'userService', '$ionicSlideBoxDelegate','$ionicViewSwitcher','$ionicScrollDelegate',
        function ($rootScope, $scope, $ionicHistory, $stateParams, $state,$timeout, userService, $ionicSlideBoxDelegate,$ionicViewSwitcher,$ionicScrollDelegate) {
            $scope.stay;
            $scope.hideHeaderBar=true;
            $scope.mapId=randomString(6);
            if (appType === 1) {
                $scope.canShare = 1;
            } else {
                $scope.canShare = 0;
            }
            $scope.back = function () {
                $scope._goback(-1);
            }

            $scope.$on('$ionicView.afterEnter', function () {
                $ionicSlideBoxDelegate.start();
                stayDetailDate();
            })
            $scope.picIndex = 1;
            $scope.slideChanged = function (index) {
                $scope.picIndex = index + 1;
            }

            function stayDetailDate(){
                userService.getStayDetail($stateParams.pid).then(function (data) {
                    $scope.stay = data.list.data;
                    if ($scope.stay.pics && $scope.stay.pics.length != 0) {
                        $rootScope.pInfo = {
                            picurl: '',
                            name: ''
                        }
                        $rootScope.pInfo.picurl = $scope.stay.pics.pop();
                        $rootScope.pInfo.name = $scope.stay.name;

                    }
                    $ionicSlideBoxDelegate.update();
                    $ionicSlideBoxDelegate.$getByHandle("slideboximgs").loop(true);
                    putTheMap();
                })
            }


            function putTheMap() {
                var timeid=$timeout(function(){
                    //地图插件
                    var map = new BMap.Map($scope.mapId);
                    //map.container=$scope.mapId;
                    var point = new BMap.Point($scope.stay.longitude, $scope.stay.latitude);
                    map.centerAndZoom(point, 16);
                    // 创建地址解析器实例
                    var myGeo = new BMap.Geocoder();
                    // 将地址解析结果显示在地图上,并调整地图视野
                    myGeo.getPoint($scope.stay.addr, function (point) {
                        if (point) {
                            map.centerAndZoom(point, 16);
                            map.addOverlay(new BMap.Marker(point));
                        } else {
                            //alert("您选择地址没有解析到结果!");
                        }
                    }, "");
                    $timeout.cancel(timeid);
                },500)
            }

            function randomString(len) {
                len = len || 32;
                var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var maxPos = $chars.length;
                var pwd = '';
                for (var i = 0; i < len; i++) {
                    //0~32的整数
                    pwd += $chars.charAt(Math.floor(Math.random() * (maxPos+1)));
                }
                return pwd;
            }

            $scope.goback = function () {
                $scope._goback(-1);
            }


            $scope.toShare = function () {
                var shareData={
                    url:window.location.href,
                    title:'盛行天下',
                    pic:$scope.stay.pics[0],
                    subTitle:$scope.stay.house_name+'-'+$scope.stay.name
                }
                console.log(shareData);
                connectWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('shareInfo', shareData, function (response) {

                    });
                });
            }

            $scope.doCollect = function () {
                if (userService.userMess && userService.userMess.userId) {
                    collectOrNot();
                } else {
                    //if (appType === 0) {
                        $state.go('login');
                        $ionicViewSwitcher.nextDirection('forward');
                    /*} else {
                        connectWebViewJavascriptBridge(function (bridge) {
                            bridge.callHandler('goToLogin', {type: 'collect'}, function (response) {
                                if (response.userId && response.token) {
                                    userInfoApp.userId = response.userId;
                                    userInfoApp.token = response.token;
                                    collectOrNot();
                                } else {
                                    console.log('--------------------waiting for user login');
                                }
                            });
                        });
                    }*/
                }
            }

            function collectOrNot() {
                if ($scope.stay.isCollected != 1) {
                    userService.addCollect($scope.stay.id, 0)
                        .then(
                        function (data) {
                            if (data.list.errcode === 10000) {
                                $scope.stay.isCollected = 1;
                                $scope.alertTab('收藏成功');
                            } else {
                                $scope.alertTab(data.list.massage);
                            }
                        },
                        function (error) {

                        }
                    )
                } else {
                    userService.removeCollect(userService.userMess.userId, $scope.stay.id, 0)
                        .then(
                        function (data) {
                            if (data.list.errcode === 10000) {
                                $scope.stay.isCollected = null;
                                $scope.alertTab('取消收藏成功');
                            } else {
                                $scope.alertTab(data.list.massage);
                            }
                        },
                        function (error) {

                        }
                    )
                }
            }

            $scope.toBuy = function () {
                if (userService.userMess && userService.userMess.userId) {
                    createOrder();
                } else {
                    //if (appType === 0) {
                        $state.go('login');
                        $ionicViewSwitcher.nextDirection('forward');
                    /*} else {
                        connectWebViewJavascriptBridge(function (bridge) {
                            bridge.callHandler('goToLogin', {type: 'share'}, function (response) {
                                if (response.userId && response.token) {
                                    userInfoApp.userId = response.userId;
                                    userInfoApp.token = response.token;
                                    createOrder();
                                } else {
                                    console.log('等待用户登录');
                                }
                            });
                        });
                    }*/

                }
                function createOrder() {
                    $state.go('stayOrder', {pid: $scope.stay.id});
                }

            }

            $scope.toImageDetail=function(){
                $state.go('detailImage',{data:$scope.stay.pics});
            }

            $scope.scrollbody=function(){
                if($ionicScrollDelegate.getScrollPosition().top>=200){
                    $scope.hideHeaderBar=false;

                }else{
                    $scope.hideHeaderBar=true;

                }
            }
        }])