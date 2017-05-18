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
                    url: urlStr+'ym/show/list.api',
                    method: 'POST',
                    params:{
                        rootId:9
                    }
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
            //获取视频推荐列表
            $scope.recVideoList=[];
            $http({
                url:urlStr+'ym/album/list.api',
                method:'POST'
            }).success(function(res){
                console.log(res);
                if(res.result==1){
                    $scope.recVideoList=res.albumList;
                }
            })

            $scope.toAlbumDetail=function(val){
                $state.go('videoDetail',{id:val.id});
                $ionicViewSwitcher.nextDirection('forward');
            }
        }])
