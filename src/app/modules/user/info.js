'use strict'

angular.module('swalk.userinfo', [])
    .controller('userInfo', ['$scope', 'userService', '$state', '$ionicViewSwitcher', '$ionicActionSheet', function ($scope, userService, $state, $ionicViewSwitcher, $ionicActionSheet) {
        $scope.$on('$ionicView.afterEnter', function () {
            //获取用户信息
            /*userService.getUserInfo({userId:userService.userMess.userId}).then(function(data){
             if(data.list.errcode===10000){
             $scope.userInfo=data.list.data;
             }else{
             $scope.alertTab(data.list.message);
             }
             })*/
        })

        $scope.changeUserInfo = function () {
            if (!$scope.userInfo) {
                return;
            }
            //如果是安卓手机，跳到原生界面
            if (deviceId == '1') {
                connectWebViewJavascriptBridge(function (bridge) {
                    //回app
                    bridge.callHandler('updateUserInfo', $scope.userInfo, function (response) {

                    })
                });
            } else {
                $state.go('setuserinfo', {obj: $scope.userInfo});
                $ionicViewSwitcher.nextDirection('forward');
            }

        }
        //处理安卓返回
        connectWebViewJavascriptBridge(function (bridge) {
            bridge.registerHandler('upDateUserInfoResult', function (response) {
                androidUpdate();
            })
        });

        //安卓回来之后重新更新数据
        function androidUpdate() {
            userService.getUserInfo({userId: userService.userMess.userId}).then(function (data) {
                if (data.list.errcode === 10000) {
                    $scope.userInfo = data.list.data;
                    userService.userMess.birthday = $scope.userInfo.birthday;
                    userService.userMess.address = $scope.userInfo.address;
                    userService.userMess.email = $scope.userInfo.email;
                    userService.userMess.name = $scope.userInfo.name;
                    userService.userMess.portrait = $scope.userInfo.portrait;
                    userService.userMess.realName = $scope.userInfo.realName;
                } else {
                    $scope.alertTab(data.list.message);
                }
            })
        }

        //调用原生api设置用户头像
        $scope.setPortrait = function () {
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: '从相册选择'},
                    {text: '从相机拍照'}
                ],
                titleText: '选择相机或者相册',
                buttonClicked: function (index) {
                    var data = {type: index};
                    connectWebViewJavascriptBridge(function (bridge) {
                        //回app
                        bridge.callHandler('modifyAvatar', data, function (response) {
                        })
                    });
                    return true;
                }
            })
        }

        //去修改用户姓名
        $scope.toModifyName = function () {
            $state.go('setUsername', {});
            $ionicViewSwitcher.nextDirection('forward');
        }

        //去修改密码
        $scope.toModifyPassowrd = function () {
            $state.go('modifyPassowrd', {});
            $ionicViewSwitcher.nextDirection('forward');
        }
    }])
    .controller('userInfoSave', ['$scope', '$state', 'userService', '$filter', '$ionicActionSheet', function ($scope, $state, userService, $filter, $ionicActionSheet) {
        $scope.userInfo = {};
        angular.copy($state.params.obj, $scope.userInfo);
        /*var date=new Date(parseInt($scope.userInfo.birthday));
         var year=date.getFullYear();
         var month=(date.getMonth()>9)?date.getMonth()+1:'0'+(date.getMonth()+1);
         var myDate=(date.getDate()>9)?date.getDate():'0'+date.getDate();
         $scope.userInfo.birthday=year+'-'+month+'-'+myDate;*/
        $scope.userInfo.birthday = new Date($scope.userInfo.birthday);

        $scope.saveChangeInfo = function () {
            updateUserInfo($scope.userInfo);
        }
        function updateUserInfo(val) {
            var phoneReg = /^1[3|5|7|8]\d{9}$/;
            if (!phoneReg.exec($scope.userInfo.phone)) {
                $scope.alertTab('请输入正确的手机号码');
                return;
            }
            userService.updateUserInfo(val).then(function (data) {
                if (data.list.errcode == 10000) {
                    $scope.alertTab('修改成功', $scope._goback(-1));
                } else {
                    $scope.alertTab(data.list.message);
                }
            })
        }

        $scope.change = function () {

        }

        $scope.choiceGender = function (val) {
            if ($scope.userInfo.gender == val) {
                return;
            }
            $scope.userInfo.gender = val
        }

        $scope.showSheet = function () {
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: '从相册选择'},
                    {text: '从相机拍照'}
                ],
                titleText: '选择相机或者相册',
                cancelText: '取消',
                buttonClicked: function (index) {
                    var data = {type: index};
                    connectWebViewJavascriptBridge(function (bridge) {
                        //回app
                        bridge.callHandler('modifyAvatar', data, function (response) {
                        })
                    });
                    return true;
                }
            })
        }
        connectWebViewJavascriptBridge(function (bridge) {
            bridge.registerHandler('uploadAvatarSucceed', function (response) {
                userService.userMess.portrait = response;
                $scope.userInfo.portrait = response;
                $scope.$digest();
            })
        });
    }])
    .controller('setUserName', ['$scope', '$state', '$ionicViewSwitcher', function ($scope, $state, $ionicViewSwitcher) {
        $scope.user = {
            name: '富康小龙'
        };
        $scope.sureSubmit = function () {
            console.log(!$scope.user.name);
            if (!$scope.user.name) {
                $scope.alertTab('请输入正确的用户名');
            }
        };

        $scope.cleanName = function () {
            $scope.user.name = '';
        }
    }])
    .controller('setUserPassword', ['$scope', '$state', '$ionicViewSwitcher', function ($scope, $state, $ionicViewSwitcher) {
        $scope.sureSubmit = function () {
            $scope.alertTab('修改成功');
        }
    }])
