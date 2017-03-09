'use strict'
angular.module('swalk.dropList', [])
    .directive('dropList',[function(){
        return{
            restrict:'AE',
            scope:{
                items:'@',
                choices:'=',
                initdata:'='
            },
            link:function(scope,elem,attr){
                scope.info=JSON.parse(scope.items);
                scope.clickResult=function(val){
                    var valObj={
                        type:scope.choices,
                        value:val
                    }
                    scope.$emit('change.filter.condition',valObj);
                }

            },
            templateUrl:'app/modules/utils/droplist.tpl.html'
        }
    }])