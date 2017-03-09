'use strict'

angular.module('swalk.buyrsb',[])
    .controller('buyrsb',['$scope','$state','$ionicViewSwitcher',function($scope,$state,$ionicViewSwitcher){
        $scope.canBtnUsed=false;
        $scope.usersum={
            sum:'',
            vartual:0
        }
        $scope.$watchCollection('usersum',function(val){
            if(isNaN(val.sum)){
                $scope.alertTab('请输入正确的金额');
                $scope.usersum.sum='';
                return;
            }
            if(val.sum&&val.sum<50000){
                $scope.canBtnUsed=true;
                $scope.usersum.vartual=$scope.usersum.sum*1.1;
            }else if(val.sum&&val.sum>50000){
                $scope.canBtnUsed=false;
                $scope.usersum.vartual=0;
                $scope.alertTab('充值金额不能多于5万');
            }else{
                $scope.canBtnUsed=false;
                $scope.usersum.vartual=0;
            }
        })
        $scope.buyExplain=function(){
            $state.go('buyexplain',{});
            $ionicViewSwitcher.nextDirection('forward');
        }

        $scope.buyRsb=function(){
            if(!$scope.canBtnUsed){
                return;
            }
            $scope.alertTab('吊起微信支付')
        }
    }])

