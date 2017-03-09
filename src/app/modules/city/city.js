'use strict'

angular.module('swalk.city',[])
    .controller('cityList',['$rootScope','$scope','userService',function($rootScope,$scope,userService){
        $scope.goback=function(){
            $scope._goback(-1);
        }
        $scope.choiceCity=function(city){
            $rootScope.selectCity=city;
            $scope._goback(-1);
        }
    }])
