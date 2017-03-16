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
            .state('tabs.recholiday', {
                url: '/second/:id/:picid/:city',
                views: {
                    'home-tab': {
                        templateUrl: 'app/modules/home/home.holiday.html',
                        controller: 'recHoliday'
                    }
                }
            })
            .state('emplayvip', {
                url: '/employee/vip',
                templateUrl: 'app/modules/home/employee.html',
                controller: 'emplayeeVip',
                cache:'false'

            })
            .state('travelDetail', {
                url: '/travel/detail/:pid',
                templateUrl: 'app/modules/traveldetail/travel.html',
                controller: 'travelDetail',
                controllerAs:'travel'
            })
            .state('fillorder',{
                params: {date: null, price: null,dateId:null,preOrderData:null},
                url:'/travel/fillorder/:pid',
                templateUrl:'app/modules/order/fill.order.html',
                controller:'fillorder',
                controllerAs:'order'
            })
            .state('choiceDate',{
                params: {pid: null},
                url:'/travel/fillorder/:pid/choiceDate',
                templateUrl:'app/modules/order/fill.order.choiceDate.html',
                controller: 'fillorderChoiceDateCtrl'
            })
            .state('payorder',{
                url:'/pay/payorder',
                templateUrl:'app/modules/pay/pay.html',
                controller:'payctrl',
                cache:'false'
            })
            .state('traveldate',{
                url:'/travel/date',
                templateUrl:'app/modules/traveldate/date.html',
                controller:'travelDate',
                controllerAs:'travelDate'
            })
            .state('choicecontact',{
                url:'/travel/contact/:usefor',
                templateUrl:'app/modules/contacts/contact.html',
                controller:'choiceContact'
            })

            .state('addcontact',{
                url:'/travel/add',
                cache:'false',
                templateUrl:'app/modules/addcontact/add.html',
                controller:'addContact'
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
            .state('stayChoiceDate', {
                params: {name: null},
                url: "/stayChoiceDate",
                templateUrl: "app/modules/stay/stay.choiceDate.html",
                controller: 'stayChoiceDateCtrl',
                cache:false
            })
            .state('citylist',{
                url: '/list/city',
                templateUrl: 'app/modules/city/city.html',
                controller: 'cityList',
                cache:false
            })
            .state('condition',{
                url: '/device/choice',
                templateUrl: 'app/modules/condition/term.html',
                controller: 'serviceDevice',
                cache:false
            })
            .state('staylist', {
                params: {stayInDate: null, stayOutDate: null},
                url: '/stay/list/:name',
                templateUrl: 'app/modules/staylist/stay.list.html',
                controller: 'stayList',
                cache:false
            })
            .state('stayDetail', {
                url: '/stay/detail/:pid',
                templateUrl: 'app/modules/staydetail/stay.html',
                controller: 'stayDetail'
            })
            //商品详情图片
            .state('detailImage',{
                params:{'data':''},
                url: '/detail/images',
                templateUrl: 'app/modules/imgs/images.html',
                controller: 'detailImages',
                cache:'false'
            })
            .state('stayOrder',{
                params:{data:''},
                url: '/stay/order/:pid',
                templateUrl: 'app/modules/stayorder/order.html',
                controller: 'stayFillorder'
            })
            .state('orderStayChoiceDate',{
                params: {id: null},
                url: '/stayOrderChoiceDate',
                templateUrl: 'app/modules/stayorder/order.chioceDate.html',
                controller: 'orderChioceDateCtrl'
            })
            .state('remark',{
                url: '/stay/remark',
                templateUrl: 'app/modules/remark/remark.html',
                controller: 'stayRemark'
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
            .state('setuserinfo',{
                params:{obj:''},
                url:'/user/setting',
                templateUrl:'app/modules/user/setinfo.html',
                controller:'userInfoSave',
                cache:false
            })
            //修改支付密码方式
            .state('changetype',{
                url:'/change/type',
                templateUrl:'app/modules/change/type.html',
                controller:'changeType',
                cache:'false'
            })
            //修改登录密码方式
            .state('loginpasswordtype',{
                url:'/password/type',
                templateUrl:'app/modules/password/type.html',
                controller:'changeLoginType',
                cache:'false'
            })
            //忘记支付密码
            .state('identity',{
                url:'/change/identity/:memery/:from',
                templateUrl:'app/modules/identity/identity.html',
                controller:'identity',
                cache:'false'
            })
            .state('reset',{
                url:'/change/reset/:memery',
                templateUrl:'app/modules/reset/reset.html',
                controller:'reset',
                cache:'false'
            })
            .state('confirm',{
                url:'/change/confirm/:memery',
                templateUrl:'app/modules/confirm/confirm.html',
                controller:'confirm',
                cache:'false'
            })
            .state('agreement',{
                url:'/swalk/agreement',
                templateUrl:'app/modules/agreement/agreement.html',
                cache:'false'
            })
            .state('goods',{
                url:'/goods/orders/:from',
                templateUrl:'app/modules/goods/goods.html',
                controller:'myOrders',
                controllerAs:'goods',
                cache:'false'
            })
            //用户常用联系人信息
            .state('comlinkman',{
                url:'/mine/linkman',
                templateUrl:'app/modules/comlink/linkman.html',
                controller:'linkman',
                cache:'false'
            })
            //设置
            .state('set',{
                url:'/mine/set',
                templateUrl:'app/modules/set/set.html',
                controller:'setting',
                cache:'false'
            })
            .state('about',{
                url:'/about/app',
                templateUrl:'app/modules/about/about.html',
                controller:'aboutApp'
            })
            //我的收藏
            .state('collection',{
                url:'/mine/store',
                templateUrl:'app/modules/store/store.html',
                controller:'mineStore',
                cache:'false'
            })
            //我的荣盛币
            .state('rsb',{
                params:{type:null},
                url:'/rsb/myrsb',
                templateUrl:'app/modules/rsb/rsb.html',
                cache:'false',
                controller:'myrsb'
            })
            //赠与输入手机号
            .state('giftrsb',{
                url:'/gift/rsb',
                templateUrl:'app/modules/rsbgive/give.html',
                controller:'giftrsb',
                cache:false
            })
            //确认赠与荣盛币
            .state('ensureGive',{
                url:'/ensure/give',
                templateUrl:'app/modules/rsbgive/sure.html',
                controller:'suregive'
            })
            .state('giftresult',{
                url:'/result/gift/:status',
                templateUrl:'app/modules/rsbgive/result.html',
                controller:'resultgive'
            })
            //优惠券
            .state('coupon', {
                url: "/coupon",
                templateUrl: "app/modules/coupon/coupon.html",
                controller: 'couponCtrl'
            })
            .state('couponDetail', {
                url: "/coupon/:id",
                templateUrl: "app/modules/coupon/coupon.detail.html",
                controller: 'couponDetailCtrl'
            })
            //可用优惠券
            .state('couponChoice',{
                url:'/choice/coupon',
                templateUrl:'app/modules/coupon/coupon.choice.html',
                controller:'couponChoice'
            })
            //购买荣盛币
            .state('buyrsb',{
                url:'/buyrsb/buy',
                templateUrl:'app/modules/buyrsb/buy.html',
                cache:'false',
                controller:'buyrsb'
            })
            //荣盛币使用说明
            .state('explain',{
                url:'/explain',
                templateUrl:'app/modules/rsb/explain.html',
                controller:'rsbexplain',
                cache:'false'
            })
            //荣盛币购买说明
            .state('buyexplain',{
                url:'/buyrsb/explain',
                templateUrl:'app/modules/buyrsb/explain.html'
            })
            //支付结果
            //0-支付成功 1-未完全支付 2-未支付
            .state('payresult',{
                url:'/pay/result/:status/:type',
                templateUrl:'app/modules/results/payment.html',
                controller:'payment'
            })
            //我的资产
            .state('asset',{
                url:'/asset',
                controller:'myAsset',
                templateUrl:'app/modules/asset/asset.html'
            })
            .state('assetDetail',{
                params:{"type": null},
                url:'/asset/detail',
                templateUrl:'app/modules/asset/asset.detail.html',
                controller:'assetDetailCtrl'
            })
            .state('assetNews',{
                url:'/asset/news',
                templateUrl:'app/modules/asset/asset.news.html',
                controller:'assetNewsCtrl'
            })
            .state('assetIncome',{
                url:'/asset/income',
                templateUrl:'app/modules/asset/asset.income.html',
                controller:'assetIncomeCtrl'
            })
            .state('assetIncomeDetail',{
                params:{income:null},
                url:'/asset/income/detail',
                templateUrl:'app/modules/asset/asset.income.detail.html',
                controller:'assetIncomeDetail'
            })
            .state('assetHousekeeper',{
                url: '/asset/housekeeper',
                templateUrl: 'app/modules/asset/asset.housekeeper.html',
                controller: 'housekeeperCtrl',
                cache:false
            })
            .state('assetHousekeeperReservation',{
                params:{"date": null,"appoint": false},
                url: '/asset/housekeeper/reservation',
                templateUrl: 'app/modules/asset/asset.housekeeper.reservation.html',
                controller: 'housekeeperReservationCtrl'
            })
            .state('maintenanceRecord',{
                url:'/asset/maintenance/record',
                templateUrl:'app/modules/asset/asset.maintence.record.html',
                controller:'maintenanceRecord'
            })
            .state('maintenanceRecordInfo',{
                params:{date:null},
                url:'/asset/repair/info',
                templateUrl:'app/modules/asset/repairInfo.html',
                controller:'maintenanceRecordInfo'
            })
        $urlRouterProvider.otherwise("/tab/mine");
    });
