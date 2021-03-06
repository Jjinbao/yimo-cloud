'use strict'

angular.module('tab.video', [])
    .controller('videoListCtrl', ['$rootScope', '$scope', '$state', '$ionicHistory', '$ionicSlideBoxDelegate', '$http', '$ionicViewSwitcher', 'userService',
        function ($rootScope, $scope, $state, $ionicHistory, $ionicSlideBoxDelegate, $http, $ionicViewSwitcher, userService) {
            $scope.$on('$ionicView.afterEnter', function () {
                $ionicSlideBoxDelegate.start();
                $ionicSlideBoxDelegate.$getByHandle("delegateHandler").loop(true);
            })
            if(!isAndroid){
                $scope.styleHeight={
                    'height':(document.documentElement.clientHeight-39)+'px',
                    'padding-bottom':80+'px'
                }
            }else{
                $scope.styleHeight={
                    height:(document.documentElement.clientHeight-39)+'px'
                }
            }

            //获取视频推荐列表
            $scope.recVideoList = [];
            $scope.activeCategory={
                first:'',
                second:'',
                third:''
            }
            $scope.getAllAlbum=function(){
                $scope.activeCategory.third='';
                console.log('---------');
                $http({
                    url: urlStr + 'ym/album/list.api',
                    method: 'POST'
                }).success(function (res) {
                    console.log(res);
                    if (res.result == 1) {
                        $scope.recVideoList = res.albumList;
                    }
                })
            }
            $scope.getAllAlbum();

            //等待app调用h5来通知h5显示什么东西
            connectWebViewJavascriptBridge(function (bridge) {
                bridge.registerHandler('displayClassification', function (response) {
                    $http({
                        url: urlStr + 'ym/album/list.api',
                        method: 'POST',
                        params:response
                    }).success(function (res) {
                        if (res.result == 1) {
                            $scope.recVideoList = res.albumList;
                        }
                    })
                })
            });

            $scope.curItem = [];
            //获取文章轮播图
            $scope.getCarousel = function () {
                $http({
                    url: urlStr + 'ym/show/list.api',
                    method: 'POST',
                    params: {
                        rootId: 1
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
            $scope.activeBanner=0;
            $scope.slideHasChanged = function (val) {
                $scope.activeBanner=val;
            }
            $scope.pageClick = function (val) {
                console.log(val);
                $scope.toAlbumDetail({id:val.itemId});

            }


            $scope.toAlbumDetail = function (val) {
                var videoId={rootId:1,id:val.id};
                connectWebViewJavascriptBridge(function (bridge) {
                    //回app
                    bridge.callHandler('videoDetail', videoId, function (response) {

                    })
                });
                $state.go('videoDetail', {detail:'list',rootId:1,id: val.id});
                $ionicViewSwitcher.nextDirection('forward');
            }

            $scope.toCategory = function () {
                connectWebViewJavascriptBridge(function (bridge) {
                    //回app
                    bridge.callHandler('toVideoCategory', null, function (response) {

                    })
                });
                // $state.go('category',{});
                // $ionicViewSwitcher.nextDirection('forward');
            }

            //搜索框
            $scope.searchInfo='';
            $scope.doubleHold=false;
            $scope.searchVideo=function(){
                if(!$scope.searchInfo){
                    return;
                }
                if($scope.doubleHold){
                    return;
                }
                $scope.activeCategory.third='a';
                $scope.doubleHold=true;
                $http({
                    url: urlStr + 'ym/album/list.api',
                    method: 'POST',
                    params:{
                        albumTitle:encodeURI($scope.searchInfo)
                    }
                }).success(function (res) {
                    console.log(res);
                    if (res.result == 1) {
                        $scope.recVideoList = res.albumList;
                    }
                    $scope.doubleHold=false;
                })
            }
            $scope.searchOn=function(){
                $scope.showCategoryList=false;
            }
            $scope.searchOut=function(){
                console.log('失去焦点');
            }

            $scope.myKeyup=function(e){
                var keycode = window.event?e.keyCode:e.which;
                console.log(keycode);
            }

            //显示隐藏分类列表
            $scope.showCategoryList=false;
            $scope.operateCategoryList=function(){
                $scope.showCategoryList=!$scope.showCategoryList;
            }


            //当前显示的分类列表
            $scope.nowActiveCategory=0;
            //获取视频分类列表
            $scope.categoryList=[];
            //二级分类和三级分类
            $scope.secondCategoryList='';

            $http({
                url:urlStr+'ym/category/list.api',
                method:'POST'
            }).success(function(data){
                console.log(data);
                if(data.result==1){
                    $scope.categoryList=data.list;
                    //初始化数据
                    $scope.nowActiveCategory=$scope.categoryList[0].id;
                    $scope.activeCategory.first=$scope.categoryList[0].id;
                    $scope.secondCategoryList=$scope.categoryList[0].categoryList;

                }
            });

            //切换分类列表
            $scope.changeCategoryList=function(val){
                if($scope.nowActiveCategory==val){
                    $scope.nowActiveCategory=0;
                    return;
                }
                $scope.nowActiveCategory=val;

            }

            $scope.choicedCategory=function(val){
                console.log(val);
                $scope.showCategoryList=false;
                $scope.activeCategory.third=val.categoryId;
                $http({
                    url:urlStr+'ym/album/list.api',
                    method:'POST',
                    params:{
                        rootId:val.rootId,
                        catIdLev2:val.parentId,
                        catIdLev3:val.categoryId
                    }
                }).success(function(res){
                    console.log(res);
                    $scope.recVideoList=res.albumList;
                })
            }
            if(!isAndroid){
                $scope.iosBottomPadding={
                    'padding-bottom':80+'px'
                };
            }else{
                $scope.iosBottomPadding={
                };
            }

            console.log($scope.iosBottomPadding);

        }])
    .controller('category', ['$scope','$http', function ($scope,$http) {
        //获取视频分类列表
        $scope.categoryList=[];
        //二级分类和三级分类
        $scope.secondCategoryList='';
        $scope.activeCategory={
            first:'',
            second:'',
            third:''
        }
        $http({
            url:urlStr+'ym/category/list.api',
            method:'POST'
        }).success(function(data){
            console.log(data);
            if(data.result==1){
                $scope.categoryList=data.list;
                //初始化数据
                $scope.activeCategory.first=$scope.categoryList[0].id;
                $scope.secondCategoryList=$scope.categoryList[0].categoryList;

            }
        });

        //更改一及分类
        $scope.changeFirstCategory=function(value){
            $scope.activeCategory.first=value.id;
            $scope.secondCategoryList=value.categoryList;
            console.log(value.categoryList);
        }

        //更改三级分类
        $scope.thirdCategoryId='';
        $scope.changeThirdCategory=function(val){
            $scope.thirdCategoryId=val.categoryId;
            var category={
                rootId:val.rootId,
                catIdLev2:val.parentId,
                catIdLev3:val.categoryId
            }
            //console.log(category);
            connectWebViewJavascriptBridge(function (bridge) {
                //回app
                bridge.callHandler('videoCategory', category, function (response) {

                })
            });
            // $http({
            //     url:urlStr+'ym/album/list.api',
            //     method:'POST',
            //     params:{
            //         rootId:val.rootId,
            //         catIdLev2:val.parentId,
            //         catIdLev3:val.categoryId
            //     }
            // }).success(function(res){
            //     console.log(res);
            // })
        }

        $scope.backToAapp=function(){
            connectWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler('backToApp', null, function (response) {

                })
            })
            //$scope._goback(-1);
        }
    }])
