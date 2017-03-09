angular.module('swalk.staylist', [])
    .controller('stayList', ['$rootScope', '$scope', '$state', '$ionicViewSwitcher','$ionicScrollDelegate', 'userService', function ($rootScope, $scope, $state, $ionicViewSwitcher,$ionicScrollDelegate, userService) {
        $scope.stayList={
            count:0,
            list:[]
        };
        $scope.totalDataNumber=0;
        $scope.ranking=[
            {name:'推荐排序',id:0},{name:'价格 高-低',id:1},{name:'价格 低-高',id:2}
        ]
        $scope.stayData = {
            priceSort:0,
            price: {min: -1, max: -1},
            RoomType: [],
            device: [],
            service:[],
            date: {checkIn: $rootScope.appStay.stayIn, checkOut: $rootScope.appStay.stayOut},
            city: $rootScope.selectCity.id,
            pageSize: 10,
            pageNum: 1
        }

        $scope.$on('$ionicView.afterEnter',function(){
            //处理筛选条件
            $scope.stayList={
                count:0,
                list:[]
            };
            $scope.stayData.price.min=$rootScope.price.min;
            $scope.stayData.price.max=$rootScope.price.max;

            angular.forEach($rootScope.houses,function(val){
                if(val.choice){
                    $scope.stayData.RoomType.push(val.id);
                }
            })
            angular.forEach($rootScope.stayDevices,function(val){
                if(val.choice){
                    $scope.stayData.device.push(val.id);
                }
            })
            angular.forEach($rootScope.stayServices,function(val){
                if(val.choice){
                    $scope.stayData.service.push(val.id);
                }
            })
            $scope.stayData.date.checkIn=$rootScope.appStay.stayIn;
            $scope.stayData.date.checkOut=$rootScope.appStay.stayOut;
            //请求获取度假产品列表
            requestStayList();
            //请求城市列表
            $scope.stayCity;
            requestCityList();
        })

        //requestStayList();
        function requestStayList() {
            userService.getStayProductList($scope.stayData).then(function (data) {
                if(data.list.errcode==10000){
                    $scope.stayList.count=data.list.data.count;
                    if(data.list.data.list){
                        $scope.stayList.list=$scope.stayList.list.concat(data.list.data.list);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }else{
                    $scope.alertTab(data.list.message);
                }
            })
        }

        $scope.goback = function () {
            if (appType === 1) {
                $scope._goback(-1);
            } else {
                $scope._goback(-1);
            }
        }



        function requestCityList() {
            userService.getCityId()
                .then(
                function (data) {
                    if (data.list.errcode === 10000) {
                        $scope.stayCity = data.list.data;
                    } else {
                        $scope.alertTab(data.list.message);
                    }

                }
            )
        }

        $scope.toStayDetail = function (id) {
            $state.go('stayDetail', {pid: id});
            $ionicViewSwitcher.nextDirection('forward');
        }

        //条件筛选
        $scope.itemList;
        $scope.typeFilter = function (val) {
            if ($scope.itemList === val) {
                return;
            }
            $scope.itemList = val;
            if ($scope.itemList === 'filter') {
                $state.go('condition', {});
                $ionicViewSwitcher.nextDirection('forward');
            }
        }

        //取消筛选
        $scope.cancleFilter = function () {
            $scope.itemList = '';
        }

        //地点排序
        $scope.placeFilter=function(val){
            $scope.itemList = '';
            if($rootScope.selectCity.id===val.id){
                return;
            }
            $scope.stayList={
                count:0,
                list:[]
            };
            $scope.stayData.pageNum=1;
            $ionicScrollDelegate.scrollTop(true);
            $rootScope.selectCity=val;
            $scope.stayData.city=val.id;
            requestStayList();
        }
        //价格排序
        $scope.priceSort=function(val){
            $scope.itemList = '';
            if($scope.stayData.priceSort===val.id){
                return;
            }
            $scope.stayList={
                count:0,
                list:[]
            };
            $scope.stayData.pageNum=1;
            $ionicScrollDelegate.scrollTop(true);
            $scope.stayData.priceSort=val.id;
            requestStayList();
        }

        $scope.loadMoreDate=function(){
            $scope.stayData.pageNum++;
            requestStayList();
        }
    }])
