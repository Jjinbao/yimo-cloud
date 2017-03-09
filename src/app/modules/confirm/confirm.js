'use strict'

angular.module('swalk.confirm', [])
    .controller('confirm', ['$rootScope','$scope', '$state','$stateParams','$ionicHistory', '$ionicViewSwitcher','userService',
        function ($rootScope,$scope, $state,$stateParams,$ionicHistory,$ionicViewSwitcher,userService) {
            $scope.newPwd={};
            $scope.finish = function () {
                if($scope.newPwd.val!=userService.newPwdValue){
                    $scope.alertTab('两次输入的密码不一致');
                }else{
                    if($stateParams.memery==='remember'){
                        userService.changePayPwdOld(userService.userMess.userId,$scope.newPwd.val,userService.oldPwdValue)
                            .then(
                            function(data){
                                if(data.list.errcode!=10000){
                                    $scope.alertTab(data.list.message);
                                }else{
                                    $scope.alertTab('密码修改成功',$scope.lastBack);
                                }
                            },
                            function(error){

                            }
                        )

                    }else if($stateParams.memery==='forget'){
                        userService.changePayPwdCode(userService.userMess.userId,$scope.newPwd.val,userService.userMess.phone,userService.massageCode)
                            .then(
                            function(data){
                                if(data.list.errcode!=10000){
                                    $scope.alertTab(data.list.message);
                                }else{
                                    $scope.alertTab('密码修改成功',$scope.lastBack);
                                }
                            },
                            function(error){

                            }
                        )
                    }

                }
            }
            $scope.lastBack=function(){
                if($rootScope.modifyPassword){
                    if($rootScope.modifyPassword=='scan-pay'){
                        $rootScope.modifyPassword='';
                        $state.go('tabs.home',{});
                        $ionicViewSwitcher.nextDirection('back');
                    }else if($rootScope.modifyPassword=='rsb-give'){
                        $rootScope.modifyPassword='';
                        $state.go('rsb',{type:'rsb-buy'});
                        $ionicViewSwitcher.nextDirection('back');
                    }else if($rootScope.modifyPassword=='never-modity'){
                        $rootScope.modifyPassword='';
                        connectWebViewJavascriptBridge(function (bridge) {
                            bridge.callHandler('closeModifyPage', null, function (res) {

                            });
                        });
                    }
                }else{
                    $ionicHistory.goBack(-4);
                }
            }
        }])