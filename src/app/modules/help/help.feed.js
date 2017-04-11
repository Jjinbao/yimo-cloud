'use strict'

angular.module('ymy.help.feed',[])
    .controller('helpAnFeed',['$scope','$state','$ionicViewSwitcher','$http','userService',function($scope,$state,$ionicViewSwitcher,$http,userService){
        $scope.$on('$ionicView.beforeEnter',function(){
            $scope.hideTabBar('hide');
        })

        $scope.appProList=[];
        //$scope.$on('$ionicView.afterEnter',function(){
            $http({
                url:urlStr+'ym/app/list.api',
                method:'POST'
            }).success(function(data){
                console.log(data);
                $scope.appProList=data.list;
            }).error(function(){
                $scope.alertTab('网络异常,请检查网络!',$scope.netBreakBack);
            })
        //})
        $scope.feedRecord=function(){
            if(userService.userMess&&userService.userMess.accountId){
                $state.go('feedRecord',{});
                $ionicViewSwitcher.nextDirection('forward');
            }else{
                $state.go('login',{ragion:'feed'});
                $ionicViewSwitcher.nextDirection('forward');
            }
        }

        $scope.toQuestion=function(val){
            var timestamp=$scope.getTimeStamp();
            $state.go('questionList',{categoryId:val.appId,viewTitle:val.appName,timestamp:timestamp});
            $ionicViewSwitcher.nextDirection('forward');
        }
    }])
    .controller('feedBackRecord',['$scope','$state','$http','$ionicViewSwitcher','userService',function($scope,$state,$http,$ionicViewSwitcher,userService){
        $scope.toDetail=function(val){
            var timestamp=$scope.getTimeStamp();
            $state.go('feedQuestion',{ques:val,timestamp:timestamp});
            $ionicViewSwitcher.nextDirection('forward');
        }
        var reqParams={
            publisher:userService.userMess.accountId,
            sign:md5('ymy'+userService.userMess.accountId),
            pageNumber:1,
            pageSize:10
        }
        $scope.resData={
            list:[],
            totalNum:0
        };
        $http({
            url:urlStr+'ym/question/list.api',
            method:'POST',
            params:reqParams
        }).success(function(data){
            if(data.result==1){
                $scope.resData.list=data.categoryQuestionList;
                $scope.resData.totalNum=data.totalPage;
            }
        }).error(function(){
            $scope.alertTab('网络异常,请检查网络!',$scope.netBreakBack);
        })

    }])
    .controller('questionList',['$scope','$state','$stateParams','$http','$ionicViewSwitcher','userService',function($scope,$state,$stateParams,$http,$ionicViewSwitcher,userService){
        //if($stateParams.categoryId==1001){
        //    $scope.viewTitle='云平台';
        //}else if($stateParams.categoryId==1002){
        //    $scope.viewTitle='艾德产品';
        //}else{
        //    $scope.viewTitle='复苏小龙';
        //}
        $scope.viewTitle=$state.params.viewTitle;
        $scope.reqDate={
            appId:$stateParams.categoryId,
            sign:md5('ymy'+$stateParams.categoryId),
            pageNumber:1,
            pageSize:10
        }
        $scope.resData={
            totalPage:0,
            list:[]
        }
        requestDate();
        function requestDate(){
            $http({
                url:urlStr+'ym/question2/list.api',
                method:'POST',
                params:$scope.reqDate
            }).success(function(data){
                if(data.result==1){
                    $scope.resData.totalPage=data.totalPage;
                    $scope.resData.list=data.categoryQuestionList;
                }else{
                    $scope.alertTab('参数错误');
                }
            }).error(function(){
                $scope.alertTab('网络异常,请检查网络!',$scope.netBreakBack);
            })
        }
        $scope.toQuestionDetail=function(val){
            $state.go('commonQuestion',{question:val});
            $ionicViewSwitcher.nextDirection('forward');
        }
        $scope.feedQuestion=function(){
            if(userService.userMess&&userService.userMess.accountId){
                $state.go('toFeedQuestion',{cid:$stateParams.categoryId,group:$scope.viewTitle});
                $ionicViewSwitcher.nextDirection('forward');
            }else{
                $state.go('login',{ragion:'feed'});
                $ionicViewSwitcher.nextDirection('forward');
            }
        }
        $scope.loadMoreData=function(){

        }
    }])
    .controller('commonQuestion',['$scope','$state',function($scope,$state){
        $scope.question=$state.params.question;
        $scope.viewTitle=$scope.question.groupName;
    }])
    .controller('feedDetail',['$scope','$state',function($scope,$state){
        $scope.askQuestion=$state.params.ques;
    }])

    .controller('toFeedQues',['$scope','$stateParams','$http','userService',function($scope,$stateParams,$http,userService){
        $scope.stage=$stateParams.group;

        $scope.feedInfo={
            contact:'',
            question:''
        }
        $scope.feed=function(){
            if(!$scope.feedInfo.contact){
                $scope.alertTab('请填写常用联系方式');
                return;
            }

            if(!$scope.feedInfo.question){
                $scope.alertTab('请填写反馈问题');
                return;
            }

            $http({
                url:urlStr+'ym/question/add.api',
                method:'POST',
                params:{
                    publisher:userService.userMess.accountId,
                    appId:$stateParams.cid,
                    extstr1:encodeURI($scope.feedInfo.contact),
                    question:encodeURI($scope.feedInfo.question),
                    sign:md5('ymy'+$stateParams.cid+$scope.feedInfo.contact+userService.userMess.accountId+$scope.feedInfo.question)
                }
            }).success(function(data){
                if(data.result==1){
                    $scope.alertTab('反馈成功,请等待客服处理');
                    $scope._goback(-1);
                }else{
                    $scope.alertTab('反馈失败');
                }
            }).error(function(){
                $scope.alertTab('网络异常,请检查网络!');
            })

        }
    }])

