'use strict'

angular.module('swalk.choice.contact', [])
    .controller('choiceContact', ['$scope', '$state', '$stateParams', '$ionicViewSwitcher', 'userService',
        function ($scope, $state, $stateParams, $ionicViewSwitcher, userService) {
            $scope.hasContacts = false;
            $scope.used = $stateParams.usefor;
            $scope.userdata = [];
            function tabArray(arr1, arr2) {
                var arr = arr1.concat(arr2);
                var lastArr = [];
                for (var i = 0; i < arr.length; i++) {
                    if (!unique(arr[i].idcard, lastArr)) {
                        lastArr.push(arr[i]);
                    }
                }
                return lastArr;
            }

            function unique(n, arr) {
                for (var i = 0; i < arr.length; i++) {
                    if (n == arr[i].idcard) {
                        return true;
                    }
                }
                return false;
            }

            $scope.$on('$ionicView.afterEnter', function () {
                userService.getContact(userService.userMess.userId).then(function (data) {
                    if (data.list.errcode === 10000) {
                        $scope.hasContacts = true;
                        if ($scope.userdata.length == 0) {
                            $scope.userdata = data.list.data;
                        } else {
                            var myContact = tabArray($scope.userdata, data.list.data);
                            $scope.userdata = myContact;
                        }
                    } else {
                        $scope.alertTab(data.list.message);
                    }
                })
            });

            $scope.idCard='';
            $scope.choicePerson=function(val){
                //0-未选中  1-选中
                if($scope.idCard==val.idcard){
                    $scope.idCard='';
                }else{
                    $scope.idCard=val.idcard;
                    for (var i = 0; i < $scope.userdata.length; i++) {
                        $scope.userdata[i].contectchecked=false;
                        if ($scope.userdata[i].idcard == val.idcard) {
                            $scope.userdata[i].contectchecked = true;
                            userService.contacter=$scope.userdata[i];
                        }

                    }
                    $scope._goback(-1);
                }
            }

            $scope.choiceLinkman = function (event, items) {
                for (var i = 0; i < $scope.userdata.length; i++) {
                    $scope.userdata[i].contectchecked=false;
                    if ($scope.userdata[i].idcard == items.idcard) {
                        $scope.userdata[i].contectchecked = event.target.checked;
                        userService.contacter=$scope.userdata[i];
                    }

                }
                if(event.target.checked){
                    $scope._goback(-1);
                }
            }

            $scope.goback = function () {

                $scope._goback(-1);
            }

            $scope.addContact = function () {
                $state.go('addcontact', {});
                $ionicViewSwitcher.nextDirection('forward');
            }

        }])
