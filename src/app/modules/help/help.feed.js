'use strict'

angular.module('ymy.help.feed',[])
    .controller('helpAnFeed',['$scope','$state','$ionicViewSwitcher','userService',function($scope,$state,$ionicViewSwitcher,userService){
        $scope.feedRecord=function(){
            if(userService.userMess&&userService.userMess.accountId){
                $state.go('feedRecord',{});
                $ionicViewSwitcher.nextDirection('forward');
            }else{
                $state.go('login',{});
                $ionicViewSwitcher.nextDirection('forward');
            }
        }

        $scope.toQuestion=function(val){
            $state.go('questionList',{categoryId:val});
            $ionicViewSwitcher.nextDirection('forward');
        }
    }])
    .controller('feedBackRecord',['$scope','$state','$ionicViewSwitcher',function($scope,$state,$ionicViewSwitcher){
        $scope.toDetail=function(){
            $state.go('feedQuestion',{});
            $ionicViewSwitcher.nextDirection('forward');
        }
    }])
    .controller('questionList',['$scope','$state','$stateParams','$http','$ionicViewSwitcher',function($scope,$state,$stateParams,$http,$ionicViewSwitcher){
        if($stateParams.categoryId==71){
            $scope.viewTitle='云平台';
        }else if($stateParams.categoryId==72){
            $scope.viewTitle='艾德产品';
        }else{
            $scope.viewTitle='复苏小龙';
        }
        $scope.reqDate={
            categoryId:$stateParams.categoryId,
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
                url:'ym/question2/list.api',
                method:'POST',
                params:$scope.reqDate
            }).success(function(data){
                console.log(data);
                if(data.result==1){
                    $scope.resData.totalPage=data.totalPage;
                    $scope.resData.list=data.categoryQuestionList;
                }else{
                    $scope.alertTab('数据返回错误');
                }
            })
        }
        $scope.toQuestionDetail=function(val){
            $state.go('commonQuestion',{question:val});
            $ionicViewSwitcher.nextDirection('forward');
        }
        $scope.loadMoreData=function(){

        }
    }])
    .controller('commonQuestion',['$scope','$state',function($scope,$state){
        $scope.question=$state.params.question;
        $scope.viewTitle=$scope.question.groupName;
    }])
    .controller('feedDetail',['$scope','$state',function($scope,$state){
        console.log('-------------------');
    }])

