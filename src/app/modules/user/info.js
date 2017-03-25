'use strict'

angular.module('swalk.userinfo', [])
    .controller('userInfo', ['$scope', 'userService', '$state','$http','$ionicViewSwitcher', '$ionicActionSheet', function ($scope, userService, $state,$http,$ionicViewSwitcher, $ionicActionSheet) {
        //获取用户信息
        $scope.$on('$ionicView.beforeEnter',function(){
            $scope.hideTabBar('hide');
        })
        $scope.userMsg={};
        $http({
            url:urlStr+'ym/account/getInfo.api',
            method:'POST',
            params:{
                accountId:userService.userMess.accountId,
                sign:md5('ymy'+userService.userMess.accountId)
            }
        }).success(function(data){
            if(data.result==1){
                $scope.userMsg=data;
                console.log('----------------------');
                console.log($scope.userMsg);
            }
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

        $scope.showPortraitChoice=function(){
            $scope.indexShowModelBackground();
            $scope.indexShowPortrait();
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
        //退出登录
        $scope.toLoginOut=function(){
            userService.userMess={};
            connectWebViewJavascriptBridge(function (bridge) {
                //回app
                bridge.callHandler('exitLogin', null, function (response) {

                })
            });
            $scope._goback();
        }
        //上传成功的回调
        connectWebViewJavascriptBridge(function (bridge) {
            bridge.registerHandler('uploadAvatarSucceed', function (response) {
                userService.userMess.smallImg = response.smallImg;
                $scope.userMsg.smallImg = response.smallImg;
                $scope.$digest();
            })
        });
    }])
    //.controller('userInfoSave', ['$scope', '$state', 'userService', '$filter', '$ionicActionSheet', function ($scope, $state, userService, $filter, $ionicActionSheet) {
    //    $scope.userInfo = {};
    //    angular.copy($state.params.obj, $scope.userInfo);
    //    /*var date=new Date(parseInt($scope.userInfo.birthday));
    //     var year=date.getFullYear();
    //     var month=(date.getMonth()>9)?date.getMonth()+1:'0'+(date.getMonth()+1);
    //     var myDate=(date.getDate()>9)?date.getDate():'0'+date.getDate();
    //     $scope.userInfo.birthday=year+'-'+month+'-'+myDate;*/
    //    $scope.userInfo.birthday = new Date($scope.userInfo.birthday);
    //
    //    $scope.saveChangeInfo = function () {
    //        updateUserInfo($scope.userInfo);
    //    }
    //    function updateUserInfo(val) {
    //        var phoneReg = /^1[3|5|7|8]\d{9}$/;
    //        if (!phoneReg.exec($scope.userInfo.phone)) {
    //            $scope.alertTab('请输入正确的手机号码');
    //            return;
    //        }
    //        userService.updateUserInfo(val).then(function (data) {
    //            if (data.list.errcode == 10000) {
    //                $scope.alertTab('修改成功', $scope._goback(-1));
    //            } else {
    //                $scope.alertTab(data.list.message);
    //            }
    //        })
    //    }
    //
    //    $scope.change = function () {
    //
    //    }
    //
    //    $scope.choiceGender = function (val) {
    //        if ($scope.userInfo.gender == val) {
    //            return;
    //        }
    //        $scope.userInfo.gender = val
    //    }
    //
    //
    //    $scope.showSheet = function () {
    //        var hideSheet = $ionicActionSheet.show({
    //            buttons: [
    //                {text: '从相册选择'},
    //                {text: '从相机拍照'}
    //            ],
    //            titleText: '选择相机或者相册',
    //            cancelText: '取消',
    //            buttonClicked: function (index) {
    //                var data = {type: index};
    //                connectWebViewJavascriptBridge(function (bridge) {
    //                    //回app
    //                    bridge.callHandler('modifyAvatar', data, function (response) {
    //                    })
    //                });
    //                return true;
    //            }
    //        })
    //    }
    //
    //}])
    .controller('setUserName', ['$scope', '$state','$http','userService','$ionicViewSwitcher', function ($scope, $state,$http,userService, $ionicViewSwitcher) {
        $scope.user = {
            name: userService.userMess.userName
        };
        $scope.sureSubmit = function () {
            console.log(!$scope.user.name);
            if (!$scope.user.name) {
                $scope.alertTab('请输入正确的用户名');
                return;
            }
            $http({
                url:urlStr+'ym/account/updateInfo.api',
                method:'POST',
                params:{
                    accountId:userService.userMess.accountId,
                    userName:encodeURI($scope.user.name),
                    sign:md5('ymy'+userService.userMess.accountId+$scope.user.name)
                }
            }).success(function(data){
                if(data.result==1){
                    userService.userMess.userName=$scope.user.name;
                    $scope._goback();
                }else{

                }
            })
        };

        $scope.cleanName = function () {
            $scope.user.name = '';
        }
    }])
    .controller('setUserPassword', ['$scope', '$state','$http', '$ionicViewSwitcher','userService', function ($scope, $state,$http, $ionicViewSwitcher,userService) {

        $scope.password={
            oldPassword:'',
            newPassword:''
        }
        $scope.doubleClick=false;
        $scope.sureSubmit = function () {
            if($scope.doubleClick){
                return;
            }
            if(!$scope.password.oldPassword){
                $scope.alertTab('请输入旧密码');
                return;
            }

            if(!$scope.password.newPassword){
                $scope.alertTab('请输入新密码');
                return;
            }

            $scope.doubleClick=true;
            $http({
                url:urlStr+'ym/account/updatePassword.api',
                method:'POST',
                params:{
                    phone:userService.userMess.phone,
                    oldPassword:md5($scope.password.oldPassword),
                    newPassword:md5($scope.password.newPassword),
                    sign:md5('ymy'+md5($scope.password.newPassword)+md5($scope.password.oldPassword)+userService.userMess.phone)
                }
            }).success(function(data){
                console.log(data);
                if(data.result==1){
                    $scope._goback(-1);
                }
            })
        }

        $scope.cleanPassword=function(){
            $scope.password.oldPassword='';
        }

        $scope.inputType='password';
        $scope.openEye=function(){
            if($scope.inputType=='password'){
                $scope.inputType='text';
            }else{
                $scope.inputType='password';
            }
        }

    }])
