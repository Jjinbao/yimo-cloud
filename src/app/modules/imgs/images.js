'use strict'

angular.module('swalk.images',[])
    .controller('detailImages',['$scope','$state',function($scope,$state){
        $scope.images=$state.params.data;
        $scope.imageIndex={
            total:$scope.images.length,
            index:1
        }
        $scope.slideChanged=function(index){
            $scope.imageIndex.index=index+1;
        }
    }])
