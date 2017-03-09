'use strict'

angular.module('tab.holiday', [])
    .controller('holidayCtrl', ['$scope', '$state', '$interval', '$ionicViewSwitcher', '$ionicScrollDelegate','$ionicHistory', 'userService',
        function ($scope, $state, $interval, $ionicViewSwitcher, $ionicScrollDelegate,$ionicHistory, userService) {
            $scope.totalDataNumber=0;
            //每次进入该页面要清空一下历史记录,非常重要
            $scope.$on('$ionicView.afterEnter',function(){
                $ionicHistory.clearHistory();
            })
            var holidaytab = this;
            holidaytab.dataList=[];
            holidaytab.refishData = false;
            holidaytab.filterCondition = {
                place: [],
                days: [{name: '天数', id: ''}, {name: '5日游', id: 5}, {name: '10日游', id: 10}, {name: '15日游', id: 15}],
                types: []
            }

            holidaytab.productParams = {
                pageNum: 1,
                pageSize: 10,
                proName: '',
                proDay: '',
                proTheme: '',
                collectStatus: '',
                userId: '',
                cityId: ''
            }

            requestCityList();
            //请求城市列表
            function requestCityList() {
                userService.getCityId()
                    .then(
                    function (data) {
                        angular.copy(data.list.data, holidaytab.filterCondition.place);
                        holidaytab.initPlace = holidaytab.filterCondition.place[0];
                        requestThemeList();
                    },
                    function (error) {

                    }
                )
            }

            //请求度假主题
            function requestThemeList() {
                userService.getThemeList()
                    .then(
                    function (data) {
                        angular.copy(data.list.data, holidaytab.filterCondition.types);
                        holidaytab.initTypes = holidaytab.filterCondition.types[0];
                        holidaytab.productParams.cityId = holidaytab.initPlace.id;
                        requestTravelData();
                    },
                    function (error) {

                    }
                )
            }


            //旅游天数
            holidaytab.initDays = this.filterCondition.days[0];

            this.nowShow = [];
            this.itemList = '';
            this.typeFilter = function (val) {
                if (holidaytab.itemList === val) {
                    holidaytab.itemList = '';
                    return;
                }
                holidaytab.itemList = val;
                switch (val) {
                    case 'place':

                        holidaytab.place();
                        break;
                    case 'days':
                        holidaytab.days();
                        break;
                    case 'type':
                        holidaytab.type();
                        break;
                }
            }
            this.place = function (val) {
                holidaytab.nowShow = holidaytab.filterCondition.place;
            };
            this.days = function (val) {
                holidaytab.nowShow = holidaytab.filterCondition.days;
            };
            this.type = function (val) {
                holidaytab.nowShow = holidaytab.filterCondition.types;
            };

            //选择城市筛选条件
            holidaytab.clickPlaceResult = function (obj) {
                if (holidaytab.initPlace.name === obj.name) {
                    return;
                }
                //每次更改筛选条件，都去重置请求参数
                $scope.totalDataNumber=0;
                holidaytab.productParams.pageNum=1;
                holidaytab.dataList=[];

                holidaytab.initPlace = obj;
                holidaytab.productParams.cityId = obj.id;
                $ionicScrollDelegate.scrollTop(true);
                requestTravelData();
            }

            //选择天数筛选条件
            holidaytab.clickDaysResult = function (obj) {
                if (holidaytab.initDays.name === obj.name) {
                    return;
                }
                //每次更改筛选条件，都去重置请求参数
                $scope.totalDataNumber=0;
                holidaytab.productParams.pageNum=1;
                holidaytab.dataList=[];

                holidaytab.initDays = obj;

                if (obj.id != '') {
                    holidaytab.productParams.proDay = obj.id;
                } else {
                    holidaytab.productParams.proDay = '';
                }
                $ionicScrollDelegate.scrollTop(true);
                requestTravelData();
            }

            //选择主题筛选条件
            holidaytab.clickThemeResult = function (obj) {
                if (holidaytab.initTypes.name === obj.name) {
                    return;
                }
                //每次更改筛选条件，都去重置请求参数
                $scope.totalDataNumber=0;
                holidaytab.productParams.pageNum=1;
                holidaytab.dataList=[];
                holidaytab.initTypes = obj;

                if (obj.id != '' || obj.id != null) {
                    holidaytab.productParams.proTheme = obj.id;
                } else {
                    holidaytab.productParams.proDay = '';
                }
                $ionicScrollDelegate.scrollTop(true);
                requestTravelData();
            }

            this.choiceData = function () {
                holidaytab.itemList = '';
            }

            this.toHolidayDetail = function (pid) {
                $state.go('travelDetail', {pid: pid});
                $ionicViewSwitcher.nextDirection('forward');

            }

            //改变筛选条件
            $scope.$on('change.filter.condition', function (evt, data) {
                if (data && data.type) {
                    switch (data.type) {
                        case 'place':
                            holidaytab.initPlace = data.value;
                            break;
                        case 'days':
                            holidaytab.initDays = data.value;
                            break;
                        case 'type':
                            holidaytab.initTypes = data.value;
                            break;
                    }
                }
            })
            //请求填充数据
            function requestTravelData() {
                userService.getTravelList(holidaytab.productParams).then(function (data) {
                    if(data.list.errcode==10000){
                        if(data.list.data.products){
                            holidaytab.dataList = holidaytab.dataList.concat(data.list.data.products);
                        }else{
                            holidaytab.dataList = [];
                        }
                        $scope.totalDataNumber=data.list.data.count;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }else{
                        $scope.alertTab(data.list.message);
                    }

                })
            }

            holidaytab.appendHoliday = function () {
                holidaytab.productParams.pageNum++;
                requestTravelData();

            }

        }])
