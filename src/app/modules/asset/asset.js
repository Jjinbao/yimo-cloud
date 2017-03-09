'user strict';

angular.module('swalk.asset', [])
    .controller('myAsset', ['$scope', '$state', '$ionicViewSwitcher', function ($scope, $state, $ionicViewSwitcher) {
        $scope.assetDetail = function () {
            $state.go('assetDetail', {});
            $ionicViewSwitcher.nextDirection('forward');
        }

        $scope.assetIncome = function () {
            $state.go('assetIncome', {});
            $ionicViewSwitcher.nextDirection('forward');
        }

        $scope.assetHousekeeper = function () {
            $state.go('assetHousekeeper', {});
            $ionicViewSwitcher.nextDirection('forward');
        }
        $scope.assetNews = function () {
            $state.go('assetNews', {});
            $ionicViewSwitcher.nextDirection('forward');
        }
        $scope.maintenanceRecord = function () {
            $state.go('maintenanceRecord', {});
            $ionicViewSwitcher.nextDirection('forward');
        }
    }])
    .controller('assetDetailCtrl', ['userService', '$scope', '$ionicViewSwitcher', '$ionicHistory', '$state', '$rootScope',
        function (userService, $scope, $ionicViewSwitcher, $ionicHistory, $state, $rootScope) {
            $scope.detailList = [];
            userService.getAssetDetailList().then(function (res) {
                $scope.detailList = res.list.data;

            });
            $scope.selectAsset = function (asset) {
                if ($state.params.type == 1) {
                    $rootScope.asset = {
                        merchId: asset.merchId,
                        assetName: asset.asset.assetName,
                        assetId: asset.asset.assetId
                    };
                    $state.go('assetHousekeeperReservation')
                }
            }
        }])
    .controller('assetIncomeCtrl', ['userService', '$scope', '$state', '$ionicViewSwitcher',
        function (userService, $scope, $state, $ionicViewSwitcher) {
            $scope.detailList = [];
            userService.getAssetIncomeList().then(function (res) {
                $scope.detailList = res.list.data;
            });
            $scope.toIncomeDetail = function (detail) {
                $state.go('assetIncomeDetail', {income: detail});
                $ionicViewSwitcher.nextDirection('forward');
            }
        }])
    .controller('assetIncomeDetail', ['$scope', '$state', function ($scope, $state) {
        $scope.assetIncome = $state.params.income;
        $scope.graph = {};
        $scope.graph.borderColor='rgba(252,11,11,1)';
        $scope.graph.data = [
            []
        ];
        for(var i=0;i<6;i++){
            $scope.graph.data[0][i]=$scope.assetIncome.latestIncome[i];
        }

        $scope.graph.labels = getLastSixMonth();
        function getLastSixMonth(){
            var date=new Date();
            var nowYear=date.getFullYear();
            var nowMonth=date.getMonth()+1;
            var monthArr=[];
            for(var i=0;i<6;i++){
                nowMonth--;
                if(nowMonth==0){
                    nowMonth=12;
                    nowYear--;
                }
                monthArr.push(nowMonth>9?(nowYear+'-'+nowMonth):(nowYear+'-'+('0'+nowMonth)));
            }
            monthArr.reverse();
            return monthArr;
        }
    }])
    .controller('assetNewsCtrl', ['userService', '$scope',
        function (userService, $scope) {
            $scope.newsList = [];
            userService.getAssetNewsList().then(function (res) {
                $scope.newsList = res.list.data;
            });
        }])
    .controller('housekeeperCtrl', ['userService', '$scope', '$ionicLoading', '$state', '$q', '$ionicViewSwitcher',
        function (userService, $scope, $ionicLoading, $state, $q, $ionicViewSwitcher) {
            $scope.options = {
                model: 'selectDate',
                getData: function (date) {
                    var deffered = $q.defer();
                    userService.getHousekeeperList(date).then(function (res) {
                        if (res.list.errcode == 10000) {
                            var arr = res.list.data.sxAppointmentInfoList || [];
                            arr = arr.map(function (item) {
                                return {
                                    date: item,
                                    appoint: true,
                                    text: '预'
                                }
                            });
                            var houseKeeperArr=res.list.data.houseKeepersDateList || [];
                            houseKeeperArr=houseKeeperArr.map(function(item){
                                return {
                                    date: item,
                                    appoint: true,
                                    label: '常'
                                }
                            })
                            arr=arr.concat(houseKeeperArr);
                            deffered.resolve(arr)
                        } else {
                            deffered.resolve([])
                        }
                    });
                    return deffered.promise
                },
                clickDate: function (current) {
                    if (current.appoint) {
                        $state.go('assetHousekeeperReservation', {date: current.fullDate, appoint: true})
                    }
                }
            }

            $scope.assetHousekeeperReservation = function () {
                $state.go('assetHousekeeperReservation', {});
                $ionicViewSwitcher.nextDirection('forward');
            }
        }])
    .controller('housekeeperReservationCtrl', ['userService', '$scope', '$rootScope', '$state',
        function (userService, $scope, $rootScope, $state) {
            $scope.appoint = $state.params.appoint;
            if ($state.params.appoint) {
                userService.getHousekeeperListForDay($state.params.date).then(function (res) {
                    $scope.appointList = res.list.data;
                    //appointmentInfoList
                    //houseKeeperList
                    angular.forEach($scope.appointList, function (item) {
                        item.categoryList = lineAtThree(item.appointmentServiceList)
                    })
                })
            } else {
                $scope.categoryList = [];
                $scope.saveObj = {
                    stringList: [],
                    contactsPhone: '',
                    remark: '',
                    date: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
                    contactsName: ''
                };

                $scope.saveFun = function () {
                    var phoneReg = /^1[3|5|7|8]\d{9}$/;
                    if ($scope.saveObj.stringList.length == 0) {
                        $scope.alertTab('请选择预约项目');
                        return
                    } else if (!$scope.saveObj.remark) {
                        $scope.alertTab('请输入备注内容');
                        return
                    } else if (!phoneReg.exec($scope.saveObj.contactsPhone)) {
                        $scope.alertTab('请输入正确的手机号码');
                        return
                    } else if (!$scope.saveObj.contactsName) {
                        $scope.alertTab('请输入联系人姓名');
                        return
                    } else if (!$rootScope.asset || !$rootScope.asset.assetId || !$rootScope.asset.merchId) {
                        $scope.alertTab('请选择资产');
                        return
                    }
                    $scope.saveObj.assetId = $rootScope.asset.assetId;
                    $scope.saveObj.merchId = $rootScope.asset.merchId;
                    userService.saveAppointment($scope.saveObj).then(function (res) {
                        if (res.list.errcode == 10000) {
                            $scope.alertTab('预约成功');
                            $scope._goback(-1);
                        } else {
                            $scope.alertTab('预约失败');
                        }
                    });
                };

                $scope.cancleFun=function(){
                    $scope._goback(-1);
                }

                var now = new Date();
                userService.getHousekeeperList(now.getFullYear() + '-' + (now.getMonth() + 1)).then(function (res) {
                    var categoryList = res.list.data.categoryList;
                    $scope.categoryList = lineAtThree(categoryList);
                });
                $scope.selectCategory = function (category) {
                    if ($scope.saveObj.stringList.indexOf(category.id) > -1) {
                        angular.forEach($scope.saveObj.stringList, function (item, i) {
                            if (item == category.id) {
                                $scope.saveObj.stringList.splice(i, (i + 1));
                            }
                        })
                    } else {
                        $scope.saveObj.stringList.push(category.id);
                    }
                }
            }

            function lineAtThree(arr) {
                if (!arr) {
                    return []
                }
                var resultArr = [];
                for (var i = 0, l = arr.length; i < l; i++) {
                    var len = Math.floor(i / 3);
                    if (resultArr[len]) {
                        resultArr[len].push(arr[i])
                    } else {
                        resultArr[len] = [];
                        resultArr[len].push(arr[i])
                    }
                }
                return resultArr
            }
        }])
    .controller('maintenanceRecord', ['userService', '$scope', '$ionicLoading', '$state', '$q', '$ionicViewSwitcher',
        function (userService, $scope, $ionicLoading, $state, $q, $ionicViewSwitcher) {
            $scope.options = {
                model: 'selectDate',
                getData: function (date) {
                    var deffered = $q.defer();
                    userService.getRepairMonth(date).then(function (res) {
                        if (res.list.errcode == 10000) {
                            var arr = res.list.data || [];
                            arr = arr.map(function (item) {
                                return {
                                    date: item,
                                    appoint: true,
                                    text: '<img src="app/img/me_icon_detect@3x.png"/>'
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
                    if (current.appoint) {
                        $state.go('maintenanceRecordInfo', {date: current.fullDate})
                    }
                }
            }
        }])
    .controller('maintenanceRecordInfo', ['$scope', '$state', 'userService', function ($scope, $state, userService) {
        var date = $state.params.date;
        $scope.$on('$ionicView.afterEnter', function () {
            userService.getRepairDate(date).then(function (res) {
                if (res.list.errcode == 10000) {
                    $scope.checkList = res.list.data;
                }
            })
        })
    }])
    .directive('lDatepicker', [function () {
        return {
            restrict: 'AEC',
            link: function (scope, ele) {
                var calendar = new LCalendar();
                var minDate=new Date();
                calendar.init({
                    'trigger': '#' + ele.attr('id'),
                    'type': 'date',
                    'minDate': minDate.getFullYear()+'-'+(minDate.getMonth()+1)+'-'+minDate.getDate(),
                    'maxDate': (minDate.getFullYear()+1)+'-12-31'
                });
            }
        }
    }])
    .directive('swalkDistance', [function () {
        return {
            restrict: 'A',
            scope: {
                options: '=distanceOptions'
            },
            templateUrl: 'app/modules/asset/swalk.distance.html',
            link: function (scope, ele) {

            },
            controller: ['$scope', 'userService', '$ionicLoading', '$state',
                function ($scope, userService, $ionicLoading, $state) {
                    var options = {
                        model: 'default',
                        maxYear: '2030',
                        minYear: '2010'
                    };
                    options = angular.extend(options, $scope.options);
                    $scope.days = ['日', '一', '二', '三', '四', '五', '六'];
                    $scope.dayList = [];
                    $scope.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                    $scope.years = [];
                    for (var year = options.minYear, maxYear = options.maxYear; year < maxYear; year++) {
                        $scope.years.push(year)
                    }
                    var now = resetHMSM(new Date());

                    $scope.year = now.getFullYear();
                    $scope.month = (now.getMonth() + 1);

                    $scope.nMonth = function () {
                        $scope.month++;
                        if ($scope.month == 13) {
                            if ($scope.years.indexOf(($scope.year + 1)) == -1) {
                                $scope.month = 12;
                                $scope.alertTab('已超出可选时间范围')
                            } else {
                                $scope.month = 1;
                                $scope.year++;
                                countDayList($scope.year, ($scope.month - 1));
                            }
                        } else {
                            countDayList($scope.year, ($scope.month - 1));
                        }
                    };

                    $scope.pMonth = function () {
                        $scope.month--;
                        if ($scope.month == 0) {
                            if ($scope.years.indexOf(($scope.year - 1)) == -1) {
                                $scope.month = 1;
                                $scope.alertTab('已超出可选时间范围');
                            } else {
                                $scope.month = 12;
                                $scope.year--;
                                countDayList($scope.year, ($scope.month - 1));
                            }
                        } else {
                            countDayList($scope.year, ($scope.month - 1));
                        }
                    };

                    function resetHMSM(currentDate) {
                        currentDate.setHours(0);
                        currentDate.setMinutes(0);
                        currentDate.setSeconds(0);
                        currentDate.setMilliseconds(0);
                        return currentDate;
                    }

                    function addZero(nub) {
                        return nub < 10 ? '0' + nub : nub
                    }

                    function countDayList(year, month) {
                        var myMonth = month + 1;
                        myMonth = (myMonth > 9) ? myMonth : ('0' + myMonth);
                        $ionicLoading.show({
                            template: '加载中。。。'
                        });
                        $scope.options.getData(year + '-' + myMonth).then(function (res) {
                            $scope.dataList = res;
                            $scope.dayList = [];
                            var startDate = new Date(year, month, 1);
                            var endDate = new Date(year, (month + 1), 0);
                            for (var i = startDate.getDate(); i <= endDate.getDate(); i++) {
                                var tempDate = resetHMSM(new Date(year, month, i));

                                $scope.dayList.push({
                                    fullDate: tempDate.getFullYear() + '-' + addZero((tempDate.getMonth() + 1)) + '-' + addZero(tempDate.getDate()),
                                    d: tempDate.getDate(),
                                    month: (tempDate.getMonth() + 1),
                                    year: tempDate.getFullYear(),
                                    day: tempDate.getDay(),
                                    epoch: tempDate.getTime(),
                                    disabled: options.model == 'selectDate' && (now.getTime() > tempDate.getTime()) ? true : false
                                });
                            }
                            var firstDay = $scope.dayList[0].day;
                            for (var j = 0, l = firstDay; j < l; j++) {
                                var preDate = resetHMSM(new Date(year, month, -j));
                                $scope.dayList.unshift({
                                    fullDate: preDate.getFullYear() + '-' + addZero((preDate.getMonth() + 1)) + '-' + addZero(preDate.getDate()),
                                    d: preDate.getDate(),
                                    month: (preDate.getMonth() + 1),
                                    year: preDate.getFullYear(),
                                    day: preDate.getDay(),
                                    epoch: preDate.getTime(),
                                    disabled: true
                                })
                            }

                            var lastDay = $scope.dayList[$scope.dayList.length - 1].day;
                            var lastMonthDay = 1;
                            for (var k = lastDay; k < 6; k++) {
                                var nextDate = resetHMSM(new Date(year, (month + 1), lastMonthDay++));

                                $scope.dayList.push({
                                    fullDate: nextDate.getFullYear() + '-' + addZero((nextDate.getMonth() + 1)) + '-' + addZero(nextDate.getDate()),
                                    d: nextDate.getDate(),
                                    month: (nextDate.getMonth() + 1),
                                    year: nextDate.getFullYear(),
                                    day: nextDate.getDay(),
                                    epoch: nextDate.getTime(),
                                    disabled: true
                                })
                            }

                            angular.forEach($scope.dayList, function (item) {
                                angular.forEach($scope.dataList, function (d) {
                                    if (item.fullDate == d.date) {
                                        angular.extend(item, d);
                                    }
                                })
                                if(item.label&&item.text){
                                    item.text='<img src="app/img/me_icon_guanjia1@3x.png"> 预'
                                }
                            });
                            $ionicLoading.hide();
                        });

                    }

                    countDayList(now.getFullYear(), now.getMonth());
                    $scope.clickDate = $scope.options.clickDate;
                }]
        }
    }])
    .directive('line-chart', function () {
        return {
            scope: {
                id: "@",
                legend: "=",
                item: "=",
                data: "="
            },
            restrict: 'E',
            template: '<div style="height:400px;"></div>',
            replace: true,
            link: function ($scope, element, attrs, controller) {
                var option = {
                    // 提示框，鼠标悬浮交互时的信息提示
                    tooltip: {
                        show: true,
                        trigger: 'item'
                    },
                    // 图例
                    legend: {
                        data: $scope.legend
                    },
                    // 横轴坐标轴
                    xAxis: [{
                        type: 'category',
                        data: $scope.item
                    }],
                    // 纵轴坐标轴
                    yAxis: [{
                        type: 'value'
                    }],
                    // 数据内容数组
                    series: function () {
                        var serie = [];
                        for (var i = 0; i < $scope.legend.length; i++) {
                            var item = {
                                name: $scope.legend[i],
                                type: 'line',
                                data: $scope.data[i]
                            };
                            serie.push(item);
                        }
                        return serie;
                    }()
                };
                var myChart = echarts.init(document.getElementById($scope.id), 'macarons');
                myChart.setOption(option);
            }
        };
    });

/*

 */