'use strict'

angular.module('swalk.reset', [])
    .controller('reset', ['$scope', '$state','$stateParams', '$ionicViewSwitcher','userService',
        function ($scope, $state,$stateParams, $ionicViewSwitcher,userService) {
            $scope.newPwd={};
            $scope.toConfirm = function () {
                userService.newPwdValue=$scope.newPwd.val;
                $state.go('confirm', {memery:$stateParams.memery});
                $ionicViewSwitcher.nextDirection('forward');
            }
        }])
