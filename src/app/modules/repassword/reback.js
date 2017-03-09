'use strict'

angular.module('swalk.resetpass',[])
    .controller('resetPassword',['$scope','$state','$interval','userService',function($scope,$state,$interval,userService){
        var repass=this;
        if($state.params.used=='ZH'){
            repass.title='找回密码'
        }else if($state.params.used=='XG'){
            repass.title='修改密码'
        }
        this.reset={
            phoneNumber:'',
            loginCode:'',
            newPassword:'',
            surePassword:''
        }
        if(userService.userMess&&userService.userMess.phone){
            repass.reset.phoneNumber=userService.userMess.phone;
        }
        this.btnName='获取验证码'
        var phoneReg=/^1[3|5|7|8]\d{9}$/;
        //获取验证码
        this.canSend=true;
        this.countTime=60;
        this.sendCode=function(){
            if(!repass.canSend){
                return;
            }
            if(!phoneReg.exec(repass.reset.phoneNumber)){
                $scope.alertTab('请填写正确的手机号码');
                return;
            }
            repass.canSend=false;
            userService.getCallBackCode(repass.reset.phoneNumber)
                .then(function(data){
                    if(data.list.errcode===10000){
                        var intervalId=$interval(function(){
                            if(repass.countTime>1){
                                repass.btnName=(--repass.countTime)+'秒后获取';
                            }else{
                                $interval.cancel(intervalId);
                                repass.countTime=60;
                                repass.btnName='重新获取';
                                repass.canSend=true;
                            }
                        },1000);
                    }else{
                        $scope.alertTab(data.list.message);
                        repass.canSend=true;
                    }
                }
            )

        }
        this.doFinish=function(){
            if(!phoneReg.exec(repass.reset.phoneNumber)){
                $scope.alertTab('请填写正确的手机号码');
                return;
            }

            if(!repass.reset.loginCode||repass.reset.loginCode.toString().length!=6){
                $scope.alertTab('请输入正确的验证码');
                return;
            }

            if(!repass.reset.newPassword||repass.reset.newPassword.toString().length<6){
                $scope.alertTab('请至少输入6位密码');
                return;
            }

            if(!repass.reset.surePassword){
                $scope.alertTab('请再次输入密码进行确认');
                return;
            }
            if(repass.reset.surePassword!=repass.reset.newPassword){
                $scope.alertTab('两次输入密码不一致');
                return;
            }
            userService.resetPassowrd(repass.reset.phoneNumber,repass.reset.loginCode,repass.reset.newPassword)
                .then(function(data){
                    if(data.list.errcode===10000){
                        $scope.alertTab('密码修改成功',$scope.goback());
                    }else{
                        $scope.alertTab(data.list.message);
                    }
                })

        }

        $scope.goback=function(){
            $scope._goback(-1);
        }
    }])
    .controller('rememberLoginPassword',['$scope','userService',function($scope,userService){
        $scope.inputType='password';
        $scope.password={
            oldCode:'',
            newPassword:'',
            surePassword:''
        }
        $scope.showPassword=function(){
            if($scope.inputType=='password'){
                $scope.inputType='text';
            }else{
                $scope.inputType='password'
            }
        }
        $scope.saveChange=function(){
            if(!$scope.password.oldCode||$scope.password.oldCode.toString().length<6){
                $scope.alertTab('当前密码输入不正确');
                return;
            }

            if(!$scope.password.newPassword){
                $scope.alertTab('请输入新密码');
                return;
            }

            if($scope.password.newPassword.toString().length<6){
                $scope.alertTab('新密码必须为6-20位字符');
                return;
            }

            if(!$scope.password.surePassword){
                $scope.alertTab('请再次输入密码进行确认');
                return;
            }
            if($scope.password.newPassword!=$scope.password.surePassword){
                $scope.alertTab('两次输入密码不一致');
                return;
            }
            var obj={
                phone:userService.userMess.phone,
                oldPassword:$scope.password.oldCode,
                password:$scope.password.newPassword
            }
            userService.resetPasswordByOld(obj).then(function(data){
                if(data.list.errcode===10000){
                    $scope.alertTab('密码修改成功',$scope._goback(-1));
                }else{
                    $scope.alertTab(data.list.message);
                }
            })
        }
    }])
