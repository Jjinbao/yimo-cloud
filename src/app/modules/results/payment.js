'use strict'

angular.module('swalk.payment',[])
    .controller('payment',['$scope','$stateParams','$state','$ionicViewSwitcher',function($scope,$stateParams,$state,$ionicViewSwitcher){
        //格式化日期
        $scope.inFrom=$state.params.type;
        $scope.resultType=$stateParams.status;
        $scope.resultWord='恭喜您支付成功';
        if($scope.resultType==='0'){
            $scope.resultWord='恭喜您支付成功';
        }else if($scope.resultType==='2'){
            $scope.resultWord='支付失败';
        }else if($scope.resultType==='1'){
            $scope.resultWord='支付取消';
        }else if($scope.resultType==='9'){
            $scope.resultWord='该订单只能用荣盛币支付';
        }
        $scope.nowTime=new Date().format('yyyy.MM.dd hh:mm:ss');
        $scope.seeBills=function(){
            if($scope.inFrom=='scan-pay'){
                $state.go('tabs.home',{});
            }else if($scope.inFrom=='rsb-buy'){
                $state.go('rsb',{type:'rsb-buy'});
            }else{
                $state.go('goods',{from:'payresult'});
            }
            $ionicViewSwitcher.nextDirection('back');
        }

    }])
