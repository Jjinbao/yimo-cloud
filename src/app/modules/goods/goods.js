'use strict'

angular.module('swalk.goods', [])
    .controller('myOrders', ['$scope', '$state', '$stateParams', '$ionicHistory','$ionicScrollDelegate', '$ionicViewSwitcher', 'userService',
        function ($scope, $state, $stateParams, $ionicHistory,$ionicScrollDelegate, $ionicViewSwitcher, userService) {
            if ($stateParams.from === 'payresult') {
                $ionicHistory.clearHistory();
            }
            var goods = this;
            $scope.nowShowOrder=0;//1-度假,0-住宿---------------
            userService.preOrderId.type=$scope.nowShowOrder;
            this.nowlist='度假'
            this.orderType = "QB";
            this.status1 = 0;
            this.status1 = 1;
            this.status1 = 2;
            $scope.orderlist = [];

            $scope.getUserOrder=function(){
                if($scope.nowShowOrder==1){
                    userService.orderTravelList(userService.userMess.userId, 1, 5).then(function (data) {
                        $scope.orderlist = data.list.data;
                        filterOrders();
                    });
                }else{
                    userService.orderStayList(userService.userMess.userId).then(function(data){
                        $scope.orderlist = data.list.data;
                        angular.forEach($scope.orderlist,function(val){
                            val.orderStatus=val.status;
                            val.price=val.sum;
                            val.id=val.orderId;
                        })
                        filterOrders();
                    })
                }

            }
            $scope.$on('$ionicView.afterEnter',function(){
                $scope.getUserOrder();
            })

            //订单分类，把待支付，已支付，完成的订单分类出来
            function filterOrders(){
                $scope.waitPayOrders=[];
                $scope.hadPayOrders=[];
                $scope.hadFinishOrders=[];
                angular.forEach($scope.orderlist,function(val){
                    if(val.orderStatus===1){
                        $scope.waitPayOrders.push(val);
                    }
                    if(val.orderStatus===2){
                        $scope.hadPayOrders.push(val);
                    }
                    if(val.orderStatus===3){
                        $scope.hadFinishOrders.push(val);
                    }

                })
            }
            //按钮切换函数
            this.orderList = function (val) {
                if (goods.orderType === val) {
                    return;
                }
                $ionicScrollDelegate.scrollTop(true);
                goods.orderType = val;
            };

            this.toHome = function () {
                $state.go('tabs.home', {});
            }

            this.goodsBack = function () {
                if ($stateParams.from === 'payresult') {
                    $state.go('tabs.mine', {});
                    $ionicViewSwitcher.nextDirection('back');
                } else {
                    $scope._goback(-1);
                }
            }

            this.changeOrders=function(){
                if($scope.nowShowOrder===1){
                    userService.preOrderId.type=$scope.nowShowOrder=0;
                    goods.nowlist='度假'
                }else{
                    userService.preOrderId.type=$scope.nowShowOrder=1;
                    goods.nowlist='住宿';
                }
                //$scope.orderlist='';
                $scope.getUserOrder();
                $ionicScrollDelegate.scrollTop(true);
            }
        }])
