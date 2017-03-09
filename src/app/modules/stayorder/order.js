'use strict'

angular.module('swalk.stayorder', [])
    .controller('stayFillorder', ['$rootScope', '$scope', '$stateParams', '$state', '$ionicScrollDelegate', '$ionicViewSwitcher', 'userService',
        function ($rootScope, $scope, $stateParams, $state, $ionicScrollDelegate,$ionicViewSwitcher, userService) {
            $scope.contacter={};
            var isFirstIn=true;
            $scope.stayDate={
                in:$rootScope.appStay.stayIn,
                out:$rootScope.appStay.stayOut
            }
            $scope.reqData = {
                MobileOrderOwner: {mobile: "", name: ""},
                stay:{checkIn:$rootScope.appStay.stayIn,checkOut:$rootScope.appStay.stayOut},
                server: [],
                count: 0,
                orderId: '',
                prodId: $stateParams.pid,
                userId: userService.userMess.userId
            }
            $scope.$on('$ionicView.beforeEnter',function(){
                if(userService.contacter.name&&$scope.contacter.phone!=userService.contacter.phone){
                    $scope.contacter = userService.contacter;
                    if($scope.contacter&&$scope.contacter.phone){
                        $scope.reqData.MobileOrderOwner.name=$scope.contacter.name;
                        $scope.reqData.MobileOrderOwner.mobile=$scope.contacter.phone;
                    }
                }

                if($rootScope.remark){
                    $scope.stayRemark = $rootScope.remark.length > 20 ? $rootScope.remark.substr(0, 20) + '...' : $rootScope.remark;
                }else{
                    $scope.stayRemark ='';
                }
                //计算住宿几个晚上
                $scope.stayDays = getDays($rootScope.appStay.stayIn, $rootScope.appStay.stayOut);
                if(!isFirstIn){
                    preCommitStay();
                }else{
                    isFirstIn=false;
                    $scope.reqData.orderId='';
                    $scope.reqData.MobileOrderOwner={mobile: "", name: ""};
                    userService.stayPreCommit($scope.reqData).then(function (data) {
                        $scope.orderData = data.list.data;
                        angular.copy($scope.orderData.services,$scope.stayService);
                        for(var i=0;i<$scope.stayService.length;i++){
                            $scope.stayService[i].count=0;
                        }
                    })
                }
            })



            $scope.goback = function () {
                userService.contacter={};
                $rootScope.remark='';
                isFirstIn=true;
                $scope.reqData.count=0;
                $scope.reqData.server=[];
                $scope._goback(-1);
            }
            $scope.proInfo = $rootScope.pInfo;

            //初始化请求的数据
            $scope.stayService=[];

            function preCommitStay(val){
                $scope.reqData.stay.checkIn=$rootScope.appStay.stayIn;
                $scope.reqData.stay.checkOut=$rootScope.appStay.stayOut;
                $scope.reqData.orderId=$scope.orderData.orderId;
                $scope.reqData.MobileOrderOwner.name=($scope.contacter&&$scope.contacter.name)?$scope.contacter.name:'';
                $scope.reqData.MobileOrderOwner.mobile=($scope.contacter&&$scope.contacter.phone)?$scope.contacter.phone:'';
                userService.stayPreCommit($scope.reqData).then(function (data) {
                    if(data.list.errcode==10000){
                        $scope.orderData = data.list.data;
                    }else{
                        if(val=='room'){
                            $scope.reqData.count--;
                        }
                        $scope.alertTab(data.list.message);
                    }

                    //$scope.stayService = $scope.orderData.services;

                })
            }


            //选择联系人
            $scope.toContact = function () {
                $state.go('choicecontact', {usefor: 'contact'});
            }

            $scope.hideService = false;
            $scope.showService = function () {
                $scope.hideService = !$scope.hideService;
                $ionicScrollDelegate.scrollTop(true);
            }

            $scope.remark = function () {
                $state.go('remark', {});
            }

            $scope.changeDate = function () {
                $scope.toChoiceStayIn();
            }

            //减少房间份数
            $scope.reduceRooms=function(){
                if($scope.reqData.count===0){
                    return;
                }else{
                    $scope.reqData.count=$scope.reqData.count-1;
                    preCommitStay();
                }
            }

            //增加房间份数
            $scope.addRooms=function(){
                $scope.reqData.count+=1
                preCommitStay('room');
            }
            //增加减少服务内容和数量
            $scope.addService=function(val){
                val.count+=1;
                $scope.reqData.server=$scope.stayService;
                preCommitStay();
            }
            $scope.reduceService=function(val){
                if(val.count==0){
                    return;
                }
                val.count-=1;
                $scope.reqData.server=$scope.stayService;
                preCommitStay();
            }

            $scope.toBuy=function(){
                var phoneReg = /^1[3|5|7|8]\d{9}$/;
                if(!$scope.contacter.name||!phoneReg.exec($scope.contacter.phone)){
                    $scope.alertTab('请正确填写联系人信息');
                    return;
                }else{
                    $scope.reqData.MobileOrderOwner.name=$scope.contacter.name;
                    $scope.reqData.MobileOrderOwner.mobile=$scope.contacter.phone;
                }
                if($scope.reqData.count<=0){
                    $scope.alertTab('预定数量不能为0');
                    return;
                }

                //下单参数
                var confirmOrder={
                    orderId:$scope.reqData.orderId,
                    prodId:$scope.reqData.prodId,
                    count:$scope.reqData.count,
                    price:$scope.orderData.sum.total,
                    stay:{checkIn:$rootScope.appStay.stayIn,checkOut:$rootScope.appStay.stayOut},
                    orderOwner:{mobile:$scope.reqData.MobileOrderOwner.mobile,name:$scope.reqData.MobileOrderOwner.name},
                    server:$scope.stayService,
                    remark:$scope.stayRemark,
                    userId:userService.userMess.userId,
                    name:$scope.proInfo.name
                }
                userService.stayConfirmOrder(confirmOrder).then(function(data){
                    if(data.list.errcode!=10000){
                        $scope.alertTab(data.list.message);
                    }else{
                        userService.preOrderId.id=confirmOrder.orderId;
                        userService.preOrderId.type=0;
                        $rootScope.remark='';
                        isFirstIn=true;
                        $scope.reqData.count=0;
                        if(userService.userContact&&userService.userContact.length!=0){
                            userService.userContact[0].contectchecked=false;
                        }
                        $scope.contacter=userService.contacter={};
                        connectWebViewJavascriptBridge(function (bridge) {
                            bridge.callHandler('toPayOrder', {
                                orderId: userService.preOrderId.id,
                                orderType: userService.preOrderId.type,
                                from:0
                            }, function (response) {

                            });
                        });
                        //$state.go('payorder', {});
                        //$ionicViewSwitcher.nextDirection('forward');
                    }
                })
            }
            //注册这个事件监听是为了防止用户在填写订单页面点击安卓物理返回按钮的
            $scope.$on('android.mac.backbtn',function(){
                $scope.goback();
            })
            //当用户点击返回的时候，处理返回事件
            connectWebViewJavascriptBridge(function (bridge) {
                bridge.registerHandler('backFromPayOrder', function (response) {
                    $scope.goback();
                })
            });

        }])
    .controller('orderChioceDateCtrl', ['$rootScope','$scope','$state','$q','userService','$timeout',
        function ($rootScope,$scope,$state,$q,userService,$timeout) {
            $scope.stayInDate = '';
            $scope.stayOutDate = '';
            $scope.temp = [];

            $scope.options = {
                model: 'selectDate',
                getData: function (date) {
                    var def = $q.defer();
                    userService.getProductPriceOfDate($state.params.id,date+'-01').then(function (res) {
                        var arr = res.list.data || [];
                        arr = arr.map(function (item) {
                            if($scope.temp[0] && $scope.temp[0].date == item.date){
                                item.stayIn = true;
                                item.text = '入住'
                            }
                            item.text = '￥' + item.price;
                            return item
                        });
                        def.resolve(arr || []);
                    });
                    return def.promise
                },
                clickDate: function (current, list) {
                    if($scope.stayOutDate){
                        return;
                    }
                    if(!current.price&&!$scope.stayInDate){
                        return
                    }
                    if(!$scope.stayInDate || $scope.stayInDate > current.fullDate){
                        $scope.stayInDate = current.fullDate;
                        angular.forEach(list, function (item) {
                            if(item == current){
                                item.stayIn = true;
                                item.text = '入住'
                            }else {
                                item.stayIn = false;
                                item.text = item.price ? '￥' + item.price : ''
                            }
                        });
                        $scope.temp[0] = {
                            stayIn: true,
                            text: '入住',
                            date: current.fullDate
                        };
                        //$scope.alertTab('已选择入住时间')
                    }else if($scope.stayInDate && $scope.stayInDate < current.fullDate){
                        var data={
                            start:$scope.stayInDate,
                            end:$scope.stayInDate,
                            prodId:$state.params.id
                        }
                        userService.productContinuity(data).then(function(res){
                            console.log(res);
                            if(res.list.errcode==10000){
                                if(res.list.data){
                                    $scope.stayOutDate = current.fullDate;
                                    current.stayIn = true;
                                    current.text = '离店';
                                    $rootScope.appStay.stayIn=$scope.stayInDate;
                                    $rootScope.appStay.stayOut=$scope.stayOutDate;
                                    var timeOutId=$timeout(function(){
                                        $timeout.cancel(timeOutId);
                                        $scope._goback(-1);
                                    },500)
                                }else{
                                    $scope.alertTab(res.list.message);
                                }
                            }
                        })
                    }
                }
            }
        }
    ]);
