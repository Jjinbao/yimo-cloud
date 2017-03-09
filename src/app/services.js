'use strict'

angular.module('swalk.services', [])
    .service('IonicDatepickerService', function () {
        this.monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.getYearsList = function (from, to) {
            var yearsList = [];
            var minYear = 1900;
            var maxYear = 2100;
            minYear = from ? new Date(from).getFullYear() : minYear;
            maxYear = to ? new Date(to).getFullYear() : maxYear;
            for (var i = minYear; i <= maxYear; i++) {
                yearsList.push(i);
            }
            return yearsList;
        };
    })
    .service('userService', ['$http', '$q', '$location', function ($http, $q, $location) {
        var result = {
            //用户信息
            userMess: {},
            //用户联系人列表
            userContact: [],
            userOpenId: {},
            travelers: 0,//出游人
            contacter: {},//出游联系人
            traveldate: '',//出游日期
            massageCode: '',//修改支付密码时的短信验证码
            oldPwdValue: '',//修改密码时的旧支付密码
            newPwdValue: '',//将要修改成的新支付密码
            travelPrice: {},//每个人旅游的价格（目前暂时考虑成人）
            preOrderId: {id:'',type:''},//预订单编号,以及支付类型
            preOrderTitle: '',
            orderParams: {
                id: '',
                userId: '',
                productId: '',
                number:0
            },
            //获取登录验证码接口
            checkCode: function (phone) {
                var halfUrl = "/mobile/login/loginVerify";
                var postData = {"params": {"phone": phone}}
                return reqData(postData, halfUrl);

            },
            //验证码登录接口
            login: function (phone, code) {
                var halfUrl = '/mobile/login/login';
                var postData = {"params": {"phone": phone, "code": code}};
                return requestData(postData, halfUrl);
            },
            //密码登录接口
            passwordLogin: function (phone, password) {
                var halfUrl = '/mobile/login/loginByPwd';
                var postData = {"params": {"phone": phone, "password": password}};
                return requestData(postData, halfUrl);
            },
            //获取找回密码验证码
            getCallBackCode: function (phone) {
                var halfUrl = '/mobile/login/loginPwdCode';
                var params = {"params": {"phone": phone}};

                return requestData(params, halfUrl);
            },
            //修改密码 通过手机验证码
            resetPassowrd: function (phone, code, password) {
                var halfUrl = '/mobile/login/loginPwdChangeByCode';
                var params = {"params": {"phone": phone, "code": code, "password": password}};
                return requestData(params, halfUrl);
            },
            //修改密码 通过旧密码
            resetPasswordByOld:function(data){
                var halfUrl = '/mobile/login/changeLoginPwd';
                var params = {"params": data};
                return reqData(params, halfUrl);
            },

            //获取用户信息
            getUserInfo:function(data){
                var halfUrl = '/mobile/user/userInfo';
                var postData = {"params": data};
                return reqData(postData, halfUrl);
            },
            //更新用户信息
            updateUserInfo:function(data){
                var halfUrl = '/mobile/user/userUpdate';
                var postData = {"params": data};
                return reqData(postData, halfUrl);
            },
            //更改用户头像
            updateUserPortrait:function(){

            },
            //获取用户联系人
            getContact: function (uid) {
                var halfUrl = '/mobile/user/contactInfo';
                var postData = {"params": {"userId": uid}};
                return reqData(postData, halfUrl);
            },
            //增加用户联系人
            addContact: function (obj) {
                var halfUrl = '/mobile/user/contactModify';
                var postData = {"params": obj};
                return reqData(postData, halfUrl);
            },
            //删除用户联系人
            deleteContact:function(id){
                var halfUrl = '/mobile/user/contactCancel';
                var postData = {"params": {"id":id}};
                return reqData(postData, halfUrl);
            },
            //添加收藏
            addCollect: function (pid, category) {
                var halfUrl = '/mobile/user/collectAdd';
                var postData = {"params": {"userId": result.userMess.userId, "productId": pid, "category": category}};
                return reqData(postData, halfUrl);
            },
            //取消收藏
            removeCollect:function(userId,pid,category){
                var halfUrl = '/mobile/user/collectCancel';
                var postData = {"params": {"userId": userId, "productId": pid, "category": category}};
                return reqData(postData, halfUrl);
            },
            //检查用户是否已经修改过支付密码
            modifyPassword: function (uid) {
                var halfUrl = '/mobile/pay/isModifyPassword';
                var postData = {"params": {"userId": result.userMess.userId}};
                return reqData(postData, halfUrl);
            },
            //检查用户支付密码是否正确
            checkPayPwd: function (uid, pwd) {
                var halfUrl = '/mobile/pay/checkPayPwd';
                var postData = {"params": {"userId": result.userMess.userId, "password": pwd}};
                return reqData(postData, halfUrl);
            },
            //发送修改密码校验码
            sendPayCode: function (phone) {
                var halfUrl = '/mobile/pay/payVerify';
                var postData = {"params": {"phone": phone}};
                return reqData(postData, halfUrl);
            },
            //检查修改密码校验码
            checkPayCode: function (phone, code) {
                var halfUrl = '/mobile/pay/checkPayCode';
                var postData = {"params": {"phone": phone, "code": code}};
                return reqData(postData, halfUrl);
            },
            //通过旧支付密码修改支付密码
            changePayPwdOld: function (uid, pwd, oldPwd) {
                var halfUrl = '/mobile/pay/changePayPwd';
                var postData = {"params": {"userId": uid, "password": pwd, "oldPassword": oldPwd}};
                return reqData(postData, halfUrl);
            },
            //通过短信验证码修改支付密码
            changePayPwdCode: function (uid, pwd, phone, code) {
                var halfUrl = '/mobile/pay/changePayPwdByCode';
                var postData = {"params": {"userId": uid, "password": pwd, "phone": phone, "code": code}};
                return reqData(postData, halfUrl);
            },
            //获取日期对应的价格
            getDatePrice: function (pid, date) {
                var halfUrl = "/mobile/productDateTravel/datePrice";
                var data = {"params": {"month": date, "productId": pid}, "phone_size": 1};
                return reqData(data, halfUrl);
            },
            //生成预订单
            createOrder: function (uid, pid) {
                var halfUrl = "/mobile/orderTravel/createOrder";
                var data = {"params": {"userId": uid, "productId": pid}, "phone_size": 1};
                return reqData(data, halfUrl);
            },
            //获取订单详情
            orderTravelInfo: function (uid, orderId) {
                var halfUrl = "/mobile/orderTravel/info";
                var data = {"params": {"userId": uid, "id": orderId}, "phone_size": 1};
                return reqData(data, halfUrl);
            },
            //修改订单or确认订单
            changeOrder: function (obj) {
                var halfUrl = "/mobile/orderTravel/newChangeOrder";
                var data = {"params": obj, "phone_size": 1};
                return reqData(data, halfUrl);
            },
            //确认订单
            confirmOrder: function (obj) {
                var halfUrl = "/mobile/orderTravel/newConfirmOrder";
                var data = {"params": obj, "phone_size": 1};
                return reqData(data, halfUrl);
            },
            //预支付接口
            prePay: function (id, type) {
                var halfUrl = "/mobile/pay/prePay";
                var data = {"params": {"orderId": id, "orderType": type}, "phone_size": 1};
                return reqData(data, halfUrl);
            },
            //荣盛币支付
            rsbPay: function (data) {
                var postData = {"params": data};
                return jsApi(postData, rsbApi);
            },
            //微信记账接口
            weChartBill: function (data) {
                var postData = {"params": data};
                return jsApi(postData, weChartBillUrl);
            },
            //取消旅游订单
            cancleOrder: function (userId, id) {
                var halfUrl = "/mobile/orderTravel/cancel";
                var data = {"params": {"userId": userId, "id": id}, "phone_size": 1};
                return reqData(data, halfUrl);
            },
            //取消住宿订单
            cancleStayOrder:function(userId,id){
                var halfUrl = "/mobile/order/cancel";
                var data = {"params": {"userId": userId, "orderId": id}, "phone_size": 1};
                return reqData(data, halfUrl);
            },
            //用户优惠券信息
            couponInfo:function(data){
                var halfUrl='/mobile/coupon/list';
                var postData={'params':data};
                return reqData(postData, halfUrl);
            },
            //获取用户可用优惠券
            couponEnable:function(orderNo){
                var halfUrl='/mobile/coupon/useListByOrder';
                var postData={'params':{'orderNo':orderNo}};
                return reqData(postData, halfUrl);
            },
            //用户荣盛币信息
            rsbInfo: function (uid) {
                var halfUrl = '/mobile/rsCoin/info';
                var postData = {"params": {'userId': uid}, 'phone_size': 1};
                return reqData(postData, halfUrl);
            },
            //获取A B类荣盛币详细信息
            getABRsb:function(){
                var halfUrl = '/mobile/gift/getRSBDetails';
                return getRsb(halfUrl);
            },
            //获取用户旅游订单列表
            orderTravelList: function (uid,number, size) {
                var halfUrl = "/mobile/orderTravel/list";
                var data = {"params": {"userId": uid, "pageNum": number, "pageSize": size}, "phone_size": 1};
                return reqData(data, halfUrl);
            },
            //获取用户收藏旅游
            travelCollect: function (uid,number, size) {
                var halfUrl = "/mobile/productTravel/listForCollect";
                var data = {"params": {"userId": uid, "pageNum": number, "pageSize": size}, "phone_size": 1};
                return reqData(data, halfUrl);
            },
            //获取用户收藏住宿
            stayCollect: function (uid, number, size) {
                var halfUrl = "/mobile/collect/communitList";
                var data = {"params": {"userId": uid, "pageNum": number, "pageSize": size}, "phone_size": 1};
                return reqData(data, halfUrl);
            },
            //获取用户住宿订单列表
            orderStayList: function (uid, number, size) {
                var halfUrl = "/mobile/order/info";
                var data = {"params": {"userId": uid}, "phone_size": 1};
                return reqData(data, halfUrl);
            },
            //判断住宿产品是否连续
            productContinuity:function(data){
                var halfUrl = "/mobile/product/continuity";
                var data = {"params": data, "phone_size": 1};
                return reqData(data, halfUrl);
            },
            giftRsbApi:function(data){
                var halfUrl='/mobile/gift/giftRSB';
                var postData=data;
                return reqData(postData,halfUrl);
            },
            //获取产品信息列表，主页等内容
            travleList: [],
            homeList: [],
            travelReco: [],
            stayReco: [],
            //获取某个城市旅游产品列表
            getTravelList: function (data) {
                var halfUrl = "/mobile/productTravel/list";
                var data = {"params": data, "phone_size": 1};
                return getData(data, halfUrl);
            },
            //获取首页轮播图
            getHomeCard: function () {
                var halfUrl = "/mobile/index/list";
                var data = {"params": {}, "phone_size": 1};
                return getData(data, halfUrl);
            },
            //获取度假产品信息
            getHomeStayCity: function () {
                var halfUrl ='/mobile/product/list';
                var data={"params":{"price":{"min":-1,"max":-1},"pageSize":10,"pageNum":1},"phone_size":1};
                return getData(data, halfUrl);
            },
            //获取住宿产品详细信息
            getStayDetail:function(id){
                var halfUrl='/mobile/product/detail';
                var data={"params":{"prodId":id},"phone_size":1};
                return getData(data,halfUrl);
            },
            getProductPriceOfDate: function (id, date) {
                var halfUrl='/mobile/product/date';
                var data={"params":{"prodId":id,"date":date},"phone_size":1};
                return reqData(data,halfUrl);
            },
            //获取住宿产品服务和设施
            getStayServiceAndDevice:function(){
                var halfUrl='/mobile/deviceAndService/list';
                var data={"params":{},"phone_size":1};
                return getData(data,halfUrl);
            },
            //获取住宿产品列表
            getStayProductList:function(stayData){
                var halfUrl='/mobile/product/list';
                var data={"params":stayData,"phone_size":1};
                return getData(data,halfUrl);
            },
            //住宿预下单
            stayPreCommit:function(order){
                var halfUrl='/mobile/order/preCommit';
                var data={"params":order,"phone_size":1};
                return reqData(data,halfUrl);
            },
            //住宿订单提交
            stayConfirmOrder:function(obj){
                var halfUrl='/mobile/order/confirmOrder';
                var data={"params":obj,"phone_size":1};
                return reqData(data,halfUrl);
            },
            //获取首页旅游部分轮播图//
            getTravelReco: function () {
                var halfUrl = "/mobile/index/travel";
                var data = {"params": {}, "phone_size": 1};
                return getData(data, halfUrl);
            },
            //首页热门关键字
            getHotKey: function () {
                var halfUrl = '/mobile/index/hotKey';
                var data = {"params": {}};
                return getData(data, halfUrl);
            },
            getProductDetail: function (pid,userid) {
                var halfUrl = "/mobile/productTravel/productInfo";
                var data = {"params": {"productId": pid,"userId":userid}, "phone_size": 1};
                if(userid){
                    return reqData(data, halfUrl);
                }else{
                    return getData(data, halfUrl);
                }
            },
            //获取城市列表
            getCityId: function () {
                var halfUrl = '/mobile/city/list';
                var data = {"params": {}};
                return getData(data, halfUrl);
            },
            //获取旅游主题列表
            getThemeList: function () {
                var halfUrl = '/mobile/theme/list';
                var data = {"params": {}};
                return getData(data, halfUrl);
            },
            //获取度假二级图片列表
            getBannersPic: function (picId) {
                var halfUrl = '/mobile/productTravel/bannerPics';
                var data = {"params": {"picId": picId}, "phone_size": 1};
                return getData(data, halfUrl);
            },
            //请求用户openId
            uniformOrder: function (data) {
                var halfUrl = '/mobile/unifiedorder/getOpenId';
                return getOpenId(data, halfUrl);
            },
            //获取openid后请求统一下单接口
            uniOrder: function (data) {
                var halfUrl = '/mobile/unifiedorder/index';
                return getOpenId(data, halfUrl);
            },
            checkGiftPhone:function(phone){
                var halfUrl='/mobile/gift/checkReceiver';
                var data={"params":{"phone":phone}};
                return reqData(data,halfUrl);
            },
            //获取资产详情
            getAssetDetailList: function () {
                var halfUrl='/mobile/info/list';
                var data={"params":{"userId":result.userMess.userId}};
                return reqData(data,halfUrl);
            },
            //获取新闻公告,
            getAssetNewsList: function () {
                var halfUrl='/mobile/notice/list';
                var data={"params":{"userId":result.userMess.userId}};
                return reqData(data,halfUrl);
            },
            getAssetIncomeList: function () {
                var halfUrl='/mobile/income/list';
                var data={"params":{"userId":result.userMess.userId}};
                return reqData(data,halfUrl);
            },
            getHousekeeperList: function (month) {
                var halfUrl='/mobile/housekeeper/listForMonth';
                var data={"params":{"userId":result.userMess.userId,"month":month},"phone_size": "1"};
                return reqData(data,halfUrl);
            },
            saveAppointment: function (d) {
                var halfUrl = '/mobile/appointment/save';
                var data = {
                    "params": {
                        "userId": result.userMess.userId,
                        "assetId": d.assetId,
                        "contactsPhone": d.contactsPhone,
                        "remark": d.remark,
                        "stringList": d.stringList,
                        "merchId": d.merchId,
                        "date": d.date,
                        "contactsName": d.contactsName
                    }
                };
                return reqData(data, halfUrl);
            },
            getHousekeeperListForDay: function (date) {
                var halfUrl='/mobile/housekeeper/listForDate';
                var data={"params":{"userId":result.userMess.userId,"date":date},"phone_size": "1"};
                return reqData(data,halfUrl);
            },
            //维修记录按月查询
            getRepairMonth:function(date){
                var halfUrl='/mobile/repair/listForMonth';
                var data={"params":{"userId":result.userMess.userId,"month":date},"phone_size": "1"};
                return reqData(data,halfUrl);
            },
            //维修记录了按天查询
            getRepairDate:function(date){
                var halfUrl='/mobile/repair/listForDate';
                var data={"params":{"userId":result.userMess.userId,"date":date},"phone_size": "1"};
                return reqData(data,halfUrl);
            }
        }

        //请求需要用户信息的数据
        function reqData(postdata, lastUrl) {
            var deferred = $q.defer();
            $http({
                method: "POST",
                url: urlStr + lastUrl,
                data: postdata,
                headers: {
                    'token': result.userMess.token,
                    'userId': result.userMess.userId
                }
            }).success(function (data) {
                return deferred.resolve({list: data});
            });
            return deferred.promise;
        }

        function getRsb(url){
            var deferred = $q.defer();
            $http({
                method: "GET",
                url: urlStr + url,
                headers: {
                    'token': result.userMess.token,
                    'userId': result.userMess.userId
                }
            }).success(function (data) {
                return deferred.resolve({list: data});
            });
            return deferred.promise;
        }

        //获取openId
        function getOpenId(data, lastUrl) {
            var deferred = $q.defer();
            $http({
                method: "GET",
                url: urlStr + lastUrl,
                headers: {
                    'token': result.userMess.token,
                    'userId': result.userMess.userId
                },
                params: data
            }).success(function (data) {
                return deferred.resolve({list: data});
            });
            return deferred.promise;
        }

        //请求不需要用户信息的数据
        function requestData(postdata, lastUrl) {
            var deferred = $q.defer();
            $http({
                method: "POST",
                url: urlStr + lastUrl,
                data: postdata
            }).success(function (data) {
                return deferred.resolve({list: data});
            });
            return deferred.promise;
        }

        //调用结算中心的函数
        function jsApi(postData, url) {

            var deferred = $q.defer();
            $http({
                method: "POST",
                url: url,
                data: postData
            }).success(function (data) {
                return deferred.resolve({list: data});
            });
            return deferred.promise;
        }

        function getData(params, url) {
            var deferred = $q.defer();
            $http({
                method: "POST",
                url: urlStr + url,
                data: params
            }).success(function (data) {
                return deferred.resolve({list: data});
            });
            return deferred.promise;
        }

        return result;
    }])
    .filter('phoneHash', [function () {
        return function (value) {
            var input = value + '';
            input = input.replace(/(\s+)/g, "");
            var out = '';
            for(var i = 0; i < input.length; i++){
                if(i == 2){
                    out = out + input[i] + ' ';
                }else if(i>2 && i<=6){
                    out = out + '*';
                    if(i == 6){
                        out = out + ' '
                    }
                }else {
                    out = out + input[i]
                }
            }
            return out
        }
    }])
    .filter('dateFormate', [function () {
        return function (value) {
            if(!value){
                return;
            }
            var out;
            if(value.substring(value.length-2)==='.0'){
                out=value.substring(0,value.length-2);
            }else{
                out=value;
            }
            return out;
        }
    }])
    .filter('couponName',[function(){
        return function(value){
            if(value.toString().length>12){
                value=value.substr(0,12)+'...';
            }
            return value;
        }
    }])