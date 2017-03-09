'use strict'

angular.module('swalk.store',[])
    .controller('mineStore',['$scope','$state','$ionicViewSwitcher','$ionicScrollDelegate','userService',function($scope,$state,$ionicViewSwitcher,$ionicScrollDelegate,userService){
        $scope.listType=0;//0-住宿  1-旅游
        $scope.storeList=[];
        $scope.showLoading=true;

        $scope.requestParams={
            userId:userService.userMess.userId,
            pageNum:1,
            pageSize:5,
            download:true
        }
        //获取收藏列表
        $scope.$on('$ionicView.afterEnter',function(){
            getStoreList();
        })
        function getStoreList(){
            $scope.storeList==[];
            if($scope.listType===1){
                userService.travelCollect(userService.userMess.userId,$scope.requestParams.pageNum,$scope.requestParams.pageSize).then(function(data){
                    console.log(data);
                    if(data.list.errcode!=10000){
                        $scope.alertTab(data.list.message);
                    }else{
                        if(data.list.data.length!=0){
                            $scope.storeList=$scope.storeList.concat(data.list.data);
                            console.log($scope.storeList);
                        }else{
                            $scope.requestParams.download=false;
                        }
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.showLoading=false;
                })
            }else{
                userService.stayCollect($scope.requestParams.userId,$scope.requestParams.pageNum,$scope.requestParams.pageSize).then(function(data){
                    if(data.list.errcode!=10000){
                        $scope.alertTab(data.list.message);
                    }else{
                        console.log('----------------');
                        console.log(data);
                        if(data.list.data){
                            $scope.storeList=$scope.storeList.concat(data.list.data);
                            console.log($scope.storeList);
                        }else{
                            $scope.requestParams.download=false;
                        }
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.showLoading=false;
                })
            }
        }

        $scope.toProDetail=function(pid){
            if($scope.listType==0){
                $state.go('stayDetail',{pid:pid});
                $ionicViewSwitcher.nextDirection('forward');
            }else{
                $state.go('travelDetail', {pid: pid});
                $ionicViewSwitcher.nextDirection('forward');
            }

        }

        $scope.doRemoveCollect=function(pid){
            userService.removeCollect(userService.userMess.userId,pid,$scope.listType).then(function(data){
                if(data.list.errcode===10000){
                    $scope.alertTab('取消收藏成功');
                    console.log(pid);
                    console.log($scope.storeList);
                    for(var i=0;i<$scope.storeList.length;i++){
                        if(pid==$scope.storeList[i].id){
                            $scope.storeList.remove(i);
                            break;
                        }
                    }
                }else{
                    $scope.alertTab(data.list.message);
                }
            })
        }

        $scope.goback=function(){
            $scope._goback(-1);
        }

        $scope.changeList=function(){
            $ionicScrollDelegate.scrollTop(true);
            if($scope.listType==0){
                $scope.listType=1;
            }else{
                $scope.listType=0;
            }
            $scope.showLoading=true;

            $scope.storeList=[];
            $scope.requestParams={
                userId:userService.userMess.userId,
                pageNum:1,
                pageSize:5,
                download:true
            }

            getStoreList();
        }

        $scope.loadMoreData=function(){
            $scope.requestParams.pageNum++;
            getStoreList();
        }
    }])
