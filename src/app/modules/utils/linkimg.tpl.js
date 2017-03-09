'use strict'

//公用组件
angular.module('swalk.utils',[])
    .directive('thumbnailItem',[function(){
        return {
            restrict:'EA',
            scope:{
                image:'@',
                title:'@',
                subtitle:'@',
                canusersb:'@',
                discount:'@',
                cancle:'@',
                price:'@',
                resource:'@',
                clickEvent:'&',
                employee:'@',
                maxbuy:'@'
            },
            link:function(scope,elem,attr){
                scope.isCarusel=true;
                if(scope.image==='0'){
                    scope.isCarusel=false;
                }
                scope.isCancel=true;
                if(scope.cancle.toString()==='1'){
                    scope.isCancel=false;
                }
            },
            templateUrl:'app/modules/utils/linkimg.tpl.html'
        }
    }])
