'use strict'
angular.module('swalk.travel.detail', [])
    .controller('travelDetail', ['$rootScope', '$scope', '$document', '$state', '$ionicViewSwitcher', '$stateParams', '$ionicSlideBoxDelegate','$ionicScrollDelegate', 'userService',
        function ($rootScope, $scope, $document, $state, $ionicViewSwitcher, $stateParams, $ionicSlideBoxDelegate,$ionicScrollDelegate, userService) {

            var travel = this;
            this.selectItem = 'CPXQ';
            this.detailData;
            this.canShare = appType;
            $scope.$on('$ionicView.afterEnter', function () {
                $ionicSlideBoxDelegate.start();
                userService.getProductDetail($stateParams.pid, userService.userMess.userId).then(function (data) {
                    if(data.list.errcode===10000){
                        $scope.deatils = data.list.data;
                        travel.detailData = data.list.data;
                        $ionicSlideBoxDelegate.update();
                        $ionicSlideBoxDelegate.$getByHandle("slideboximgs").loop(true);
                    }
                })
            })
            this.itemChoice = function (val) {
                if (travel.selectItem === val) {
                    return;
                }
                travel.selectItem = val;
            }
            //轮播图片事件
            travel.picIndex = 1;
            this.slideChanged = function (index) {
                travel.picIndex = index + 1;
            }

            this.toShare = function () {
                var shareData={
                    url:window.location.href,
                    title:'盛行天下',
                    pic:$scope.deatils.details[0],
                    subTitle:$scope.deatils.name
                }
                connectWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('shareInfo', shareData, function (response) {

                    });
                });
            }

            this.doCollect = function () {
                if (userService.userMess && userService.userMess.userId) {
                    collectOrNot();
                } else {
                    $state.go('login');
                    $ionicViewSwitcher.nextDirection('forward');
                }
            };

            function collectOrNot() {
                if (travel.detailData.collectStatus != 1) {
                    userService.addCollect(travel.detailData.id, 1)
                        .then(
                        function (data) {
                            if (data.list.errcode === 10000) {
                                travel.detailData.collectStatus = 1;
                                $scope.alertTab('收藏成功');
                            } else {
                                $scope.alertTab(data.list.massage);
                            }
                        },
                        function (error) {

                        }
                    )
                } else {
                    userService.removeCollect(userService.userMess.userId, travel.detailData.id, 1)
                        .then(
                        function (data) {
                            if (data.list.errcode === 10000) {
                                travel.detailData.collectStatus = null;
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


            this.doBuy = function () {

                if (userService.userMess && userService.userMess.userId) {
                    createOrder();
                } else {
                    $state.go('login');
                    $ionicViewSwitcher.nextDirection('forward');
                }
                function createOrder() {
                    userService.createOrder(userService.userMess.userId, $stateParams.pid)
                        .then(
                        function (data) {
                            if (data.list.errcode != 10000) {
                                $scope.alertTab(data.list.message);
                            } else {
                                var orderData={id:data.list.data,type:1,title:travel.detailData.name};
                                $rootScope.preOrderData=orderData;
                                $state.go('fillorder', {pid: $stateParams.pid});
                                $ionicViewSwitcher.nextDirection('forward');
                            }
                        },
                        function (error) {
                        }
                    )
                }

            }
            $scope.travelDetailBack = function () {
                $scope._goback(-1);
            }

            $scope.toImageDetail=function(){
                $state.go('detailImage',{data:travel.detailData.details});
            }
        }])