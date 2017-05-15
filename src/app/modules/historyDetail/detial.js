'use strict'

angular.module('ymy.detail', [])
    .controller('historyVideoDetail', ['$scope','$stateParams','$sce','$state',function ($scope,$stateParams,$sce,$state) {
        $scope.video={
            iframeSrc:$sce.trustAsResourceUrl('http://123.57.184.42:8080/app/teachVideo.html?id='+$stateParams.rootId+'&rootId='+$stateParams.rootId)
        }
        $scope.videoSrc=$sce.trustAsResourceUrl($state.params.vsrc);
        $scope.videoTitle=$state.params.title;
        //angular.element(document).ready(function(){
        //    var iframe1=document.getElementById('iframe');
        //    iframe1.onload=function(){
        //        console.log(iframe1.contentWindow.document.getElementById('v1'));
        //        iframe1.contentWindow.document.getElementById('v1').src=$state.params.vsrc;
        //        iframe1.contentWindow.document.getElementById('vmedia').load();
        //    }
        //
        //})
    }])
    .controller('historyInfoDetail',['$scope','$stateParams','$http','userService','$state','$ionicViewSwitcher',function($scope,$stateParams,$http,userService,$state,$ionicViewSwitcher){
        console.log($stateParams.rootId);
        console.log($stateParams.id);
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
        $scope.$on('$ionicView.afterEnter',function(){
            $http({
                url:urlStr+'ym/comment/list.api',
                method:'POST',
                params:{
                    categoryRootId:$stateParams.rootId,
                    categoryItemId:$stateParams.id
                }
            }).success(function(res){
                console.log(res);
            })
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
    }])
