'use strict'

angular.module('tab.mine',[])
    .controller('mineCtrl', ['$scope','$state','$http','$ionicViewSwitcher','$ionicHistory','$ionicScrollDelegate','userService', function($scope,$state,$http,$ionicViewSwitcher,$ionicHistory,$ionicScrollDelegate,userService) {

        if(appType===0){
            $scope.ionContentTop={'margin-top': '76px !important'}
        }else{
            $scope.ionContentTop={'margin-top':'56px !important'}
        }
        var login=false;
        var minetab=this;
        this.userInfo=userService.userMess;
        $scope.portrary='';
        if(userService.userMess&&userService.userMess.portrait){
            $scope.portrary=userService.userMess.portrait;
        }else{
            $scope.portrary='app/img/user_head.jpg';
        }
        //每次回到首页都要清理一下历史记录
        $scope.$on('$ionicView.afterEnter',function(){
            $ionicHistory.clearHistory();

        })
        this.toItems=function(val){
            if(minetab.userInfo.userId){
                switch (val){
                    case 'order':
                        this.myOrders();
                        break;
                    case 'rsb':
                        this.myRsb();
                        break;
                    case 'asset':
                        this.myAsset();
                        break;
                    case 'contact':
                        this.myContact();
                        break;
                    case 'store':
                        this.myStore();
                        break;
                    case 'changeword':
                        this.setting();
                        break;
                    case 'coupon':
                        this.coupon();
                        break;
                    case 'setting':
                        this.setting();
                        break;
                    case 'help':
                        this.help();
                        break;
                    case 'service':
                        this.customerService();
                        break;
                }
            }else{
                toLogin();
            }
        }
        function toLogin(){
            $state.go('login');
            $ionicViewSwitcher.nextDirection('forward');
        }

        //我的订单
        this.myOrders=function(){
            $state.go('goods',{});
            $ionicViewSwitcher.nextDirection('forward');
        }

        //我的优惠券
        this.coupon=function(){
            $state.go('coupon',{});
            $ionicViewSwitcher.nextDirection('forward');
        }

        //我的荣盛币
        this.myRsb=function(){
            $state.go('rsb',{});
            $ionicViewSwitcher.nextDirection('forward');
        }

        //我的资产
        this.myAsset=function(){
            $state.go('asset',{});
            $ionicViewSwitcher.nextDirection('forward');
        };

        //我的联系人
        this.myContact=function(){
            $state.go('comlinkman',{});
            $ionicViewSwitcher.nextDirection('forward');
        }

        //设置
        this.setting=function(){
            $state.go('set',{});
            $ionicViewSwitcher.nextDirection('forward');
        }

        //我的收藏
        this.myStore=function(){
            $state.go('collection',{});
            $ionicViewSwitcher.nextDirection('forward');
        }

        //帮助中心
        this.help=function(){
            connectWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler('helpCenter', null, function (response) {
                    console.log(response);
                })
            })
        }
        //客服
        this.customerService=function(){
            connectWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler('onlineService', null, function (response) {
                    console.log(response);
                })
            })
        }

        this.quit=function(){
            localStorage.clear();
            userService.userMess={};
            $scope.portrary='app/img/user_head.jpg';
            minetab.userInfo={};
            $ionicScrollDelegate.scrollTop(true);
            /*if(appType==1){
                connectWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('exitLogin', null, function (response) {
                        console.log(response);
                    })
                })
            }*/
        }

        //去用户详细信息
        $scope.toUserInfo=function(){
            if(userService.userMess.userId){
                $state.go('userinfo',{});
                $ionicViewSwitcher.nextDirection('forward');
            }else{
                toLogin();
            }
        }

        $scope.test=function(){
            $state.go('payresult', {status: '7',type:'scan-pay'});
        }
        var phone='13888888888';
        var password='12345678';
        var sign=md5('ymy'+md5(password)+phone);
        console.log(sign);
        /*$http({
            url:'/ym/account/register.api',
            method:'POST',
            params:{
                phone:phone,
                password:md5(password),
                sign:sign
            }
        }).success(function(data){
            console.log(data);
        })*/
        $http({
            url:'/ym/account/login.api',
            method:'POST',
            params:{
                phone:phone,
                password:md5(password),
                sign:sign
            }
        }).success(function(data){
            console.log(data);
        })
    }])