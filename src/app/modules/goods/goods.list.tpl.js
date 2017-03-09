'use strict'

angular.module('swalk.goods.item', [])
    .directive('goodItem',['$state','userService','$ionicViewSwitcher',function($state,userService,$ionicViewSwitcher){
        return {
            restrict:'AE',
            link:function(scope,elem,attr){
                scope.orderStatus='';
                switch (scope.order.orderStatus){
                    case 1:
                        scope.orderStatus='待支付';
                        break;
                    case 2:
                        scope.orderStatus='已支付';
                        break;
                    case 3:
                        scope.orderStatus='交易成功';
                        break;
                    case 4:
                        scope.orderStatus='待支付';
                        break;
                    case -1:
                        scope.orderStatus='等待商家确认';
                        break;
                    case -2:
                        scope.orderStatus='等待商家确认';
                        break;
                    case -3:
                        scope.orderStatus='商家拒单';
                        break;
                    case -4:
                        scope.orderStatus='订单已取消';
                        break;
                    case -5:
                        scope.orderStatus='订单已取消';
                        break;
                    case -6:
                        scope.orderStatus='退款失败';
                        break;
                    case -7:
                        scope.orderStatus='退款失败';
                        break;
                }
                scope.pay=function(){
                    if(appType==0){
                        userService.preOrderId.id=scope.order.id;
                        $state.go('payorder',{})
                        $ionicViewSwitcher.nextDirection('forward');
                    }else if(appType==1){
                        connectWebViewJavascriptBridge(function (bridge) {
                            bridge.callHandler('toPayOrder', {
                                orderId: scope.order.id,
                                orderType: scope.nowShowOrder,
                                from:1
                            }, function (response) {
                                console.log(response);
                            });
                        });
                    }
                };

                scope.cancle=function(){
                    if(userService.preOrderId.type==1){
                        userService.cancleOrder(userService.userMess.userId,scope.order.id).then(function(data){
                            if(data.list.errcode===10000){
                                scope.alertTab('订单取消成功',toReflash());
                            }else{
                                scope.alertTab(data.list.message);
                            }
                        })
                    }else{
                        userService.cancleStayOrder(userService.userMess.userId,scope.order.id).then(function(data){
                            if(data.list.errcode===10000){
                                scope.alertTab('订单取消成功',toReflash());
                            }else{
                                scope.alertTab(data.list.message);
                            }
                        })
                    }

                }
                function toReflash(){
                    scope.getUserOrder();
                }
            },
            templateUrl:'app/modules/goods/goods.item.tpl.html'
        }
    }])