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
    .controller('historyInfoDetail',['$scope','$stateParams','$http',function($scope,$stateParams,$http){
        console.log($stateParams.rootId);
        console.log($stateParams.id);
        $http({
            url:'ym/news/field.api',
            method:'POST',
            params:{
                id:$stateParams.id
            }
        }).success(function(res){
            console.log(res);
            if(res.result==1){
                $scope.detailMsg=res;
                console.log(new Date($scope.detailMsg.pubTime*1000).getFullYear());
            }
        })
    }])
