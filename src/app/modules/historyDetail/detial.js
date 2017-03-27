'use strict'

angular.module('ymy.detail', [])
    .controller('historyVideoDetail', ['$scope','$stateParams','$sce',function ($scope,$stateParams,$sce) {
        $scope.video={
            iframeSrc:$sce.trustAsResourceUrl('http://123.57.184.42:8080/app/teachVideo.html?id='+$stateParams.rootId+'&rootId='+$stateParams.rootId)
        }
        angular.element(document).ready(function(){
            var iframe1=document.getElementById('iframe');
            iframe1.onload=function(){
                console.log(iframe1.contentWindow.document.getElementsByTagName('video'));
            }

        })
    }])
    .controller('historyInfoDetail',['$scope',function($scope){
        console.log($stateParams.rootId);
        console.log($stateParams.id);
        $scope.video={
            url:'http://123.57.184.42:8080/app/teach.html',
            rootId:9,
            iframeSrc:''
        }
    }])
