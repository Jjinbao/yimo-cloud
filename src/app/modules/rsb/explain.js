'use strict'

angular.module('swalk.rsbexplain',[])
    .controller('rsbexplain',['$rootScope','$scope',function($rootScope,$scope){
        $scope.explainback=function(){
            $rootScope.$ionicGoBack();
        }
    }])
