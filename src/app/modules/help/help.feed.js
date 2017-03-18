'use strict'

angular.module('ymy.help.feed',[])
    .controller('helpAnFeed',['$scope','$state','$ionicViewSwitcher',function($scope,$state,$ionicViewSwitcher){
        //·´À¡¼ÇÂ¼
        $scope.feedRecord=function(){
            $state.go('feedRecord',{});
            $ionicViewSwitcher.nextDirection('forward');
        }

    }])
    .controller('feedBackRecord',['$scope',function($scope){

    }])
