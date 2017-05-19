'use strict'

angular.module('ymy.detail', [])
    .controller('historyVideoDetail', ['$scope','$stateParams','$sce','$state','$http',function ($scope,$stateParams,$sce,$state,$http) {
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
        var myVideo=document.getElementById('detailVideo');
        $http({
            url:urlStr+'ym/album/field.api',
            method:'POST',
            params:{
                id:$stateParams.id
            }
        }).success(function(res){
            console.log(res);
            getAlbumList(res.id);

        })
        $scope.videoList={
            nowActiveVideo:'',
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
                }
            })
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
            screen.orientation.lock('landscape');
            console.log('1full screen');
        })
        document.addEventListener('mozfullscreenchange ',function(e){
            screen.orientation.lock('landscape');
            console.log('2full screen');
        })
        document.addEventListener('fullscreenchange',function(e){
            screen.orientation.lock('landscape');
            console.log('3full screen');
        })
        $scope.goBackToList=function(){
            myVideo.pause();

            $scope._goback(-1);
        }
    }])
    .controller('historyInfoDetail',['$scope','$stateParams','$http','userService','$state','$ionicViewSwitcher',function($scope,$stateParams,$http,userService,$state,$ionicViewSwitcher){
        console.log($stateParams.rootId);
        console.log($stateParams.id);
        //获取用户信息
        if(userService.userMess&&userService.userMess.accountId){

        }else{
            connectWebViewJavascriptBridge(function (bridge) {
                //回app
                bridge.callHandler('getAppUserData', null, function (response) {
                    userService.userMess=response;
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
                $scope._goback(-1);
            }else{
                $scope._goback(-1);
            }
        }
    }])
