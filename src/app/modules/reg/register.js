'use strict'

angular.module('ymy.register',[])
    .controller('userRegister',['$scope','$state','$http','$interval','$ionicHistory','$ionicViewSwitcher','$stateParams',function($scope,$state,$http,$interval,$ionicHistory,$ionicViewSwitcher,$stateParams){
        $scope.$on('$ionicView.beforeEnter',function(){
            $scope.hideTabBar('hide');
        })
        var operation=$stateParams.operation;
        $scope.regInfo={
            phone:'',
            code:'',
            randCode:'',
            identify:''
        }
        $scope.getCodeBtn='获取验证码';
        $scope.setName=function(){
            $state.go('regname',{});
            $ionicViewSwitcher.nextDirection('forward');
        }

        //获取图形验码啊接口
        $scope.userImgCode={
            code:''
        };
        $scope.getImgCode=function(){
            $http({
                url:urlStr+'ym/randCodeImage.api',
                method:'POST',
            }).success(function(data){
                $scope.imgCode=data;
            })
        }
        $scope.getImgCode();
        //返回上一级
        $scope.back=function(){
            if(operation==1){
              connectWebViewJavascriptBridge(function (bridge) {
                //回app
                bridge.callHandler('backToApp', null, function (response) {

                })
              });
            }else{
              $scope._goback(-1);
            }
        }
        //获取验证码
        $scope.canGetCode=true;
        $scope.timeLong=60;
        $scope.intervalId='';
        $scope.getYanCode=function(){
            if(!$scope.canGetCode){
                return;
            }
            console.log('0000000000000');
            if(!$scope.regInfo.phone){
                $scope.alertTab('请填写正确的手机号');
                return;
            }
            if($scope.userImgCode.code.toLowerCase()!=$scope.imgCode.code.toLowerCase()){
                $scope.alertTab('图形验证码不正确');
                if($scope.userImgCode.code){
                    $scope.userImgCode.code='';
                    $scope.getImgCode();
                }
                return;
            }

            $scope.canGetCode=false;
            var op=1;
            if(operation==3||operation==1){
                op=1;
            }else{
                op=2;
            }
            $http({
                url:urlStr+'ym/phoneCode/sendCode.api',
                method:'POST',
                params:{
                    phone:$scope.regInfo.phone,
                    operation:op,
                    sign:md5('ymy'+op.toString()+$scope.regInfo.phone)
                }
            }).success(function(data){
                console.log(data);
                if(data.result==1){
                    $scope.regInfo.identify=data.identifier;
                    $scope.intervalId=$interval(function(){
                        if($scope.timeLong>1){
                            $scope.timeLong--;
                            $scope.getCodeBtn=$scope.timeLong+'秒后获取';
                        }else{
                            $scope.canGetCode=true;
                            $scope.timeLong=60;
                            $scope.getCodeBtn='获取验证码';
                            $interval.cancel($scope.intervalId);
                        }
                    },1000);
                }else{
                    if(data.result==102){
                        $scope.alertTab('手机号不合法');
                    }else if(data.result==103){
                        $scope.alertTab('手机号已经注册');
                    }else if(data.result==104){
                        $scope.alertTab('手机号还没有注册');
                    }
                    $scope.canGetCode=true;
                }

            }).error(function(){
                $scope.canGetCode=true;
                $scope.alertTab('网络异常,请检查网络!');
            })

        }
        //校验验证码
        $scope.doubleClick=true;

        $scope.ensureCode=function(){
            if(!$scope.regInfo.phone||!$scope.regInfo.code){
                $scope.alertTab('请填写手机号和验证码');
                return;
            }
            if(!$scope.doubleClick){
                return;
            }
            $scope.doubleClick=false;
            $http({
                url:urlStr+'ym/phoneCode/checkCode.api',
                method:'POST',
                params:{
                    phone:$scope.regInfo.phone,
                    identifier:$scope.regInfo.identify,
                    randCode:$scope.regInfo.code,
                    sign:md5('ymy'+$scope.regInfo.identify+$scope.regInfo.phone+$scope.regInfo.code)
                }
            }).success(function(data){
                console.log(data);
                if(data.result==1){
                    if(data.checkFlag==1){
                        if(operation==1||operation==3){
                            $scope.regSetName();
                        }else if(operation==2){
                            $scope.resetPassword();
                        }
                    }else if(data.checkFlag==2){
                        $scope.alertTab('验证码错误');
                        $scope.doubleClick=true;
                    }else if(data.checkFlag==3){
                        $scope.alertTab('验证码已过期');
                        $scope.doubleClick=true;
                    }
                }else{
                    if(data.result==102){
                        $scope.alertTab('手机号不合法');
                    }else if(data.result==103){
                        $scope.alertTab('系统错误');
                    }
                    $scope.doubleClick=true;
                }
            }).error(function(){
                $scope.doubleClick=true;
                $scope.alertTab('网络异常,请检查网络!');
            })
            // if(operation==1||operation==3){
            //                     $scope.regSetName();
            //                 }else if(operation==2){
            //                     $scope.resetPassword();
            //                 }
        }

        //注册设置用户名和密码
        $scope.regSetName=function(){
            console.log('-----------执行的是这里--设置用户名密码');
            $state.go('regname',{phone:$scope.regInfo.phone});
            $ionicViewSwitcher.nextDirection('forward');
        }
        //重置密码
        $scope.resetPassword=function(){
            console.log('直接重新修改密码---------');
            $state.go('newPassword',{phone:$scope.regInfo.phone});
            $ionicViewSwitcher.nextDirection('forward');
        }

        $scope.$on('$destory',function(){
            if($scope.intervalId){
                $interval.cancel($scope.intervalId);
            }
        })
    }])
    .controller('regSetName',['$scope','$state','$http','$ionicHistory','$ionicViewSwitcher','userService',function($scope,$state,$http,$ionicHistory,$ionicViewSwitcher,userService){
        $scope.userInfo={
            name:'',
            phone:$state.params.phone,
            password:'',
            rePassword:''
        }

        $scope.back=function(){
            $ionicHistory.goBack(-4);
            $ionicViewSwitcher.nextDirection('back');
        }

        $scope.setUserInfo=function(){
            if(!$scope.userInfo.name){
                $scope.alertTab('请输入用户名');
                return;
            }

            if(!$scope.userInfo.password){
                $scope.alertTab('请设置密码');
                return;
            }

            if($scope.userInfo.password.length<8){
                $scope.alertTab('密码不能少于8位');
                return;
            }

            if(!$scope.userInfo.rePassword){
                $scope.alertTab('请确认密码');
                return;
            }

            if($scope.userInfo.password!=$scope.userInfo.rePassword){
                $scope.alertTab('两次输入密码不一致');
                return;
            }

            $http({
                url:urlStr+'ym/account/register.api',
                method:'POST',
                params:{
                    phone:$scope.userInfo.phone,
                    userName:encodeURI($scope.userInfo.name),
                    password:md5($scope.userInfo.password),
                    sign:md5('ymy'+md5($scope.userInfo.password)+$scope.userInfo.phone+$scope.userInfo.name)
                }
            }).success(function(data){
                if(data.result==1){
                    userService.userMess=data;
                    data.realPassword=$scope.userInfo.rePassword;
                    connectWebViewJavascriptBridge(function (bridge) {
                    //回app
                        bridge.callHandler('userMessage', data, function (response) {

                        })
                  });
                    //$state.go('tabs.mine',{});
                    //$ionicViewSwitcher.nextDirection('back');
                }else{
                    $scope.alertTab('注册失败,请重新注册');
                    $scope.doubleClick=true;
                }
            }).error(function(){
                $scope.alertTab('网络异常,请检查网络!');
            })
        }

    }])
    .controller('resetNewPassword',['$scope','$state','$http','$ionicHistory','$ionicViewSwitcher',function($scope,$state,$http,$ionicHistory,$ionicViewSwitcher){
        $scope.userInfo={
            phone:$state.params.phone,
            password:'',
            rePassword:''
        }
        $scope.back=function(){
            $state.go('login', {ragion:'setPassword'});
            $ionicViewSwitcher.nextDirection('forward');
        }

        $scope.finishReset=function(){

            if(!$scope.userInfo.password){
                $scope.alertTab('请设置密码');
                return;
            }

            if($scope.userInfo.password.length<8){
                $scope.alertTab('密码不能少于8位');
                return;
            }

            if(!$scope.userInfo.rePassword){
                $scope.alertTab('请确认密码');
                return;
            }

            if($scope.userInfo.password!=$scope.userInfo.rePassword){
                $scope.alertTab('两次输入密码不一致');
                return;
            }

            $http({
                url:urlStr+'ym/account/findPassword.api',
                method:'POST',
                params:{
                    phone:$scope.userInfo.phone,
                    password:md5($scope.userInfo.password),
                    sign:md5('ymy'+md5($scope.userInfo.password)+$scope.userInfo.phone)
                }
            }).success(function(data){
                if(data.result==1){
                    $state.go('login',{ragion:'mine'});
                    $ionicViewSwitcher.nextDirection('back');
                }else{
                    $scope.doubleClick=true;
                    $state.go('tabs.mine',{});
                    $ionicViewSwitcher.nextDirection('back');
                }
            }).error(function(){
                $scope.alertTab('网络异常,请检查网络!');
            })
        }
    }])
