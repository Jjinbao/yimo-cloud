'use strict'

angular.module('tab.video', [])
    .controller('videoListCtrl', ['$rootScope', '$scope', '$state', '$ionicHistory','$ionicSlideBoxDelegate', '$http', '$ionicViewSwitcher', 'userService',
        function ($rootScope, $scope, $state, $ionicHistory,$ionicSlideBoxDelegate, $http, $ionicViewSwitcher, userService) {
            $scope.$on('$ionicView.afterEnter', function () {
                $ionicSlideBoxDelegate.start();
                $ionicSlideBoxDelegate.$getByHandle("delegateHandler").loop(true);
            })
            // $ionicSlideBoxDelegate.$getByHandle('delegateHandler').loop(true);
            $scope.curItem = [];
            //获取文章轮播图
            $scope.getCarousel = function () {
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
        }])
