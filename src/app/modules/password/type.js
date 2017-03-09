'ust strict'

angular.module('swalk.changeloginword',[])
.controller('changeLoginType',['$scope','$state','$ionicViewSwitcher','userService',function($scope,$state,$ionicViewSwitcher,userService){
        $scope.userPhone=userService.userMess.phone;
        $scope.remeber=function(){
            $state.go('remeLoginPass',{});
            $ionicViewSwitcher.nextDirection('forward');
        }

        $scope.forget=function(){
            $state.go('repassword',{used:'XG'});
            $ionicViewSwitcher.nextDirection('forward');
        }
    }])