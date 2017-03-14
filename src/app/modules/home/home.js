'use strict'
angular.module('tab.home', [])
    .controller('homeCtrl', ['$rootScope','$scope', '$ionicSlideBoxDelegate', '$state', 'userService', '$ionicHistory', '$ionicViewSwitcher', '$http','$location',
        function ($rootScope,$scope, $ionicSlideBoxDelegate, $state, userService, $ionicHistory, $ionicViewSwitcher, $http,$location) {

        }])
    .controller('recHoliday', ['$rootScope', '$scope', '$ionicHistory', '$stateParams', '$state', '$ionicViewSwitcher', 'userService',
        function ($rootScope, $scope, $ionicHistory, $stateParams, $state, $ionicViewSwitcher, userService) {

        }
    ])
    .controller('emplayeeVip', ['$rootScope', '$scope', 'userService', '$state', '$ionicViewSwitcher', function ($rootScope, $scope, userService, $state, $ionicViewSwitcher) {

    }])
