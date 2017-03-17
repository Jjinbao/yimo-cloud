'use strict'

angular.module('swalk.route', [])
    .config(function ($stateProvider, $urlRouterProvider,$httpProvider,$ionicConfigProvider) {
        $stateProvider
            .state('tabs', {
                url: "/tab",
                abstract: true,
                templateUrl: "app/modules/tabs/tabs.html"
            })
            .state('tabs.home', {
                url: "/home",
                views: {
                    'home-tab': {
                        templateUrl: "app/modules/home/home.html",
                        controller: 'homeCtrl',
                        controllerAs: 'homeObj'
                    }
                }
            })

            .state('tabs.stay', {
                params: {stayInDate: null, stayOutDate: null},
                url: "/stay",
                views: {
                    'stay-tab': {
                        templateUrl: "app/modules/stay/stay.html",
                        controller: 'stayCtrl'
                    }
                }
            })

            .state('tabs.holiday', {
                url: "/holiday",
                views: {
                    'holiday-tab': {
                        templateUrl: "app/modules/holiday/holiday.html",
                        controller: 'holidayCtrl',
                        controllerAs:'holidaytab'
                    }
                }
            })
            //我的界面
            .state('tabs.mine', {
                url: "/mine",
                cache:"false",
                views: {
                    'mine-tab': {
                        templateUrl: "app/modules/mine/mine.html",
                        controller: 'mineCtrl',
                        controllerAs:'minetab'
                    }
                }
            })
            //登录
            .state('login',{
                params:{code:null},
                url:'/login',
                templateUrl:'app/modules/login/login.html',
                controller:'userLogin',
                controllerAs:'login',
                cache:'false'
            })
            //注册+修改密码
            .state('register',{
                params:{operation:null},
                url:'/register',
                templateUrl:'app/modules/reg/register.tpl.html',
                controller:'userRegister',
                cache:false
            })
            //设置用户名和密码
            .state('regname',{
                params:{phone:''},
                url:'/register/set',
                templateUrl:'app/modules/reg/reg.set.name.html',
                controller:'regSetName'
            })
            //忘记密码修改密码
            .state('newPassword',{
                params:{phone:''},
                url:'/password/reset',
                templateUrl:'app/modules/reg/set.password.tpl.html',
                controller:'resetNewPassword'
            })
            //用户信息
            .state('userinfo',{
                url:'/user/info',
                templateUrl:'app/modules/user/info.html',
                controller:'userInfo',
                cache:false
            })
            //修改用户名
            .state('setUsername',{
                url:'/modify/name',
                templateUrl:'app/modules/user/set.name.html',
                controller:'setUserName',
                cache:false
            })
            //修改登录密码
            .state('modifyPassowrd',{
                url:'/modify/password',
                templateUrl:'app/modules/user/set.password.html',
                controller:'setUserPassword',
                cache:false
            })
            //设置
            .state('set',{
                url:'/mine/set',
                templateUrl:'app/modules/set/set.html',
                controller:'setting',
                cache:'false'
            })
            .state('helpAnFeed',{
                url:'/help/feedback',
                templateUrl:'app/modules/help/help.feed.html',
                controller:'helpAnFeed'
            })
            //历史记录
            .state('history',{
                url:'/history',
                templateUrl:'app/modules/history/history.tpl.html',
                controller:'historyRecord'
            })
            //关于我们
            .state('about',{
                url:'/about/app',
                templateUrl:'app/modules/about/about.html',
                controller:'aboutApp'
            })

        $urlRouterProvider.otherwise("/tab/mine");
    });
