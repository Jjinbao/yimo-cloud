'use strict'

angular.module('swalk.serviceADevice',[])
    .controller('serviceDevice',['$rootScope','$scope','userService',function($rootScope,$scope,userService){
        $scope.stayDevices=$rootScope.stayDevices;
        $scope.stayService=$rootScope.stayServices;
        $scope.goback=function(){
            if(appType===1){

            }else{

            }
            $scope._goback(-1);
        }

        $scope.choiceDevice=function(val){
            if(val.choice){
                val.choice=!val.choice;
            }else{
                val.choice=true;
            }
        }

        $scope.choiceService=function(val){
            if(val.choice){
                val.choice=!val.choice;
            }else{
                val.choice=true;
            }
        }

        $scope.choiceHouse=function(val){

        }
        //拖动条
        $scope.slider = {
            minValue: $rootScope.price.min==-1?0:$rootScope.price.min,
            maxValue: $rootScope.price.max==-1?480:$rootScope.price.max,
            options: {
                floor: 0,
                ceil: 480,
                translate: function(value) {
                    return value;
                }
            }
        };
        $scope.currencyFormatting = function(value) { return value.toString() + " $" }
        //清空筛选
        $scope.clearFilter=function(){
            angular.forEach($scope.stayDevices,function(val){
                if(val.choice){
                    val.choice=false;
                }
            })
            angular.forEach($scope.stayService,function(val){
                if(val.choice){
                    val.choice=false;
                }
            })

            angular.forEach($rootScope.houses,function(val){
                if(val.choice){
                    val.choice=false;
                }
            })
            $scope.slider.minValue=0;
            $scope.slider.maxValue=480;
            $rootScope.price = {min: -1, max: -1};
        }

        //确认筛选
        $scope.sureFilter=function(){
            if($scope.slider.minValue==0&&$scope.slider.maxValue==480){
                $rootScope.price = {min: -1, max: -1};
            }else if($scope.slider.minValue==0&&$scope.slider.maxValue<480){
                $rootScope.price = {min: -1, max: $scope.slider.maxValue};
            }else if($scope.slider.minValue>0&&$scope.slider.maxValue==480){
                $rootScope.price = {min: $scope.slider.minValue, max: -1};
            }else if($scope.slider.minValue>0&&$scope.slider.maxValue<480){
                $rootScope.price = {min: $scope.slider.minValue, max: $scope.slider.maxValue};
            }
            $scope._goback(-1);
        }
    }])
