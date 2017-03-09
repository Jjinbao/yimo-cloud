'use strict'

angular.module('swalk.pay', [])
    .controller('payctrl', ['$scope', '$state', '$ionicViewSwitcher', 'userService', '$ionicPopup', '$location',
        function ($scope, $state, $ionicViewSwitcher, userService, $ionicPopup, $location) {
            //用户数据界面数据对象
            $scope.payData = {};
            //需要微信支付数量
            $scope.moneyPay = 0;
            //荣盛币数量
            $scope.rsPay = 0;
            //用户选择的支付方式
            $scope.payType = {
                rsb: false,
                money: false
            }
            //用户需要显示的小窗口控制
            $scope.windowValue = {
                mask: false,
                ensure: false,
                password: false
            }
            //首先进行预支付
            userService.prePay(userService.preOrderId.id, userService.preOrderId.type).then(function (data) {
                $scope.payData = data.list.data;

            });

            //选择荣盛币支付
            $scope.rsCoinPay = function (evt) {
                $scope.payType.rsb = evt.target.checked;
                paydealMoey();
            }

            //微信现金支付
            $scope.moneyCashPay = function (evt) {
                $scope.payType.money = evt.target.checked;
                paydealMoey();
            }

            function paydealMoey() {
                if ($scope.payType.money && $scope.payType.rsb) {
                    $scope.rsPay = $scope.payData.canPayable;
                    $scope.moneyPay = $scope.payData.paySum - $scope.payData.rsRealPay;
                } else if (!$scope.payType.money && $scope.payType.rsb) {
                    $scope.rsPay = $scope.payData.canPayable;
                    $scope.moneyPay = 0;
                } else if ($scope.payType.money && !$scope.payType.rsb) {
                    $scope.rsPay = 0;
                    $scope.moneyPay = $scope.payData.paySum;
                } else if (!$scope.payType.money && !$scope.payType.rsb) {
                    $scope.rsPay = 0;
                    $scope.moneyPay = 0;
                }
            }

            //判断用户有没有修改支付密码
            function modifyPassword() {
                userService.modifyPassword(userService.userMess.userId)
                    .then(
                    function (data) {

                    },
                    function (error) {

                    }
                )
            }

            //开始支付测试
            $scope.canPaybuttonUse = true;
            $scope.toBuy = function () {
                if (!$scope.canPaybuttonUse) {
                    return;
                }
                $scope.canPaybuttonUse = false;
                if (!$scope.payType.money && !$scope.payType.rsb) {
                    $scope.alertTab('请选择支付方式');
                    $scope.canPaybuttonUse = true;
                    return;
                }
                //只选择荣盛币支付没选择现金支付
                if ($scope.payType.rsb && !$scope.payType.money) {
                    if (parseFloat($scope.payData.rsRealPay) < parseFloat($scope.payData.paySum)) {
                        $scope.alertTab('荣盛币不能完全支付订单');
                        $scope.canPaybuttonUse = true;
                        return;
                    }
                }

                //判断用户是否已经修改了支付密码
                userService.modifyPassword(userService.userMess.userId)
                    .then(
                    function (data) {
                        if (data.list.errcode != 10000) {
                            $scope.canPaybuttonUse = true;
                            $scope.toModifyPassword();
                        } else {
                            //开始支付流程
                            $scope.showConfirm();
                        }
                    }
                )
            }
            //去修改支付密码
            $scope.toModifyPassword = function () {
                $state.go('changetype', {});
                $ionicViewSwitcher.nextDirection('forward');
            }

            //提醒用户确认
            $scope.showConfirm = function () {
                $scope.windowValue.mask = true;
                $scope.windowValue.ensure = true;
                $scope.windowValue.password = false;
            }
            //用户确认开始支付
            $scope.startPay = function () {
                if ($scope.rsPay > 0) {
                    $scope.windowValue.mask = true;
                    $scope.windowValue.ensure = false;
                    $scope.windowValue.password = true;
                } else {
                    $scope.windowValue.mask = false;
                    $scope.windowValue.ensure = false;
                    $scope.windowValue.password = false;
                    $scope.payWeiChart();
                }

            }

            //用户取消开始支付
            $scope.canclePay = function () {
                $scope.windowValue.mask = false;
                $scope.windowValue.ensure = false;
                $scope.windowValue.password = false;
                wePayCancle();
            }

            $scope.hideTips = function () {
                $scope.windowValue.mask = false;
                $scope.windowValue.ensure = false;
                $scope.windowValue.password = false;
            }

            //用户密码
            $scope.userPassword = '';
            //用户在输入密码页面取消
            $scope.canclePassword = function () {
                $scope.userPassword = '';
                $scope.windowValue.mask = false;
                $scope.windowValue.ensure = false;
                $scope.windowValue.password = false;
                wePayCancle();
            }
            //用户点击确认支付按钮，开始校验
            $scope.canClickPay = true;
            $scope.startIdentityPay = function () {
                if (!$scope.canClickPay) {
                    return;
                }
                if (!$scope.userPassword || $scope.userPassword.length != 6) {
                    $scope.alertTab('您输入的密码不正确');
                    return;
                } else {
                    $scope.canClickPay = false;//阻止用户再次点击支付按钮
                    $scope.payRSB();
                }
            }
            //使用荣盛币支付
            $scope.payRSB = function () {
                var nowTime = new Date().format('yyyy-MM-dd hh:mm:ss');
                if ($scope.payType.rsb && ($scope.payData.canPayable > 0)) {
                    var payAmount = ($scope.payData.canPayable * 100).toFixed(0);
                    var rsbPostData = {
                        orderId: $scope.payData.orderNo,
                        amount: payAmount,
                        transDate: nowTime,
                        startTime: $scope.payData.startTime,
                        endTime: $scope.payData.endTime,
                        merchId: $scope.payData.merchId,
                        userId: userService.userMess.userId,
                        payType: 0,
                        channelId: 1001,
                        md5: md5($scope.payData.orderNo + payAmount + nowTime + $scope.payData.startTime + $scope.payData.endTime + $scope.payData.merchId + userService.userMess.userId + '0' + '1001' + 'settle88').substring(8, 24).toUpperCase(),
                        password: $scope.userPassword
                    }
                    userService.rsbPay(rsbPostData)
                        .then(
                        function (data) {
                            $scope.canClickPay = true;//允许再次点击支付按钮
                            if (data.list.errcode != 10000) {
                                $scope.alertTab(data.list.message);
                                return;
                            } else {
                                $scope.alertTab('荣盛币支付成功', $scope.payWeiChart);
                            }

                        }
                    )
                } else {
                    $scope.payWeiChart();
                }
            }

            //开始微信支付
            $scope.openIdParams = {};
            $scope.payWeiChart = function () {
                if ($scope.moneyPay === 0) {
                    $scope.hideTips();
                    wePaySuccess();
                } else {
                    //console.log($scope.payData.orderNo);
                    //$scope.alertTab('吊起微信支付接口');
                    //请求统一下单接口
                    $scope.hideTips();
                    getUniformOrder();
                }
            }
            //请求统一下单接口
            function getUniformOrder() {
                var params = {openId: userService.userOpenId.openId, orderNo: $scope.payData.orderNo};
                userService.uniOrder(params)
                    .then(
                    function (data) {
                        if (data.list.errcode === 10000) {
                            if (data.list.data.prepay_id === 'prepay_id=null') {
                                $scope.alertTab('订单已经失效，请重新下单', canNotWeiPay());
                            } else {
                                startWeChartPay(data.list.data);
                            }
                        } else {
                        }
                    }
                )
            }

            //微信支付函数
            function startWeChartPay(data) {
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.appid, // 必填，公众号的唯一标识
                    timestamp: data.timestamp,// 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.sign,// 必填，签名，见附录1
                    jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function () {
                    wx.chooseWXPay({
                        timestamp: data.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                        package: data.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                        signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: data.sign, // 支付签名
                        success: wePaySuccess, //微信支付成功的回调函数
                        fail: wePayFail,        //微信支付失败回调函数
                        cancel: wePayCancle,     //取消微信支付回调函数
                        trigger: wePayTrigger
                    })

                });
                wx.error(function (res) {

                })
            }

            //微信支付成功回调函数
            function wePaySuccess(res) {
                /*var jsData={
                 phone:userService.userMess.phone,
                 userId:userService.userMess.userId,
                 channelId:1001,
                 amount:0.01,//$scope.moneyPay,
                 orderId:$scope.payData.orderNo,
                 bizType:1,
                 colUserId:$scope.payData.merchId,
                 tranDate:new Date().format('yyyy-MM-dd hh:mm:ss')
                 }
                 userService.weChartBill(jsData)
                 .then(function(data){
                 console.log(data);
                 })*/
                $scope.initData();
                $state.go('payresult', {status: '0'});
            }

            //微信支付失败回调函数
            function wePayFail(res) {
                $scope.initData();
                $state.go('payresult', {status: '2'});
            }

            //取消微信支付回调函数
            function wePayCancle(res) {
                $scope.initData();
                $state.go('payresult', {status: '1'});
            }

            //订单不可进行微信支付提醒
            function canNotWeiPay() {
                $scope.initData();
                $state.go('payresult', {status: '9'});
            }

            //监听Menu函数
            function wePayTrigger() {

            }

            //返回，直接返回到商品详情页面
            $scope.goback = function () {
                $scope.initData();
                $scope._goback(-2);
            }

            $scope.initData = function () {
                userService.travelers = [];
                userService.contacter = [];
                userService.traveldate = '';
                userService.travelPrice = {};
                userService.preOrderId = {id: '', type: ''};

                for (var i = 0; i < userService.userContact.length; i++) {
                    userService.userContact[i].checked = false;
                    userService.userContact[i].contectchecked = false;
                }
            }
        }])
