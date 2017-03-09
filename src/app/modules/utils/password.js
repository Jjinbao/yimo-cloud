'use stict'

angular.module('swalk.password',[])
    .directive('sixPassWord',[function($document,$ionicPopup){
        return{
            restict:'AE',
            scope:{
                btnname:'@',
                model:'=',
                next:'&'
            },
            link:function(scope,elem,attr){
                var inputs=elem.find('input');
                scope.password={
                    code:''
                }
                scope.$watchCollection('password',function(val){
                    if(val.code){
                        if(val.code.toString().length===6){
                            scope.btnStyle={
                                'background-color':'orange'
                            }
                        }else{
                            scope.btnStyle={
                                'background-color':'darkgray'
                            }
                        }
                    }
                })
                scope.setFocus=function(){
                    document.getElementById('alphaInput').focus();
                }

                scope.leftObj={
                    'left':'20px'
                }
                scope.textOnfocus=function(){
                    scope.leftObj={
                        'left':'2000px'
                    }
                }

                scope.textNotfocus=function(){
                    scope.leftObj={
                        'left':'20px'
                    }
                }
                scope.toNext=function(){
                    if(scope.password.code&&scope.password.code.toString().length===6){
                        if(!/^[0-9]+$/.test(scope.password.code)){
                            scope.$emit('popup.alert','请输入6位数字支付密码');
                            return;
                        }
                        scope.model.val=scope.password.code;
                        scope.next();
                    }
                }
            },
            templateUrl:'app/modules/utils/password.tpl.html'
        }
    }])

