'use strict'
angular.module('tab.passage', [])
    .controller('passageCtrl', ['$scope', '$http', '$state', 'userService', '$ionicSlideBoxDelegate', '$ionicViewSwitcher',
        function ($scope, $http, $state, userService, $ionicSlideBoxDelegate, $ionicViewSwitcher) {
            getPassageList();
            $scope.reqParams = {
                pageNumber: 1,
                pageSize: 5
            }
            $scope.resData = {
                list: [],
                totalPage: 0
            }
            function getPassageList() {
                $http({
                    url: urlStr+'ym/news/list.api',
                    method: 'POST',
                    params: $scope.reqParams
                }).success(function (res) {
                    console.log(res);
                    if (res.result == 1) {
                        $scope.resData.list = $scope.resData.list.concat(res.newsList);
                        $scope.resData.totalPage = res.totalPage;
                    }
                    console.log($scope.resData);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
            }
            $scope.$on('$ionicView.afterEnter', function () {
                $ionicSlideBoxDelegate.start();
                $ionicSlideBoxDelegate.$getByHandle("delegateHandler").loop(true);
            })
            // $ionicSlideBoxDelegate.$getByHandle('delegateHandler').loop(true);
            $scope.curItem = [];
            //获取文章轮播图
            $scope.getCarousel=function() {
                $http({
                    url: urlStr+'ym/show/list.api',
                    method: 'POST'
                }).success(function (res) {
                    if (res.result == 1) {
                        $scope.curItem = res.shows;
                        $ionicSlideBoxDelegate.update();
                    }
                    console.log($scope.curItem);
                }).error(function () {
                    $scope.alertTab('网络异常，请检查网络！');
                })
            }

            $scope.getCarousel();
            $scope.nowActiveBanner=0;
            $scope.slideHasChanged = function (val) {
                $scope.nowActiveBanner=val;
            }
            $scope.pageClick = function (val) {
                //console.log(val);
            }

            $scope.bannerClick=function(val){
                //$state.go('infoDetail',{from:'list',rootId:val.rootId,id:val.id});
                //$ionicViewSwitcher.nextDirection('forward');
                var bannerData={from:'list',rootId:val.rootId,id:val.id};
                connectWebViewJavascriptBridge(function (bridge) {
                    //回app
                    bridge.callHandler('toPassageDetail', bannerData, function (response) {
                        userService.userMess=response;
                    })
                });
            }

            $scope.toInfoDetail=function(val){
                // $state.go('infoDetail',{from:'list',rootId:val.rootId,id:val.id});
                // $ionicViewSwitcher.nextDirection('forward');
                var detailData={from:'list',rootId:val.rootId,id:val.id};
                connectWebViewJavascriptBridge(function (bridge) {
                    //回app
                    bridge.callHandler('toPassageDetail', detailData, function (response) {
                        //userService.userMess=response;
                    })
                });
            }
        }])
