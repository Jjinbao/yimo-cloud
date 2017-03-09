'use strict'
angular.module('tab.home', [])
    .controller('homeCtrl', ['$rootScope','$scope', '$ionicSlideBoxDelegate', '$state', 'userService', '$ionicHistory', '$ionicViewSwitcher', '$http','$location',
        function ($rootScope,$scope, $ionicSlideBoxDelegate, $state, userService, $ionicHistory, $ionicViewSwitcher, $http,$location) {
            $ionicHistory.clearHistory();
            var homeObj = this;
            this.model = {
                activeIndex: 0
            };
            this.pageClick = function (index) {
                $scope.model.activeIndex = 2;
            };
            $scope.$on('$ionicView.afterEnter', function () {
                $scope.isEmployee = false;
                $ionicHistory.clearHistory();
                $ionicSlideBoxDelegate.start();
                $ionicSlideBoxDelegate.$getByHandle("delegateHandler").loop(true);
                if (userService.userMess && userService.userMess.userId && userService.userMess.isEmployee) {
                    $scope.isEmployee = true;
                }
            })
            this.slideHasChanged = function ($index) {

            };
            $scope.delegateHandle = $ionicSlideBoxDelegate;

            //首页轮播图片
            userService.getHomeCard().then(function (data) {
                $scope.curItem = data.list.data;
                $ionicSlideBoxDelegate.update();
            });
            //首页旅游推荐
            userService.getTravelReco().then(function (data) {
                if (data.list.errcode === 10000) {
                    $scope.recHoliday = data.list.data;
                } else {
                    $scope.alertTab(data.list.message);
                }
            })


            $scope.loadMoreData = function () {

            }
            //首页住宿推荐
            $scope.recHotil;
            userService.getHomeStayCity().then(function (data) {

                $scope.recHotil = data.list.data.list;
            })
            $scope.toStayDetail = function (id) {
                $state.go('stayDetail', {pid: id});
                $ionicViewSwitcher.nextDirection('forward');
            }
            this.toScenic = function (city) {
                $state.go('tabs.recholiday', {id: city.cityId, picid: city.picFirst, city: city.cityName});
            }
            //首页扫码支付
            $scope.scanPay = function () {
                if (userService.userMess.userId) {
                    userService.modifyPassword(userService.userMess.userId).then(function(data){
                        console.log(data);
                        if(data.list.errcode==10000){
                            connectWebViewJavascriptBridge(function (bridge) {
                                //回app
                                bridge.callHandler('scanToPay', null, function (response) {
                                    console.log(response);
                                })
                            });
                        }else if(data.list.errcode==40002){
                            $rootScope.modifyPassword='scan-pay';
                            $scope.alertTab(data.list.message,modifyPassword);
                        }else if(data.list.errcode==25000){
                            $scope.alertTab(data.list.message);
                        }
                    })
                } else {
                    $state.go('login', {});
                    $ionicViewSwitcher.nextDirection('forward');
                }

            }

            function modifyPassword(){
                $state.go('identity',{'memery':'forget'});
                $ionicViewSwitcher.nextDirection('forward');
            }

            $scope.showEmployeeList = function () {
                $state.go('emplayvip', {})
                $ionicViewSwitcher.nextDirection('forward');
            }
        }])
    .controller('recHoliday', ['$rootScope', '$scope', '$ionicHistory', '$stateParams', '$state', '$ionicViewSwitcher', 'userService',
        function ($rootScope, $scope, $ionicHistory, $stateParams, $state, $ionicViewSwitcher, userService) {
            var travelData = {
                "pageNum": 1,
                "pageSize": 10,
                "proName": "",
                "proDay": "",
                "proTheme": "",
                "collectStatus": "",
                "userId": "",
                "cityId": $stateParams.id
            };
            $scope.holiday={
                count:0,
                list:[]
            }
            $scope.$on('$ionicView.afterEnter', function () {
                //获取活动页静态图片
                userService.getBannersPic($stateParams.picid).then(function (data) {
                    if(data.list.errcode==10000){
                        $scope.staticPics = data.list.data;
                    }else{
                        $scope.alertTab(data.list.message);
                    }
                })
                //获取旅游产品信息
                travelData.pageNum=1;
                $scope.holiday={
                    count:0,
                    list:[]
                }
                getTravelList(travelData);
            })

            function getTravelList(val){
                userService.getTravelList(val).then(function (data) {
                    if(data.list.errcode==10000){
                        $scope.holiday.count=data.list.data.count;
                        if(data.list.data.products){
                            $scope.holiday.list=$scope.holiday.list.concat(data.list.data.products);
                        }
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
            }

            $scope.title = $stateParams.city;
            $scope.goback = function () {
                $scope._goback(-1);
            };

            $scope.toTravelDetail = function (item) {
                $state.go('travelDetail', {pid: item.id});
                $ionicViewSwitcher.nextDirection('forward');
            }

            $scope.loadMoreDate=function(){
                travelData.pageNum++;
                getTravelList(travelData);
            }
        }
    ])
    .controller('emplayeeVip', ['$rootScope', '$scope', 'userService', '$state', '$ionicViewSwitcher', function ($rootScope, $scope, userService, $state, $ionicViewSwitcher) {
        var stayData = {
            priceSort: null,
            price: {min: -1, max: -1},
            RoomType: [],
            device: [],
            service: [],
            date: {checkIn: null, checkOut: null},
            city: null,
            pageSize: 5,
            pageNum: 1,
            state: 1
        }

        $scope.stayList={
            list:[],
            total:-1
        }

        $scope.$on('$ionicView.afterEnter', function () {
            reqData();
        })

        function reqData(){
            userService.getStayProductList(stayData).then(function (data) {
                if(data.list.errcode=10000){
                    $scope.stayList.total=data.list.data.count;
                    if(data.list.data.list){
                        $scope.stayList.list = $scope.stayList.list.concat(data.list.data.list);
                    }

                }else{
                    $scope.stayList.total=0;
                    $scope.alertTab(data.list.message);
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            })
        }

        $scope.loadMoreData=function(){
            stayData.pageNum++;
            reqData();
        }

        $scope.toStayDetail = function (id) {
            $state.go('stayDetail', {pid: id});
            $ionicViewSwitcher.nextDirection('forward');
        }
    }])
