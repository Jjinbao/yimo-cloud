angular.module('swalk.fillorder', [])
    .controller('fillorder', ['$rootScope', '$scope', '$state', '$stateParams', '$ionicHistory', '$ionicViewSwitcher', '$ionicPopup', 'userService',
        function ($rootScope, $scope, $state, $stateParams, $ionicHistory, $ionicViewSwitcher, $ionicPopup, userService) {
            $scope.hasTravelers = false;
            $scope.travelers = 0;
            $scope.travelDate={
                dateId:'',
                date:'',
                price:''
            }
            var orderParams={
                id:'',
                userId:'',
                productId:'',
                number:'',
                productDateId:'',
                remark:'',
                contactsName:'',
                contactsPhone:'',
                contactsEmail:'',
                mailAddress:''

            }

            $scope.$on('$ionicView.afterEnter', function () {
                //二次进来传递的参数
                /**
                 * $rootScope.preOrderData是在travel.detail.js中定义的订单id全局变量
                 * 包括id,title,type等订单信息
                 *
                 * */
                //产品信息
                $scope.travelName = $rootScope.preOrderData.title;
                //产品ID
                orderParams.id=$rootScope.preOrderData.id;
                //产品联系人信息
                $scope.contacter = userService.contacter;
                //产品备注信息
                if ($rootScope.remark) {
                    $scope.remark = $rootScope.remark.length > 20 ? $rootScope.remark.substr(0, 20) + '...' : $rootScope.remark;
                }else{
                    $scope.remark='';
                }
                //出游日期信息
                if ($rootScope.travelParams.date) {
                    //userService.orderParams.productDateId = $rootScope.travelParams.dateId;
                    //$scope.travelDate = $rootScope.travelParams.date;
                    //$scope.travelPrice = $rootScope.travelParams.price;

                    if($scope.travelDate.dateId!=$rootScope.travelParams.dateId){
                        $scope.travelDate=$rootScope.travelParams;
                        calculatePrice();
                        changeOrders();
                    }
                }
            })


            calculatePrice();

            $scope.reduceSourt = function () {
                if ($scope.travelers == 0) {
                    return;
                }
                if ($scope.travelers > 0) {
                    $scope.travelers--;
                }
                calculatePrice();
                changeOrders();
            }

            $scope.addSourt = function () {
                if (!$scope.travelDate.date) {
                    $scope.alertTab('请选择出游时间');
                    return;
                }
                $scope.travelers++;
                calculatePrice();
                changeOrders();
            }

            function calculatePrice() {
                if ($scope.travelers != 0 && $scope.travelDate.date) {
                    $scope.totalPrice = $scope.travelDate.price * $scope.travelers;
                } else {
                    $scope.totalPrice = 0;
                }
            }

            $scope.travelMan = function () {
                $state.go('choicecontact', {usefor: 'traveler'});
                $ionicViewSwitcher.nextDirection('forward');
            }

            $scope.travelContact = function () {
                $state.go('choicecontact', {usefor: 'contact'});
                $ionicViewSwitcher.nextDirection('forward');
            }

            $scope.choiceDate = function () {
                $state.go('choiceDate', {pid: $stateParams.pid});
                // ionicDatePicker.openDatePicker(ipObj1, $stateParams.pid,'holiday');
            };


            //初始化用户基本信息
            /*userService.orderParams.productDateId = $rootScope.travelParams.dateId;
            userService.orderParams.id = userService.preOrderId.id;
            userService.orderParams.userId = userService.userMess.userId;
            userService.orderParams.productId = $stateParams.pid;*/
            //修改订单
            //修改订单的时候传递的参数
            function changeOrders() {
                orderParams.userId=userService.userMess.userId;
                orderParams.productId=$stateParams.pid;
                orderParams.number=$scope.travelers;
                orderParams.productDateId=$scope.travelDate.dateId;
                userService.changeOrder(orderParams).then(function (data) {
                    if (data.list.errcode != 10000) {
                        //$scope.travelDate = '';
                        $scope.travelers--;
                        calculatePrice();
                        $scope.alertTab(data.list.message);
                    } else {

                    }
                })
            }


            $scope.toBuy = function () {
                if (!$scope.travelDate.date) {
                    $scope.alertTab('请选择出游时间');
                    return;
                }

                if ($scope.travelers === 0) {
                    $scope.alertTab('产品数量不能为0');
                    return;
                }

                var phoneReg = /^1[3|5|7|8]\d{9}$/;
                if (!$scope.contacter.name || !phoneReg.exec($scope.contacter.phone)) {
                    $scope.alertTab('请正确填写联系人信息');
                    return;
                }

                toMakeOrder();

                //确认订单，并跳转到支付界面
                function toMakeOrder() {
                    var contacts = [];
                    //确认订单的时候传递的参数

                    //orderParams.id=$state.params.preOrderData.id;
                    orderParams.userId=userService.userMess.userId;
                    orderParams.productId=$stateParams.pid;
                    orderParams.number=$scope.travelers;
                    orderParams.productDateId=$scope.travelDate.dateId;
                    orderParams.contactsName=$scope.contacter.name;
                    orderParams.contactsPhone=$scope.contacter.phone;
                    orderParams.contactsEmail=$scope.contacter.email;
                    orderParams.mailAddress=$scope.contacter.address;
                    orderParams.remark=$rootScope.remark;
                    userService.confirmOrder(orderParams).then(function (data) {
                        if (data.list.errcode = 10000) {
                            //归零出游日期
                            $rootScope.travelParams = {
                                date: '',
                                dateId: '',
                                price: ''
                            }
                            //清空备注
                            $scope.remark=$rootScope.remark = '';
                            //移除商品数量
                            $scope.travelers=0;
                            //清除出游时间
                            $scope.travelDate = {
                                date: '',
                                dateId: '',
                                price: ''
                            };
                            //清空联系人
                            userService.contacter = {};
                            //订单总价置0
                            $scope.totalPrice = 0;
                            $rootScope.travelParams={
                                date:'',
                                dateId:'',
                                price:''
                            }
                            if (appType === 0) {
                                $state.go('payorder', {});
                                $ionicViewSwitcher.nextDirection('forward');
                            } else {
                                if(!data.list.data){
                                    $scope.alertTab(data.list.message);
                                    return;
                                }
                                connectWebViewJavascriptBridge(function (bridge) {
                                    bridge.callHandler('toPayOrder', {
                                        orderId: $rootScope.preOrderData.id,
                                        orderType: data.list.data.orderType,
                                        channelId: data.list.data.channelId,
                                        vcType: '2',
                                        from: 0
                                    }, function (response) {

                                    });
                                });
                            }

                        } else {
                            $scope.alertTab(data.list.message);
                        }
                    })
                }
            }
            $scope.goback = function () {
                orderParams={
                    id:'',
                    userId:'',
                    productId:'',
                    number:'',
                    productDateId:'',
                    remark:'',
                    contactsName:'',
                    contactsPhone:'',
                    contactsEmail:'',
                    mailAddress:''

                }
                userService.travelers = 0;
                $scope.travelers = 0;
                $scope.totalPrice = 0;
                userService.contacter = {};
                $scope.remark=$rootScope.remark = '';
                $rootScope.travelParams = {
                    date: '',
                    dateId: '',
                    price: ''
                }
                $scope.travelDate = {
                    date: '',
                    dateId: '',
                    price: ''
                };
                for (var i = 0; i < userService.userContact.length; ++i) {
                    userService.travelPrice = {};
                    userService.userContact[i].contectchecked = false;
                    userService.userContact[i].checked = false;
                }
                $scope._goback(-1);
            };
            //注册这个事件监听是为了防止用户在填写订单页面点击安卓物理返回按钮的
            $scope.$on('android.mac.backbtn',function(){
                $scope.goback();
            })
            //添加备注
            $scope.toRemark = function () {
                $state.go('remark', {});
            }
            //当用户点击返回的时候，处理返回事件
            connectWebViewJavascriptBridge(function (bridge) {
                bridge.registerHandler('backFromPayOrder', function (response) {
                    $scope.goback();
                })
            });

        }])
    .controller('fillorderChoiceDateCtrl', ['$rootScope', '$scope', 'userService', '$q', '$state',
        function ($rootScope, $scope, userService, $q, $state) {
            $scope.options = {
                model: 'selectDate',
                getData: function (date) {
                    var deffered = $q.defer();
                    userService.getDatePrice($state.params.pid, date + '-01').then(function (res) {
                        if (res.list.errcode == 10000) {
                            var arr = res.list.data || [];
                            arr = arr.map(function (item) {
                                return {
                                    date: item.startDate,
                                    price: item.price,
                                    text: '￥' + item.price,
                                    dateId: item.id
                                }
                            });
                            deffered.resolve(arr)
                        } else {
                            deffered.resolve([])
                        }
                    });
                    return deffered.promise
                },
                clickDate: function (current) {
                    if (current.price) {
                        //$state.go('fillorder', {date: current.fullDate, dateId:current.dateId,price: current.price, pid: $state.params.pid})
                        $rootScope.travelParams.date = current.fullDate;
                        $rootScope.travelParams.dateId = current.dateId;
                        $rootScope.travelParams.price = current.price;
                        $scope._goback(-1);
                    }
                }
            }
        }]);
