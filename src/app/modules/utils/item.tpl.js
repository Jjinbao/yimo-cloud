'use strict'

angular.module('swalk.items',[])
    .directive('listItem',[function(){
        return{
            restrict:'AE',
            scope:{
                icon:'@',
                title:'@'
            },
            link:function(scope,elem,attr){

            },
            templateUrl:'app/modules/utils/item.tpl.html'
        }
    }])
