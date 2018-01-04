'use strict'

angular.module('ymy.detail', [])
    .controller('historyVideoDetail', ['$rootScope','$scope','$stateParams','$sce','$state','$http','$ionicViewSwitcher','$location','userService','$timeout',function ($rootScope,$scope,$stateParams,$sce,$state,$http,$ionicViewSwitcher,$location,userService,$timeout) {
        // $scope.video={
        //     iframeSrc:$sce.trustAsResourceUrl('http://123.57.184.42:8080/app/teachVideo.html?id='+$stateParams.rootId+'&rootId='+$stateParams.rootId)
        // }
        // $scope.videoSrc=$sce.trustAsResourceUrl($state.params.vsrc);
        // $scope.videoTitle=$state.params.title;
        //angular.element(document).ready(function(){
        //    var iframe1=document.getElementById('iframe');
        //    iframe1.onload=function(){
        //        console.log(iframe1.contentWindow.document.getElementById('v1'));
        //        iframe1.contentWindow.document.getElementById('v1').src=$state.params.vsrc;
        //        iframe1.contentWindow.document.getElementById('vmedia').load();
        //    }
        //
        //})
        //获取用户信息
        //$scope.$on('$ionicView.enter',function(){
            $http({
                url:urlStr+'ym/comment/list.api',
                method:'POST',
                params:{
                    categoryRootId:$stateParams.rootId,
                    categoryItemId:$stateParams.id
                }
            }).success(function(res){
                console.log('00000000000000--------111111111');
                console.log(res);
                if(res.result==1){
                    if(res.comments.length>0){
                        res.comments.forEach(function(val){
                            val.pushTime=new Date(val.createTime*1000).format('yyyy-MM-dd');
                        })
                    }
                    $scope.userComment.list=$scope.userComment.list.concat(res.comments);
                    $scope.userComment.total=res.totalPage;
                }
            }).error(function(){
                $scope.alertTab('网络错误，稍后再试');
            })
        //})
        $scope.albuminfo;
        // $scope.$on('$ionicView.beforeEnter',function(){
        //     console.log('fanhuilaiyinggaiyaozhixng');
        //     $http({
        //         url:urlStr+'ym/comment/list.api',
        //         method:'POST',
        //         params:{
        //             categoryRootId:$stateParams.rootId,
        //             categoryItemId:$stateParams.id
        //         }
        //     }).success(function(res){
        //         console.log('123----------------------123');
        //         console.log(res);
        //         if(res.result==1){
        //             if(res.comments.length>0){
        //                 res.comments.forEach(function(val){
        //                     val.pushTime=new Date(val.createTime*1000).format('yyyy-MM-dd');
        //                 })
        //             }
        //             $scope.userComment.list=$scope.userComment.list.concat(res.comments);
        //             $scope.userComment.total=res.totalPage;
        //         }
        //     }).error(function(){
        //         $scope.alertTab('网络错误，稍后再试');
        //     })
        // })
        var myVideo=document.getElementById('detailVideo');
            $timeout(function(){
                myVideo=document.getElementById('detailVideo');
            },2000)
            console.log(myVideo);
        $http({
            url:urlStr+'ym/album/field.api',
            method:'POST',
            params:{
                id:$stateParams.id
            }
        }).success(function(res){
            console.log('--------------111----------');
            console.log(res);
            $scope.albuminfo=res;
            getAlbumList(res.id);

        })
        $scope.videoList={
            nowActiveVideo:'',
            nowActiveVideoId:'',
            list:[]
        };
        function getAlbumList(val){
            console.log('-------------');
            $http({
                url:urlStr+'ym/teach/list.api',
                method:'POST',
                params:{
                    albumId:val,
                    categoryId:1,
                    pageNumber:1,
                    pageSize:10
                }
            }).success(function(res){
                console.log(res);
                if(res.result==1){
                    $scope.videoList.list=res.teachList;
                    $scope.videoList.nowActiveVideo=res.teachList[0].videoSrc;
                    $scope.videoList.nowActiveVideoId=res.teachList[0].id;
                }
            })
        }
        // window.onresize=function(){
        //     detailVideo.style.width=window.innerWidth+'px';
        //     detailVideo.style.height=window.innerHeight+'px';
        // }
        $scope.changeActiveVideo=function(val){
            $scope.videoList.nowActiveVideo=val.videoSrc;
            $scope.videoList.nowActiveVideoId=val.id;
        }
        $scope.trustUrl=function(value){
            return $sce.trustAsResourceUrl(value);
        }
        $scope.$on('$ionicView.beforeEnter', function(){
            console.log('-------121212------');
        });
        myVideo.addEventListener('ended',function(){
            console.log('end');
        })

        myVideo.addEventListener('play',function(){
            console.log('开始播放');
            //screen.orientation.lock('landscape');
        })
        document.addEventListener('webkitfullscreenchange',function(e){
            console.log('全屏-webkit');
            //screen.orientation.lock('landscape');
            //console.log('1full screen');
        })
        document.addEventListener('mozfullscreenchange ',function(e){
            //screen.orientation.lock('landscape');
            //console.log('2full screen');
            console.log('全屏-moz');
        })
        document.addEventListener('fullscreenchange',function(e){
            //screen.orientation.lock('landscape');
            //console.log('3full screen');
            console.log('全屏-normal');
        })
        $scope.goBackToList=function(){
            myVideo.pause();
            if($stateParams.detail=='list'){
                connectWebViewJavascriptBridge(function (bridge) {
                    //回app
                    bridge.callHandler('backToApp', null, function (response) {

                    })
                });
            }else{
                $scope._goback(-1);
            }

        }

        if(userService.userMess&&userService.userMess.accountId){
            $http({
                url:urlStr+'ym/history/add.api',
                method:'POST',
                params:{
                    accountId:userService.userMess.accountId,
                    type:'album',
                    typeId:$stateParams.id,
                    sign:md5('ymy' + userService.userMess.accountId + 'album'+$stateParams.id)
                }
            }).success(function(data){
                console.log('-----------历史记录成功--------------');
                console.log(data);
            })
        }else{
            connectWebViewJavascriptBridge(function (bridge) {
                //回app
                bridge.callHandler('getAppUserData', null, function (response) {
                    userService.userMess=response;
                    if(userService.userMess&&userService.userMess.accountId){
                        $http({
                            url:urlStr+'ym/history/add.api',
                            method:'POST',
                            params:{
                                accountId:userService.userMess.accountId,
                                type:'album',
                                typeId:$stateParams.id,
                                sign:md5('ymy' + userService.userMess.accountId + 'album'+$stateParams.id)
                            }
                        }).success(function(data){
                            console.log(data);
                        })
                    }

                })
            });
        }

        $scope.toSubmitComment=function(){
            myVideo.pause();
            if(!userService.userMess.accountId){
                $rootScope.isDetailLogin={
                    url:$location.url(),
                    flag:'infoDetail'
                };
                $state.go('login', {ragion: 'commont'});
                $ionicViewSwitcher.nextDirection('forward');
            }else{
                $state.go('comment',{rootId:$stateParams.rootId,id:$stateParams.id});
                $ionicViewSwitcher.nextDirection('forward');
            }
        }
        //获取评论列表
        $scope.userComment={
            list:[],
            total:0
        }

        $scope.holdDouble=false
        $scope.subCollect=function(){
            console.log($stateParams.id);
            if($scope.holdDouble){
                return;
            }
            $scope.holdDouble=true;

            $http({
                url:urlStr+'ym/collection/add.api',
                method:'POST',
                params:{
                    accountId:userService.userMess.accountId,
                    type:'album',
                    typeId:$stateParams.id,
                    sign:md5('ymy' + userService.userMess.accountId + 'album'+$stateParams.id)
                }
            }).success(function(res){
                if(res.result==1){
                    $scope.alertTab('收藏成功');
                }else if(res.result==104){
                    $scope.alertTab('已经收藏，不能重复收藏');
                }else{
                    $scope.alertTab('收藏失败');
                }
                $scope.holdDouble=false;
            })
        }

        $scope.storePassage=function(){
            if(!userService.userMess.accountId){
                $rootScope.isDetailLogin={
                    url:$location.url(),
                    flag:'infoDetail'
                };
                $state.go('login', {ragion: 'commont'});
                $ionicViewSwitcher.nextDirection('forward');
            }else{
                $scope.subCollect();
            }
        }


    }])
    .controller('historyInfoDetail',['$rootScope','$scope','$stateParams','$http','userService','$state','$location','$ionicViewSwitcher',function($rootScope,$scope,$stateParams,$http,userService,$state,$location,$ionicViewSwitcher){
        console.log($stateParams.rootId);
        console.log($stateParams.id);
        //获取用户信息
        if(userService.userMess&&userService.userMess.accountId){
            $http({
                url:urlStr+'ym/history/add.api',
                method:'POST',
                params:{
                    accountId:userService.userMess.accountId,
                    type:'news',
                    typeId:$stateParams.id,
                    sign:md5('ymy' + userService.userMess.accountId + 'news'+$stateParams.id)
                }
            }).success(function(data){
                console.log(data);
            })
        }else{
            connectWebViewJavascriptBridge(function (bridge) {
                //回app
                bridge.callHandler('getAppUserData', null, function (response) {
                    userService.userMess=response;
                    if(userService.userMess&&userService.userMess.accountId){
                        $http({
                            url:urlStr+'ym/history/add.api',
                            method:'POST',
                            params:{
                                accountId:userService.userMess.accountId,
                                type:'news',
                                typeId:$stateParams.id,
                                sign:md5('ymy' + userService.userMess.accountId + 'news'+$stateParams.id)
                            }
                        }).success(function(data){
                            console.log(data);
                        })
                    }

                })
            });
        }

        $http({
            url:urlStr+'ym/news/field.api',
            method:'POST',
            params:{
                id:$stateParams.id
            }
        }).success(function(res){
            console.log(res);
            if(res.result==1){
                $scope.detailMsg=res;
                $scope.detailMsg.formateDate=new Date(res.pubTime*1000).format('yyyy-MM-dd');
            }
        })
        //获取评论列表
        $scope.userComment={
            list:[],
            total:0
        }
        $http({
            url:urlStr+'ym/comment/list.api',
            method:'POST',
            params:{
                categoryRootId:$stateParams.rootId,
                categoryItemId:$stateParams.id
            }
        }).success(function(res){
            console.log(res);
            if(res.result==1){
                if(res.comments.length>0){
                    res.comments.forEach(function(val){
                        val.pushTime=new Date(val.createTime*1000).format('yyyy-MM-dd');
                    })
                }
                $scope.userComment.list=$scope.userComment.list.concat(res.comments);
                $scope.userComment.total=res.totalPage;
            }

        }).error(function(){
            $scope.alertTab('网络错误，稍后再试');
        })

        $scope.toSubmitComment=function(){
            if(!userService.userMess.accountId){
                $rootScope.isDetailLogin={
                    url:$location.url(),
                    flag:'infoDetail'
                };
                console.log($rootScope.isDetailLogin);
                $state.go('login', {ragion: 'commont'});
                $ionicViewSwitcher.nextDirection('forward');
            }else{
                $state.go('comment',{rootId:$stateParams.rootId,id:$stateParams.id});
                $ionicViewSwitcher.nextDirection('forward');
            }
        }

        $scope.backFrant=function(){
            if($stateParams.from=='list'){
                connectWebViewJavascriptBridge(function (bridge) {
                    //回app
                    bridge.callHandler('backToApp', null, function (response) {

                    })
                });
            }else{
                $scope._goback(-1);
            }
        }

        $scope.holdCollectDoubleClick=false;
        $scope.storePassage=function(){
            if($scope.holdCollectDoubleClick){
                return;
            }
            //ym/collection/add.api
            $scope.holdCollectDoubleClick=true;
            $http({
                url:urlStr+'ym/collection/add.api',
                method:'POST',
                params:{
                    accountId:userService.userMess.accountId,
                    type:'news',
                    typeId:$stateParams.id,
                    sign:md5('ymy' + userService.userMess.accountId + 'news'+$stateParams.id)
                }
            }).success(function(data){
                if(data.result==1){
                    $scope.alertTab('收藏成功');
                }else{
                    $scope.alertTab('收藏失败');
                }
                $scope.holdCollectDoubleClick=false;
            })
        }
    }])
