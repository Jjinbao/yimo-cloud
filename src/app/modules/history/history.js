angular.module('ymy.history',[])
    .controller('historyRecord',['$scope','$state','$ionicViewSwitcher','userService',function($scope,$state,$ionicViewSwitcher,userService){
        $scope.$on('$ionicView.beforeEnter',function(){
            $scope.hideTabBar('hide');
        })

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

        $scope.toPart=function(val){
            var timestamp=$scope.getTimeStamp();
            if(val=='应用'){
                $state.go('application',{timestamp:timestamp});
            }else if(val=='文章'){
                $state.go('infoMsg',{timestamp:timestamp});
            }else if(val=='视频'){
                $state.go('teaching',{timestamp:timestamp});
            }
            $ionicViewSwitcher.nextDirection('forward');
        }

    }])
    .controller('application',['$scope','$state','$http','$ionicViewSwitcher','userService',function($scope,$state,$http,$ionicViewSwitcher,userService){
        $scope.appList='';
        $http({
            url:urlStr+'ym/history/list.api',
            method:'POST',
            params:{
                accountId:userService.userMess.accountId,
                type:'app',
                sign:md5('ymy'+userService.userMess.accountId+'app')
            }
        }).success(function(data){
            console.log(data);
            if(data.result==1){
                $scope.appList=data.list;
                $scope.appList.forEach(function(val){
                  val.date=new Date(parseInt(val.readTime) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
                })
            }
        }).error(function(){
            $scope.alertTab('网络异常,请检查网络!',$scope.netBreakBack);
        })
    }])
    .controller('teaching',['$scope','$state','$http','$ionicViewSwitcher','userService',function($scope,$state,$http,$ionicViewSwitcher,userService){
        $scope.panelType;
        $scope.teachInfo={
            listInfo:[],
            totalPages:0
        };
        $scope.requesParams={
            accountId:userService.userMess.accountId,
            type:'album',
            categoryId:1,
            sign:md5('ymy'+userService.userMess.accountId+'album'),
            categoryId:1,
            pageNumber:1,
            pageSize:10
        };
        $scope.getTeachHistory=function(){
            $http({
                url: urlStr + 'ym/history/list.api',
                method: 'POST',
                params: $scope.requesParams
            }).success(function (data) {
                console.log(data);
                if (data.result == 1) {
                    $scope.teachInfo.totalPages=data.totalPage;
                    $scope.teachInfo.listInfo=$scope.teachInfo.listInfo.concat(data.list);
                    $scope.teachInfo.listInfo.forEach(function (val) {
                        val.date = new Date(parseInt(val.readTime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
                    })
                }
            }).error(function () {
                //$scope.$emit('my.net.break','');
                //$scope.alertTab('网络异常,请检查网络!',$scope.netBreakBack);
            })

            //$http({
            //    url:urlStr+'ym/history/list.api',
            //    method:'POST',
            //    params:$scope.requesParams
            //}).success(function(data){
            //    console.log(data);
            //    if(data.result==1){
            //        $scope.teachInfo.totalPages=data.totalPage;
            //        $scope.teachInfo.listInfo=$scope.teachInfo.listInfo.concat(data.list);
            //    }
            //    $scope.$broadcast('scroll.infiniteScrollComplete');
            //}).error(function(){
            //    $scope.alertTab('网络异常,请检查网络!',$scope.netBreakBack);
            //})
        }

        $scope.teachChoice=function(val){
            if($scope.panelType==val){
                return;
            }
            $scope.teachInfo={
                listInfo:[],
                totalPages:0
            };
            $scope.panelType=val;
            if($scope.panelType=='sp'){
                $scope.requesParams.pageNumber=1;
                $scope.requesParams.categoryId=1;
                $scope.getTeachHistory();
            }else{
                $scope.requesParams.pageNumber=1;
                $scope.requesParams.categoryId=2;
                $scope.getTeachHistory();
            }
        }

        $scope.teachChoice('sp');

        $scope.toTeachVideo=function(val){
            $state.go('videoDetail',{rootId:1,id:val.teach.id,vsrc:val.teach.videoSrc,title:val.teach.title});
            $ionicViewSwitcher.nextDirection('forward');
        }

        $scope.toTwInfoDetail=function(val){
            $state.go('infoDetail',{rootId:1,id:val.teach.id});
            $ionicViewSwitcher.nextDirection('forward');
        }

        $scope.loadMoreDate=function(){
            $scope.requesParams.pageNumber++;
            $scope.getTeachHistory();
        }
    }])
    .controller('information',['$scope','$state','$http','$ionicViewSwitcher','userService',function($scope,$state,$http,$ionicViewSwitcher,userService){
        $scope.infoList=[];
        $http({
            url:urlStr+'ym/history/list.api',
            method:'POST',
            params:{
                accountId:userService.userMess.accountId,
                type:'news',
                sign:md5('ymy'+userService.userMess.accountId+'news')
            }
        }).success(function(data){
            if(data.result==1){
                $scope.infoList=data.list;
            }
        }).error(function(){
            $scope.alertTab('网络异常,请检查网络!',$scope.netBreakBack);
        })

        $scope.toInfoDetail=function(val){
            $state.go('infoDetail',{rootId:9,id:val.news.id});
            $ionicViewSwitcher.nextDirection('forward');
        }
    }])
