'use strict'

angular.module('swalk.add.contact', [])
    .controller('addContact', ['$document', '$scope', '$state', 'userService',
        function ($document, $scope, $state, userService) {
            $scope.isInApp = appType;
            if ($scope.isInApp === 1) {
                $scope.bookStyle = {'right': '25px'}
            } else {
                $scope.bookStyle = {'right': '10px'}
            }
            $scope.userdata = {
                userId: userService.userMess.userId,
                name: '',
                gender: 1,
                webbirthday: new Date('1990-01-01'),
                birthday:'',
                phone: '',
                idcard: '',
                email: ''

            }

            $scope.choiceGender = function (val) {
                if ($scope.userdata.gender == val) {
                    return;
                }
                $scope.userdata.gender = val;
            }

            $scope.saveContact = function () {
                var phoneReg = /^1[3|5|7|8]\d{9}$/;
                var idReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                var emailReg = /^[\w\.-]+?@([\w\-]+\.){1,2}[a-zA-Z]{2,3}$/;
                var result = document.getElementById('birthday').value;
                if (!$scope.userdata.name) {
                    $scope.alertTab('请输入正确的用户名');
                    return;
                }

                if (result.substr(0, 4) < 1900) {
                    //$scope.userdata.birthday=new Date('1980-1-1');
                    $scope.alertTab('请选择正确的生日');
                    return;
                } else {
                    $scope.userdata.birthday=($scope.userdata.webbirthday.getFullYear())+"-"+(($scope.userdata.webbirthday.getMonth()+1)>9?($scope.userdata.webbirthday.getMonth()+1):('0'+($scope.userdata.webbirthday.getMonth()+1)))+"-"+($scope.userdata.webbirthday.getDate()>9?$scope.userdata.webbirthday.getDate():('0'+$scope.userdata.webbirthday.getDate()));
                }
                ;

                if (!phoneReg.exec($scope.userdata.phone)) {
                    $scope.alertTab('请输入正确的手机号码');
                    return;
                }

                if (!idReg.exec($scope.userdata.idcard)) {
                    $scope.alertTab('请输入正确的身份证号码');
                    return;
                }

                if ($scope.userdata.email) {
                    if (!emailReg.exec($scope.userdata.email)) {
                        $scope.alertTab('您输入的邮箱格式不正确')
                        return;
                    }
                }

                /*if ($scope.userdata.gender === '男') {
                    $scope.userdata.gender = '1';
                } else {
                    $scope.userdata.gender = '0';
                }*/
                userService.addContact($scope.userdata).then(function (data) {
                    if (data.list.errcode != 10000) {
                        console.log(data);
                        console.log($scope.userdata);
                        $scope.alertTab(data.list.message);
                    } else {
                        $scope._goback(-1);
                        //getNewContect();
                    }
                })

                function getNewContect() {
                    userService.getContact(userService.userMess.userId)
                        .then(
                        function (data) {
                            if (data.list.errcode != 10000) {
                                $scope.alertTab(data.list.message);
                            } else {
                                for (var i = 0; i < data.list.data.length; ++i) {
                                    for (var k = 0; k < userService.userContact.length; k++) {
                                        if (data.list.data[i].idcard === userService.userContact[k].idcard) {
                                            break;
                                        }
                                    }
                                    if (k === userService.userContact.length) {
                                        userService.userContact.push(data.list.data[i]);
                                    }
                                }
                                localStorage.setItem('contact', JSON.stringify(userService.userContact));
                            }
                            $scope._goback(-1);
                        },
                        function (data) {

                        }
                    )
                }
            }

            $scope.getUserPhone = function () {
                connectWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('openPhoneBook', null, function (response) {

                    });
                });
            }

            connectWebViewJavascriptBridge(function (bridge) {
                bridge.registerHandler('givePhoneNumber', function (response) {
                    $scope.userdata.name = response.name;
                    $scope.userdata.phone = response.phone;
                    $scope.$digest();
                });
            });
        }])