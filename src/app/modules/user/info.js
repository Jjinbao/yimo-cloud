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
                userService.userMess=data;
            }
        }).error(function(){
            $scope.alertTab('网络异常,请检查网络!',$scope.netBreakBack);
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
            bridge.registerHandler('uploadAvatarSucceed', function (response,responseCallback) {
                userService.userMess.smallImg = response.smallImg;
                $scope.userMsg.smallImg = response.smallImg;
                $scope.$digest();
                responseCallback('------modify portrait success---------');
            })
        });
    }])
    .controller('setUserName', ['$scope', '$state','$http','userService','$ionicViewSwitcher', function ($scope, $state,$http,userService, $ionicViewSwitcher) {
        $scope.user = {
            name: userService.userMess.userName
        };
        $scope.sureSubmit = function () {
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
            }).error(function(){
                $scope.alertTab('网络异常,请检查网络!');
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

          if($scope.password.oldPassword.length<8){
            $scope.alertTab('旧密码不能少于8位');
            return;
          }

            if(!$scope.password.newPassword){
                $scope.alertTab('请输入新密码');
                return;
            }

          if($scope.password.newPassword.length<8){
            $scope.alertTab('新密码不能少于8位');
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
                if(data.result==1){
                    $scope._goback(-1);
                }else if(data.result==103){
                    $scope.alertTab('当前密码输入错误');
                }
              $scope.doubleClick=false;
            }).error(function(){
                $scope.alertTab('网络异常,请检查网络!');
              $scope.doubleClick=false;
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