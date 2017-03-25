angular.module('ymy.history',[])
    .controller('historyRecord',['$scope','$state','$ionicViewSwitcher',function($scope,$state,$ionicViewSwitcher){
        $scope.$on('$ionicView.beforeEnter',function(){
            $scope.hideTabBar('hide');
        })
        $scope.toPart=function(val){
            if(val=='应用'){
                $state.go('application',{});
            }else if(val=='资讯'){
                $state.go('infoMsg',{});
            }else if(val=='教学'){
                $state.go('teaching',{});
            }
            $ionicViewSwitcher.nextDirection('forward');
        }

    }])
    .controller('application',['$scope','$state','$ionicViewSwitcher',function($scope,$state,$ionicViewSwitcher){
        console.log('展示应用列表');
    }])
    .controller('teaching',['$scope','$state','$ionicViewSwitcher',function($scope,$state,$ionicViewSwitcher){
        $scope.panelType='sp'
        $scope.teachChoice=function(val){
            if($scope.panelType==val){
                return;
            }
            $scope.panelType=val;
        }
    }])
    .controller('information',['$scope','$state','$ionicViewSwitcher',function($scope,$state,$ionicViewSwitcher){
        console.log('应用列表');
    }])
