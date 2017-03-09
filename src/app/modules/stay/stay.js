'use strict'

angular.module('tab.stay', [])
    .controller('stayCtrl', ['$rootScope', '$scope', '$state', '$ionicHistory', '$ionicViewSwitcher', 'userService', function ($rootScope, $scope, $state, $ionicHistory, $ionicViewSwitcher, userService) {
        //每次返回都要清理历史记录
        $scope.$on('$ionicView.afterEnter', function () {
            $ionicHistory.clearHistory();
            dealTerms();
        })
        if ($state.params.stayInDate && $state.params.stayOutDate) {
            $rootScope.appStay.stayIn = $state.params.stayInDate;
            $rootScope.appStay.stayOut = $state.params.stayOutDate;
        }
        //获取城市列表
        userService.getCityId().then(function (data) {
            if (data.list.errcode === 10000) {
                $rootScope.selectCity = data.list.data[0];
                $rootScope.cityList = data.list.data;
                $scope.nowCity = $rootScope.cityList[0];
            }
        });
        //价格
        $rootScope.price = {min: -1, max: -1};
        //房型
        $rootScope.houses = [{name: '一床', id: 58}, {name: '二床', id: 59}, {name: '三床', id: 60}, {name: '其他', id: 61}];
        //获取设施和服务列表
        userService.getStayServiceAndDevice().then(function (data) {
            if (data.list.errcode === 10000) {
                $rootScope.stayDevices = data.list.data.mobileDeviceList;
                $rootScope.stayServices = data.list.data.mobileServiceList;
            }
        });
        //处理条件选择

        function dealTerms(){
            $scope.priceShow='价格不限';
            $scope.houseShow='床位不限';
            $scope.deviceShow='设施不限';
            $scope.serviceShow='服务不限';
            if($rootScope.price.min==-1&&$rootScope.price.max<480&&$rootScope.price.max!=-1){
                $scope.priceShow='￥'+$rootScope.price.max+'以下';
            }else if($rootScope.price.min>0&&$rootScope.price.max<480&&$rootScope.price.max!=-1){
                $scope.priceShow='￥'+$rootScope.price.min+'-'+'￥'+$rootScope.price.max;
            }else if($rootScope.price.min>0&&$rootScope.price.max==-1){
                $scope.priceShow='￥'+$rootScope.price.min+'以上';
            }else{
                $scope.priceShow='价格不限';
            }

            var house=[];
            angular.forEach($rootScope.houses,function(val){
                if(val.choice){
                    house.push(val);
                }
            })
            if(house.length>0&&house.length<=2){
                $scope.houseShow=house.length==2?(house[0].name+'/'+house[1].name):house[0].name;
            }else if(house.length>2){
                $scope.houseShow=house[0].name+'/'+house[1].name+'...';
            }

            var device=[];
            var service=[];
            if($rootScope.stayDevices){
                angular.forEach($rootScope.stayDevices,function(val){
                    if(val.choice){
                        device.push(val);
                    }
                })

                angular.forEach($rootScope.stayServices,function(val){
                    if(val.choice){
                        service.push(val);
                    }
                })
            }
            if(device.length==1){
                $scope.deviceShow=device[0].name
            }else if(device.length>1){
                $scope.deviceShow=device[0].name+'...'
            }

            if(service.length==1){
                $scope.serviceShow=service[0].name;
            }else if(service.length>1){
                $scope.serviceShow=service[0].name+'...';
            }
        }
        $scope.search = function () {
            $state.go('staylist', {name: $rootScope.selectCity.name});
            $ionicViewSwitcher.nextDirection('forward');
        }

        //选择住宿地点
        $scope.toChoiceTarget = function () {
            $state.go('citylist', {});
            $ionicViewSwitcher.nextDirection('forward');
            if (appType === 1) {

            } else {

            }
        }
        var ipObj1 = {
            callback: function (val, inOut) {
                setStayInOut(val, inOut);
            },
            disabledDates: [],
            from: new Date(),
            to: new Date(2020, 12, 31),
            inputDate: new Date(),
            mondayFirst: true,
            showTodayButton: false,
            closeOnSelect: true,
            templateType: 'popup',
            dateFormat: 'yyyy-MM-dd'
        };

        function setStayInOut(val, flg) {
            if (flg.substr(5) === 'in') {
                $rootScope.appStay.stayIn = val.year + '-' + ((val.month + 1) > 9 ? (val.month + 1) : ('0' + (val.month + 1))) + '-' + (val.date > 9 ? (val.date) : ('0' + (val.date)));
                var myCha = compareLastDate($rootScope.appStay.stayIn, $rootScope.appStay.stayOut);
                if (myCha === 1) {
                    $rootScope.appStay.stayOut = getNextDay($rootScope.appStay.stayIn);
                }
                $scope.alertTab('入住日期选择成功');
            } else {
                $rootScope.appStay.stayOut = val.year + '-' + ((val.month + 1) > 9 ? (val.month + 1) : ('0' + (val.month + 1))) + '-' + (val.date > 9 ? val.date : ('0' + (val.date)));
                ;
                $scope.alertTab('离店日期选择成功');
            }
        }


        //选择入住，离店日期
        // $scope.toChoiceStayIn=function(){
        //     ipObj1.from=new Date();
        //     ionicDatePicker.openDatePicker(ipObj1, 1,'stay-in');
        //
        // }
        //
        // $scope.toChoiceStayOut=function(){
        //     ipObj1.from=getNextDay($rootScope.appStay.stayIn);
        //     ionicDatePicker.openDatePicker(ipObj1, 1,'stay-out');
        // }


        //选择服务和设施
        $scope.toChoiceService = function () {
            $state.go('condition', {});
            $ionicViewSwitcher.nextDirection('forward');
        }
        $scope.stayChoiceDate=function(){
            $state.go('stayChoiceDate',{});
            $ionicViewSwitcher.nextDirection('forward');
        }
    }])
    .controller('stayChoiceDateCtrl', ['$rootScope','$scope', '$q', '$state','$timeout', function ($rootScope,$scope, $q, $state,$timeout) {
        $scope.stayInDate = '';
        $scope.stayOutDate = '';
        $scope.temp = [];
        $scope.options = {
            model: 'selectDate',
            getData: function () {
                var def = $q.defer();
                def.resolve($scope.temp[0] ? $scope.temp : []);
                return def.promise
            },
            clickDate: function (current, list) {
                var today=getTodayDate();
                var canUsed=compareLastDate(today,current.fullDate);
                if(canUsed==1){
                    return;
                }
                if($scope.stayOutDate){
                    return;
                }
                if (!$scope.stayInDate || $scope.stayInDate > current.fullDate) {
                    $scope.stayInDate = current.fullDate;
                    angular.forEach(list, function (item) {
                        if (item == current) {
                            item.stayIn = true;
                            item.text = '入住'
                        } else {
                            item.stayIn = false;
                            item.text = ''
                        }
                    });
                    $scope.temp[0] = {
                        stayIn: true,
                        text: '入住',
                        date: current.fullDate
                    };
                    //$scope.alertTab('已选择入住时间')
                } else if ($scope.stayInDate && $scope.stayInDate < current.fullDate) {
                    $scope.stayOutDate = current.fullDate;
                    current.stayIn = true;
                    current.text = '离店';
                    //$scope.alertTab('已选择离店时间');
                    $rootScope.appStay.stayIn=$scope.stayInDate;
                    $rootScope.appStay.stayOut=$scope.stayOutDate;
                    var timeOutId=$timeout(function(){
                        $timeout.cancel(timeOutId);
                        $scope._goback(-1);
                    },500)
                    /*if ($state.params.name) {

                        $state.go('staylist', {
                            stayInDate: $scope.stayInDate,
                            stayOutDate: $scope.stayOutDate,
                            name: $state.params.name
                        })
                    } else {
                        //$state.go('tabs.stay', {stayInDate: $scope.stayInDate, stayOutDate: $scope.stayOutDate})
                    }*/
                }
            }
        }
    }
    ]);
