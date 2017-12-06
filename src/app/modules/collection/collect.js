angular.module('ymy.collect',[])
    .controller('collect',['$scope','$state','$ionicViewSwitcher','userService',function($scope,$state,$ionicViewSwitcher,userService){
        connectWebViewJavascriptBridge(function (bridge) {
            //回app
            bridge.callHandler('getAppUserData', null, function (response) {
                userService.userMess=response;
            })
        });
        $scope.backApp=function(){
            connectWebViewJavascriptBridge(function (bridge) {
                //回app
                bridge.callHandler('backToApp', null, function (response) {

                })
            });
        }
        $scope.toCollectPassage=function(){
            $state.go('collectPassage',{})
            $ionicViewSwitcher.nextDirection('forward');
        }
        $scope.toCollectVideo=function(){
            $state.go('collectVideo',{})
            $ionicViewSwitcher.nextDirection('forward');
        }
    }])
    .controller('collectpassage',['$scope','userService','$http','$state','$ionicViewSwitcher',function($scope,userService,$http,$state,$ionicViewSwitcher){
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
        $scope.toInfoDetail=function(val){
            $state.go('infoDetail',{from:'collect',rootId:9,id:val.news.id});
            $ionicViewSwitcher.nextDirection('forward');
        }
    }])
    .controller('collectvideo',['$scope','userService','$http','$state','$ionicViewSwitcher',function($scope,userService,$http,$state,$ionicViewSwitcher){
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
        $scope.toTeachVideo=function(val){
            $state.go('videoDetail', {detail:'collect',rootId:1,id: val.id});
            $ionicViewSwitcher.nextDirection('forward');
        }
    }])