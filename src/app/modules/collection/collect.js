angular.module('ymy.collect',[])
    .controller('collect',['$scope','$state','$ionicViewSwitcher',function($scope,$state,$ionicViewSwitcher){
        $scope.toCollectPassage=function(){
            $state.go('collectPassage',{})
            $ionicViewSwitcher.nextDirection('forward');
        }
        $scope.toCollectVideo=function(){
            $state.go('collectVideo',{})
            $ionicViewSwitcher.nextDirection('forward');
        }
    }])
    .controller('collectpassage',['$scope','userService','$http',function($scope,userService,$http){
        console.log('passage');
        console.log(userService.userMess.accountId)
        $http({
            url: urlStr + 'ym/collection/list.api',
            method: 'POST',
            params: {
                accountId: userService.userMess.accountId,
                type: 'news',
                sign: md5('ymy' + userService.userMess.accountId + 'news')
            }
        }).success(function (data) {
            console.log(data);
            if (data.result == 1) {
                $scope.passageUseList = data.list;

                $scope.passageUseList.forEach(function (val) {
                    val.news.formateDate=new Date(val.news.pubTime*1000).format('yyyy-MM-dd');
                    val.date = new Date(parseInt(val.readTime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
                })
                console.log($scope.passageUseList);
            }
        }).error(function () {
            scope.$emit('my.net.break','');
            //$scope.alertTab('网络异常,请检查网络!',$scope.netBreakBack);
        })
    }])
    .controller('collectvideo',['$scope','userService','$http',function($scope,userService,$http){
        console.log('video');
        console.log(userService.userMess.accountId)
        $scope.panelType='sp';
        $http({
            url: urlStr + 'ym/collection/list.api',
            method: 'POST',
            params: {
                accountId: userService.userMess.accountId,
                type: 'album',
                sign: md5('ymy' + userService.userMess.accountId + 'album')
            }
        }).success(function (data) {
            console.log(data);
            $scope.videoUseList=data.list;
            // if (data.result == 1) {
            //     scope.videoUseList = data.list;
            //     scope.videoUseList.forEach(function (val) {
            //         val.date = new Date(parseInt(val.readTime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
            //     })
            // }
        }).error(function () {
            //$scope.alertTab('网络异常,请检查网络!',$scope.netBreakBack);
        })
    }])