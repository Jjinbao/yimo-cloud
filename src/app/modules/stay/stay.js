'use strict'

angular.module('tab.stay', [])
    .controller('stayCtrl', ['$rootScope', '$scope', '$state', '$ionicHistory', '$ionicViewSwitcher', 'userService', function ($rootScope, $scope, $state, $ionicHistory, $ionicViewSwitcher, userService) {

    }])
    .controller('stayChoiceDateCtrl', ['$rootScope','$scope', '$q', '$state','$timeout', function ($rootScope,$scope, $q, $state,$timeout) {
        $scope.stayInDate = '';
        $scope.stayOutDate = '';
        $scope.temp = [];
        $scope.options = {
            model: 'selectDate',
            getData: function () {
                var def = $q.defer();
                def.resolve($scope.temp[0] ? $scope.temp : []);
                return def.promise
            },
            clickDate: function (current, list) {
                var today=getTodayDate();
                var canUsed=compareLastDate(today,current.fullDate);
                if(canUsed==1){
                    return;
                }
                if($scope.stayOutDate){
                    return;
                }
                if (!$scope.stayInDate || $scope.stayInDate > current.fullDate) {
                    $scope.stayInDate = current.fullDate;
                    angular.forEach(list, function (item) {
                        if (item == current) {
                            item.stayIn = true;
                            item.text = '入住'
                        } else {
                            item.stayIn = false;
                            item.text = ''
                        }
                    });
                    $scope.temp[0] = {
                        stayIn: true,
                        text: '入住',
                        date: current.fullDate
                    };
                    //$scope.alertTab('已选择入住时间')
                } else if ($scope.stayInDate && $scope.stayInDate < current.fullDate) {
                    $scope.stayOutDate = current.fullDate;
                    current.stayIn = true;
                    current.text = '离店';
                    //$scope.alertTab('已选择离店时间');
                    $rootScope.appStay.stayIn=$scope.stayInDate;
                    $rootScope.appStay.stayOut=$scope.stayOutDate;
                    var timeOutId=$timeout(function(){
                        $timeout.cancel(timeOutId);
                        $scope._goback(-1);
                    },500)
                    /*if ($state.params.name) {

                        $state.go('staylist', {
                            stayInDate: $scope.stayInDate,
                            stayOutDate: $scope.stayOutDate,
                            name: $state.params.name
                        })
                    } else {
                        //$state.go('tabs.stay', {stayInDate: $scope.stayInDate, stayOutDate: $scope.stayOutDate})
                    }*/
                }
            }
        }
    }
    ]);
