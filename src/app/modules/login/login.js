'use strict'

angular.module('swalk.login', [])
    .controller('userLogin', ['$scope','$http','$interval','$state','$ionicViewSwitcher','userService',
        function ($scope,$http,$interval,$state,$ionicViewSwitcher,userService) {
            var inFrom=$state.params.code;
            var login = this;
            this.loginType='MM';
            this.phoneNumber='';
            this.loginCode='';
            this.loginPassword='';
            this.buttonName='获取验证码'
            this.canSend=true;
            this.countTime=60;
            var intervalId;
            var phoneReg=/^1[3|5|7|8]\d{9}$/;
            this.changeLoginType=function(type){
                if(this.loginType===type){
                    return;
                }
                login.loginType=type;
            }
            this.sendCode=function(){
                if(!login.canSend){
                    return;
                }
                if(!phoneReg.exec(login.phoneNumber)){
                    $scope.alertTab('请填写正确的手机号码');
                    return;
                }
                userService.checkCode(login.phoneNumber)
                    .then(function(data){

                    },
                    function(error){

                    }
                )
                login.canSend=false;
                intervalId=$interval(function(){
                    if(login.countTime>1){
                        login.buttonName=(--login.countTime)+'秒后获取';
                    }else{
                        $interval.cancel(intervalId);
                        login.countTime=60;
                        login.buttonName='重新获取';
                        login.canSend=true;
                    }
                },1000);
            }

            //区分用什么方式登录
            this.loginStatus=function(){
                if(login.loginType==='MM'){
                    login.doPassword();
                }else if(login.loginType==='YZM'){
                    login.doLogin();
                }
            }

            //密码登录方式
            this.doPassword=function(){
                if(!phoneReg.exec(login.phoneNumber)){
                    $scope.alertTab('请填写正确的手机号')
                    return;
                }

                if(login.loginPassword.toString().length<6){
                    $scope.alertTab('请输入正确的密码');
                    return;
                }
                userService.passwordLogin(login.phoneNumber,login.loginPassword).then(function(data){
                    if(data.list.errcode===10000){
                        console.log(data);
                        data.list.data.timestamp=new Date().getTime();//增加存储时间戳
                        if(appType==0){
                            try{
                                window.localStorage.setItem('userInfo',JSON.stringify(data.list.data));
                            }catch(e){
                                console.log(e);
                            }
                        }else if(appType==1){
                            data.list.data.password=login.loginPassword;
                            connectWebViewJavascriptBridge(function (bridge) {
                                    //回app
                                bridge.callHandler('userMessage', data.list.data, function (response) {
                                    console.log(response);
                                })
                            });
                        }
                        angular.copy(data.list.data,userService.userMess);
                        $scope._goback(-1);
                    }else{
                        $scope.alertTab(data.list.message);
                        return;
                    }
                })
            }
            function isLocalStorageNameSupported() {
                try { return (localStorageName in win && win[localStorageName]) }
                catch(err) { return false }
            }
            //验证码登录方式
            this.doLogin=function(){
                if(!phoneReg.exec(login.phoneNumber)){
                    $scope.alertTab('请填写正确的手机号')
                    return;
                }
                if(login.loginCode.toString().length!=6){
                    $scope.alertTab('请输入正确的验证码');
                    return;
                }

                userService.login(login.phoneNumber,login.loginCode).then(function(data){
                    if(data.list.errcode!=10000){
                        $scope.alertTab(data.list.message);
                        return;
                    }else{
                        angular.copy(data.list.data,userService.userMess);
                        if(appType==0){
                            data.list.data.timestamp=new Date().getTime();//增加存储时间戳
                            try{
                                window.localStorage.setItem('userInfo',JSON.stringify(data.list.data));
                            }catch(e){
                                console.log(e);
                            }
                        }else if(appType==1){
                            connectWebViewJavascriptBridge(function (bridge) {
                                    //回app
                                bridge.callHandler('userMessage', data.list.data, function (response) {
                                    console.log(response);
                                })
                            });
                        }
                        $scope._goback(-1);
                    }
                })
            }

            //忘记密码
            this.forgot=function(){
                $state.go('repassword',{used:'ZH'});
                $ionicViewSwitcher.nextDirection('forward');
            }

            //获取用户联系人信息
            function getUserConect(){
                userService.getContact(userService.userMess.userId)//在用户登录界面就获取用户的联系人信息
                    .then(
                    function(data){
                        if(data.list.errcode===10000){
                            userService.userContact=[];
                            angular.copy(data.list.data,userService.userContact);
                            try{
                                window.localStorage.setItem('contact',JSON.stringify(data.list.data));
                            }catch(e){
                                console.log(e);
                            }

                            $scope._goback(-1);
                        }else{
                            $scope.alertTab(data.list.message);
                        }
                    },
                    function(error){
                    }
                )
            }

            $scope.goBackMine=function(){
                if(inFrom=='mine'){
                    $state.go('tabs.mine',{});
                    $ionicViewSwitcher.nextDirection('back');
                }else if(inFrom=='timeout'){
                    $state.go('tabs.home',{});
                    $ionicViewSwitcher.nextDirection('back');
                }else{
                    $scope._goback(-1);
                }
            }

            $scope.$on('$destroy',function(evt){
                if(intervalId){
                    $interval.cancel(intervalId);
                }
            })
        }])
