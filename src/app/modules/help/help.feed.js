'use strict'

angular.module('ymy.help.feed',[])
    .controller('helpAnFeed',['$scope','$state','$ionicViewSwitcher',function($scope,$state,$ionicViewSwitcher){
        //·´À¡¼ÇÂ¼
        $scope.feedRecord=function(){
            $state.go('feedRecord',{});
            $ionicViewSwitcher.nextDirection('forward');
        }

        $scope.toQuestion=function(val){
            $state.go('questionList',{viewTitle:val});
            $ionicViewSwitcher.nextDirection('forward');
        }
    }])
    .controller('feedBackRecord',['$scope','$state','$ionicViewSwitcher',function($scope,$state,$ionicViewSwitcher){
        $scope.toDetail=function(){
            $state.go('feedQuestion',{});
            $ionicViewSwitcher.nextDirection('forward');
        }
    }])
    .controller('questionList',['$scope','$state','$ionicViewSwitcher',function($scope,$state,$ionicViewSwitcher){
        $scope.viewTitle=$state.params.viewTitle;
        $scope.toQuestionDetail=function(){
            $state.go('commonQuestion',{viewTitle:$scope.viewTitle});
            $ionicViewSwitcher.nextDirection('forward');
        }
    }])
    .controller('commonQuestion',['$scope','$state',function($scope,$state){
        $scope.viewTitle=$state.params.viewTitle;
    }])
    .controller('feedDetail',['$scope','$state',function($scope,$state){
        console.log('-------------------');
    }])

