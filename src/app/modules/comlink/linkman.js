'use strict'

angular.module('swalk.linkman', [])
    .controller('linkman', ['$scope', '$state', '$ionicViewSwitcher','userService', function ($scope, $state, $ionicViewSwitcher,userService) {
        $scope.myContact=[];
        $scope.isLoading=true;
        $scope.$on('$ionicView.afterEnter',function(){
            getUserContact();
        })
        function getUserContact(){
            userService.getContact(userService.userMess.userId).then(function(data){
                $scope.isLoading=false;
                if(data.list.errcode===10000){
                    $scope.myContact=data.list.data;
                }
            })
        }

        //去增加联系人
        $scope.addContact=function(){
            $state.go('addcontact',{});
            $ionicViewSwitcher.nextDirection('forward');
        }

        //删除联系人
        $scope.deleteMan=function(id){
            userService.deleteContact(id).then(function(data){
                if(data.list.errcode===10000){
                    getUserContact();
                }else{
                    $scope.alertTab(data.list.message);
                }
            })
        }

    }])