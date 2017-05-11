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
                    url: 'ym/news/list.api',
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
                    url: 'ym/show/list.api',
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
            $scope.slideHasChanged = function (val) {
                console.log(val);
            }
            $scope.pageClick = function (val) {
                console.log(val);
            }

            $scope.clickImg=function(val){
                console.log(val);
            }

            $scope.toInfoDetail=function(val){
                $state.go('infoDetail',{rootId:val.rootId,id:val.id});
                $ionicViewSwitcher.nextDirection('forward');
            }
        }])
