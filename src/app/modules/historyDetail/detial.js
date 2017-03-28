'use strict'

angular.module('ymy.detail', [])
    .controller('historyVideoDetail', ['$scope','$stateParams','$sce','$state',function ($scope,$stateParams,$sce,$state) {
        $scope.video={
            iframeSrc:$sce.trustAsResourceUrl('http://123.57.184.42:8080/app/teachVideo.html?id='+$stateParams.rootId+'&rootId='+$stateParams.rootId)
        }
        $scope.videoSrc=$sce.trustAsResourceUrl($state.params.vsrc);
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
    .controller('historyInfoDetail',['$scope','$stateParams',function($scope,$stateParams){
        console.log($stateParams.rootId);
        console.log($stateParams.id);
        $scope.video={
            url:'http://123.57.184.42:8080/app/messageList.html',
            rootId:9,
            iframeSrc:''
        }
    }])
