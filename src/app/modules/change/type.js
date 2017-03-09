'ust strict'

angular.module('swalk.changetype',[])
.controller('changeType',['$scope','$state','$ionicViewSwitcher','userService',function($scope,$state,$ionicViewSwitcher,userService){
        $scope.userPhone=userService.userMess.phone;
        $scope.remeber=function(){
            $state.go('identity',{'memery':'remember'});
            $ionicViewSwitcher.nextDirection('forward');
        }

        $scope.forget=function(){
            $state.go('identity',{'memery':'forget'});
            $ionicViewSwitcher.nextDirection('forward');
        }
    }])