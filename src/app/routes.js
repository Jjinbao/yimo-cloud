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
                        controller: 'homeCtrl'
                    }
                }
            })
            .state('tabs.video', {
                url: "/video",
                views: {
                    'stay-tab': {
                        templateUrl: "app/modules/video/video.list.html",
                        controller: 'videoListCtrl'
                    }
                }
            })
            .state('tabs.holiday', {
                url: "/passage",
                views: {
                    'holiday-tab': {
                        templateUrl: "app/modules/passage/passage.html",
                        controller: 'passageCtrl'
                    }
                }
            })
            .state('addapp',{
                url:'/home/addapp',
                templateUrl:'app/modules/home/addapp.html',
                controller:'addApp'
            })
            .state('passageDetail', {
                url: "/detail/:id",
                templateUrl:'app/modules/passageDetail/detail.html',
                controller:'passageDetail',
                cache:'false'
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
                url:'/login/:ragion',
                templateUrl:'app/modules/login/login.html',
                controller:'userLogin',
                controllerAs:'login',
                cache:'false'
            })
            //注册+修改密码
            .state('register',{
                url:'/reg/:operation',
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
            //帮助与反馈
            .state('helpAnFeed',{
                url:'/help/feedback/:timestamp',
                templateUrl:'app/modules/help/help.feed.html',
                controller:'helpAnFeed'
            })
            //反馈记录
            .state('feedRecord',{
                url:'/feed/record',
                templateUrl:'app/modules/help/feed.record.html',
                controller:'feedBackRecord'
            })
            //常见为题
            .state('questionList',{
                params:{viewTitle:''},
                url:'/question/list/:categoryId/:timestamp',
                templateUrl:'app/modules/help/question.list.html',
                controller:'questionList'
            })
            //常见问题解答
            .state('commonQuestion',{
                params:{question:''},
                url:'/common/question',
                templateUrl:'app/modules/help/common.answer.html',
                controller:'commonQuestion'
            })
            .state('feedQuestion',{
                params:{ques:''},
                url:'/questioin/feed:timestamp',
                templateUrl:'app/modules/help/feed.detail.tpl.html',
                controller:'feedDetail'
            })
            .state('toFeedQuestion',{
                url:"/feed/question/:cid/:group",
                templateUrl:'app/modules/help/feed.question.html',
                controller:'toFeedQues',
                cache:false
            })
            //历史记录
            .state('history',{
                url:'/history',
                templateUrl:'app/modules/history/history.tpl.html',
                controller:'historyRecord'
            })
            .state('application',{
                url:'/applicaiton/list/:timestamp',
                templateUrl:'app/modules/history/application.tpl.html',
                controller:'application'
            })
            .state('teaching',{
                url:'/teaching/list/:timestamp',
                templateUrl:'app/modules/history/teaching.tpl.html',
                controller:'teaching'
            })
            .state('infoMsg',{
                url:'/infomsg/list/:timestamp',
                templateUrl:'app/modules/history/information.tpl.html',
                controller:'information'
            })
            //关于我们
            .state('about',{
                url:'/about/app',
                templateUrl:'app/modules/about/about.html',
                controller:'aboutApp'
            })
            //视频播放页面
            .state('videoDetail',{
                params:{vsrc:'',title:''},
                url:'/video/:detail/:rootId/:id',
                templateUrl:'app/modules/historyDetail/video.detail.html',
                controller:'historyVideoDetail'
            })
            //图文展示页面
            .state('infoDetail',{
                url:'/info/:from/:rootId/:id',
                templateUrl:'app/modules/historyDetail/info.detail.html',
                controller:'historyInfoDetail',
                cache:false
            })
            .state('contact',{
                url:'/contact/us',
                templateUrl:'app/modules/contact/contact.tpl.html'
            })
        //发表评论
            .state('comment',{
                url:'/comment/:rootId/:id',
                templateUrl:'app/modules/comment/comment.tpl.html',
                controller:'comment'
            })
            .state('category',{
                url:'/category',
                templateUrl:'app/modules/video/category.tpl.html',
                controller:'category'
            })

        $urlRouterProvider.otherwise("/tab/video");
    });
