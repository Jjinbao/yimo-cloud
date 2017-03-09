'use strict'
angular.module('swalk.stayremark', [])
    .controller('stayRemark', ['$rootScope','$scope', function ($rootScope,$scope) {
        $scope.remark={
            msg:''
        }
        if($rootScope.remark){
            $scope.remark.msg=$rootScope.remark;
        }

        $scope.saveAndBack=function(){
            $rootScope.remark=$scope.remark.msg;
            $scope._goback(-1);
        }

        $scope.$watchCollection('remark',function(val){
            if(val&&val.msg){
                if(val.msg.length>50){
                    val.msg=val.msg.substr(0,50);
                }
            }
        })

    }])
    .directive('textareaAuto', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                //判断是否是    TEXTAREA
                if ("TEXTAREA" == element[0].nodeName && attr.textareaAuto) {
                    //自适应高度
                    $(element).autoTextarea()
                }
            }
        };
    });