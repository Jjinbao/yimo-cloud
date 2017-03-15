'use strict'

angular.module('ymy.register',[])
    .controller('userRegister',['$scope','$state','$ionicHistory','$ionicViewSwitcher',function($scope,$state,$ionicHistory,$ionicViewSwitcher){
        console.log('-------------------');
        $scope.setName=function(){
            $state.go('regname',{});
            $ionicViewSwitcher.nextDirection('forward');
        }

        $scope.back=function(){
            $ionicHistory.goBack();
            $ionicViewSwitcher.nextDirection('back');
        }
    }])
    .controller('regSetName',['$scope','$state','$ionicHistory','$ionicViewSwitcher',function($scope,$state,$ionicHistory,$ionicViewSwitcher){
        $scope.back=function(){
            $ionicHistory.goBack();
            $ionicViewSwitcher.nextDirection('back');
        }
    }])
