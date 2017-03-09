'use strict'
/*var userInfoApp={
    userId:'14490',
    token:'app_token_63420871-bd80-4183-9e5e-ed59490e284b'
};*/
var userInfoApp={
    phone:'',
    password:''
};

function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function () {
            callback(WebViewJavascriptBridge)
        }, false)
    }
}
connectWebViewJavascriptBridge(function (bridge) {
    bridge.init(function (message, responseCallback) {
        var data = {'Javascript Responds': 'Wee!'};
        responseCallback(data);
    });
    bridge.registerHandler('getUserInfo', function (response) {
        if(response.device=='0'){
            var body = document.querySelector('body');
            var bodyClass = body.getAttribute('class');
            body.setAttribute('class', bodyClass + ' app');
        }
        window.localStorage.setItem('nowDevice',response.device);
        userInfoApp.phone = response.phone;
        userInfoApp.password = response.password;
        //angular.bootstrap(document,['app']);//手动启动angularjs
    })
});

var deviceId=localStorage.getItem('nowDevice');
var timeDao=10;
var intervalId=setInterval(function(){
    deviceId=localStorage.getItem('nowDevice');
    if(deviceId&&deviceId=='0'){
        var body = document.querySelector('body');
        var bodyClass = body.getAttribute('class');
        body.setAttribute('class', bodyClass + ' app');
        clearInterval(intervalId);
    }else{
        timeDao--;
        if(timeDao<=0){
            clearInterval(intervalId);
        }
    }
},350);
//获取当天的日期yy-MM-dd
function getTodayDate(){
    var nowDate=new Date();
    var todayYear=(nowDate.getFullYear()).toString();
    var todayMonth=(parseInt(nowDate.getMonth())+1)>9?(parseInt(nowDate.getMonth())+1):('0'+(parseInt(nowDate.getMonth())+1));
    var todayDate=(nowDate.getDate()>9?(nowDate.getDate()):('0'+nowDate.getDate()));
    var today=todayYear+'-'+todayMonth+'-'+todayDate;
    return today;
}

//获取两个日期间隔，相差几个晚上
function getDays(strDateStart,strDateEnd){
    var strSeparator = "-"; //日期分隔符
    var oDate1;
    var oDate2;
    var iDays;
    oDate1= strDateStart.split(strSeparator);
    oDate2= strDateEnd.split(strSeparator);
    var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]);
    var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]);
    iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24)//把相差的毫秒数转换为天数
    return iDays ;
}

//比较两个日期谁更靠后
function compareLastDate(date1,date2){
    var d1=new Date(date1);
    var d2=new Date(date2);
    var result=0;
    if(d1.getTime()>d2.getTime()){
        result=1;
    }
    return result;
}

//获取当前日期的后一天
function getNextDay(d){
    d = new Date(d);
    d = +d + 1000*60*60*24;
    d = new Date(d);
    //return d;
    //格式化
    return d.getFullYear()+"-"+((d.getMonth()+1)>9?(d.getMonth()+1):('0'+(d.getMonth()+1)))+"-"+(d.getDate()>9?(d.getDate()):('0'+(d.getDate())));

}
//数组移除指定元素
Array.prototype.remove=function(obj){
    for(var i =0;i <this.length;i++){
        var temp = this[i];
        if(!isNaN(obj)){
            temp=i;
        }
        if(temp == obj){
            for(var j = i;j <this.length;j++){
                this[j]=this[j+1];
            }
            this.length = this.length-1;
        }
    }
}

angular.module('app', ['ionic','angular-carousel', 'swalk.route', 'swalk.services', 'tab.home', 'tab.stay', 'tab.holiday', 'tab.mine',
    'swalk.utils', 'swalk.stay.detail', 'swalk.travel.detail', 'swalk.items', 'swalk.login', 'swalk.dropList',
    'swalk.fillorder', 'swalk.choice.contact', 'swalk.add.contact','swalk.pay','swalk.changetype',
    'swalk.identity','swalk.password','swalk.reset','swalk.confirm','swalk.goods','swalk.myrsb','swalk.goods.item','swalk.payment',
    'swalk.rsbexplain','swalk.buyrsb','swalk.linkman','swalk.resetpass','swalk.stay.detail','swalk.map','swalk.rsbgift','swalk.suregift','swalk.rsbgift',
    'swalk.suregift','swalk.coupon','swalk.staylist','swalk.city','swalk.serviceADevice','rzModule','swalk.stayorder','swalk.stayremark',
    'swalk.asset','swalk.store','swalk.userinfo','swalk.setting','swalk.changeloginword','swalk.images','chart.js','swalk.about'])
    .config(['$ionicConfigProvider', function ($ionicConfigProvider) {
        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('bottom');
        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('center');
        $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('android');
    }])
    .run(function () {
        //激活波纹效果
        Waves.init();
    })
    /*所有控制器的父控制器*/
    .controller('rooCtrl', ['$rootScope','$scope', '$ionicHistory','$ionicViewSwitcher', '$ionicPopup', '$timeout','userService','$location','$state','$interval',
        function ($rootScope,$scope, $ionicHistory,$ionicViewSwitcher,$ionicPopup, $timeout,userService,$location,$state,$interval) {
            //用户点击返回按钮要不要显示退出弹窗

            var canShowWindow=true;
            $scope.confirmQuit=function(){
                var confirmPopup = $ionicPopup.confirm({
                    title: '退出应用',
                    template: '你确定你要退出盛行天下?',
                    buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
                        text: '取消',
                        type: 'button-default',
                        onTap:function(e){
                            canShowWindow=true;
                        }
                    }, {
                        text: '确定',
                        type: 'alert-button-sure',
                        onTap:function(e){

                            connectWebViewJavascriptBridge(function (bridge) {
                                //回app
                                bridge.callHandler('closeSwalk', null, function (response) {
                                    console.log(response);
                                })
                            });
                        }
                    }]
                });

                /*confirmPopup.then(function(res) {
                    if(res) {
                        console.log('关闭app');
                        connectWebViewJavascriptBridge(function (bridge) {
                            //回app
                            bridge.callHandler('closeSwalk', null, function (response) {
                                console.log(response);
                            })
                        });
                    } else {
                        console.log('You are not sure');
                    }
                });*/
            }
            $rootScope.$state = $state;
            $rootScope.appType = appType;
            var deviceIntervalId=$interval(function(){
                $rootScope.deviceId=localStorage.getItem('nowDevice');
                if($rootScope.deviceId){
                    $interval.cancel(deviceIntervalId);
                }
            },350,10)
            //$rootScope.deviceId=deviceId;
            //通过appType来判断如何执行代码
            if(appType==0){
                //这特么是获取微信openId
                $scope.userCode=$location.url().substring($location.url().indexOf('=')+1,$location.url().indexOf('&'));
                var requestParams={"code":$scope.userCode,"payUrl":'http://wxtest.sxtx.4zlink.com/#/pay/payorder'};
                //获取缓存中用户信息，用来自动登录
                var userInfo=localStorage.getItem('userInfo');
                if(userInfo){
                    var usermsg=eval('(' + userInfo + ')');
                    if(new Date().getTime()-usermsg.timestamp>=86400000){
                        localStorage.clear();
                    }else{
                        userService.userMess=usermsg;
                    }
                }
                var userContact=localStorage.getItem('contact');
                if(userContact){
                    userService.userContact=eval('(' + userContact + ')');
                }
                //请求统一下单接口，获取openId
                userService.uniformOrder(requestParams).then(function(data){
                    if(data.list.errcode===10000){
                        userService.userOpenId=data.list.data;
                    }
                })
            }else if(appType==1){
                var intervalId=$interval(function(){
                    if(userInfoApp.phone){
                        $interval.cancel(intervalId);
                        if(userInfoApp.password){
                            userService.passwordLogin(userInfoApp.phone,userInfoApp.password).then(function(data){
                                if(data.list.errcode==10000){
                                    angular.copy(data.list.data,userService.userMess);
                                    data.list.data.password=userInfoApp.password;
                                    connectWebViewJavascriptBridge(function (bridge) {
                                        //回app
                                        bridge.callHandler('userMessage', data.list.data, function (response) {
                                            console.log(response);
                                        })
                                    });
                                }else{
                                    console.log('自动登录失败');
                                    userService.userMess={};
                                }
                            })
                        }else{
                            userService.userMess={};
                        }
                    }
                },350,10);
            }

            $scope.alertTab = function (val,callBack) {
                var myPop = $ionicPopup.alert({
                    title: val,
                    buttons: []
                });
                var timeId = $timeout(function () {
                    $timeout.cancel(timeId);
                    myPop.close(); //由于某种原因1.5秒后关闭弹出
                    if(callBack){
                        callBack();
                    }
                }, 1500);
            }
            //通过向上传递来弹出提示窗口
            $scope.$on('popup.alert',function(evt,val){
                $scope.alertTab(val);
            })

            $scope._goback = function(val){
                $ionicHistory.goBack(val);
                $ionicViewSwitcher.nextDirection('back');

            };

            //用户没有登录，跳转到登录界面
            $rootScope.$on('swalk.no.login',function(evt,val){
                userService.userMess={};
                $state.go('login',{code:'timeout'});
                $ionicViewSwitcher.nextDirection('forward');
            })

            Number.prototype.toFixed=function (d) {
                var s = this + "";
                if (!d)d = 0;
                if (s.indexOf(".") == -1)s += ".";
                s += new Array(d + 1).join("0");
                if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
                    var s = "0" + RegExp.$2, pm = RegExp.$1, a = RegExp.$3.length, b = true;
                    if (a == d + 2) {
                        a = s.match(/\d/g);
                        if (parseInt(a[a.length - 1]) > 4) {
                            for (var i = a.length - 2; i >= 0; i--) {
                                a[i] = parseInt(a[i]) + 1;
                                if (a[i] == 10) {
                                    a[i] = 0;
                                    b = i != 1;
                                } else break;
                            }
                        }
                        s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");
                    }
                    if (b)s = s.substr(1);
                    return (pm + s).replace(/\.$/, "");
                }
                return this + "";

            };

            Date.prototype.format = function(format) {
                var o = {
                    "M+": this.getMonth() + 1,
                    "d+": this.getDate(),
                    "h+": this.getHours(),
                    "m+": this.getMinutes(),
                    "s+": this.getSeconds(),
                    "q+": Math.floor((this.getMonth() + 3) / 3),
                    "S": this.getMilliseconds()
                }
                if (/(y+)/.test(format)) {
                    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                }
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                    }
                }
                return format;
            }
            //处理安卓返回按钮
            connectWebViewJavascriptBridge(function (bridge) {
                bridge.registerHandler('onBack', function (response) {
                    var stateId=$ionicHistory.currentView().stateId;
                    if((stateId.indexOf('tabs.mine')>=0)||(stateId.indexOf('tabs.home')>=0)||(stateId.indexOf('tabs.stay')>=0)||(stateId.indexOf('tabs.holiday')>=0)){
                        if(canShowWindow){
                            canShowWindow=false;
                            $scope.confirmQuit();
                        }
                    }else if((stateId.indexOf('fillorder')>=0)||stateId.indexOf('stayOrder')>=0){
                        //在订单填写页面广播事件
                        $scope.$broadcast('android.mac.backbtn','');
                    }else if(stateId.indexOf('payresult')>=0){
                        var backUrl=$location.url();
                        if(backUrl.indexOf('scan-pay')>=0){
                            $state.go('tabs.home');
                        }else if(backUrl.indexOf('pay-pro')>=0){
                            $state.go('goods',{from:'payresult'});
                        }else if(backUrl.indexOf('rsb-buy')>=0){
                            $state.go('rsb',{type:'rsb-buy'});
                        }else{
                            $state.go('tabs.mine');
                        }
                        $ionicViewSwitcher.nextDirection('back');
                    }else if(stateId.indexOf('giftresult')>=0){
                        $state.go('rsb',{type:'rsb-buy'});
                    }else if(stateId.indexOf('couponChoice')>=0){
                        $scope.$broadcast('android.choicecoupon.backbtn','');
                    }else if((stateId.indexOf('identity')>=0)&&($location.url().indexOf('change/identity/forget/app')>=0)){
                        $scope.$broadcast('android.modifypassword.backbtn','');
                    }else{
                        $ionicHistory.goBack();
                        $ionicViewSwitcher.nextDirection('back');
                    }
                })
            });

            //处理用户支付结果函数
            connectWebViewJavascriptBridge(function (bridge) {
                bridge.registerHandler('payResult', function (response) {
                    $state.go('payresult', {status: response.code,type:response.type});
                })
            });
            //入住日期和离开日期
            $rootScope.appStay={
                stayIn:'',
                stayOut:''
            }
            //度假出游日期的选择
            $rootScope.travelParams={
                date:'',
                dateId:'',
                price:''
            }
            //获取当前日期
            var dd=new Date();
            $rootScope.appStay.stayIn=dd.getFullYear()+'-'+((dd.getMonth()+1)>9?(dd.getMonth()+1):('0'+(dd.getMonth()+1)))+'-'+(dd.getDate()>9?dd.getDate():'0'+dd.getDate());
            var dd2=new Date(dd);
            dd2.setDate(dd.getDate()+1);
            $rootScope.appStay.stayOut=dd2.getFullYear()+'-'+((dd2.getMonth()+1)>9?(dd2.getMonth()+1):('0'+(dd2.getMonth()+1)))+'-'+(dd2.getDate()>9?dd2.getDate():'0'+dd2.getDate());

            //记录从哪里进入修改支付密码界面
            $rootScope.modifyPassword='';


        }])
    //session拦截器
    .factory("sessionInjector", ['$rootScope','$q',function ($rootScope,$q) {
        return {
            request:function(config){
                return config;
            },
            response:function(response){
                if(response.data.errcode==50001&&response.config.method=='POST'){
                    $rootScope.$emit('swalk.no.login','noLogin');
                }
                return response;
            }
        }
    }])
    //把拦截器加入到$httpProvider.interceptors数组中
    .config(function($httpProvider){
        $httpProvider.interceptors.push('sessionInjector');
    })
    //隐藏底部导航栏
    .directive('hideTabs', function ($rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {
                scope.$on('$ionicView.beforeEnter', function () {
                    scope.$watch(attributes.hideTabs, function (value) {
                        $rootScope.hideTabs = value;
                    });
                });

                scope.$on('$ionicView.beforeLeave', function () {
                    $rootScope.hideTabs = false;
                });
            }
        };
    });
!function(t){"use strict";"function"==typeof define&&define.amd?define(["angular","chart.js"],t):"object"==typeof exports?module.exports=t(require("angular"),require("chart.js")):t(angular,Chart)}(function(t,e){"use strict";function n(){var n={},r={Chart:e,getOptions:function(e){var r=e&&n[e]||{};return t.extend({},n,r)}};this.setOptions=function(e,r){return r?(n[e]=t.extend(n[e]||{},r),void 0):(r=e,n=t.extend(n,r),void 0)},this.$get=function(){return r}}function r(n){function r(t,e){return t&&e&&t.length&&e.length?Array.isArray(t[0])?t.length===e.length&&t[0].length===e[0].length:e.reduce(a,0)>0?t.length===e.length:!1:!1}function a(t,e){return t+e}function o(e,r,a){if(r.data&&r.data.length){r.getColour="function"==typeof r.getColour?r.getColour:l,r.colours=c(e,r);var o=a[0],u=o.getContext("2d"),s=Array.isArray(r.data[0])?g(r.labels,r.data,r.series||[],r.colours):p(r.labels,r.data,r.colours),f=t.extend({},n.getOptions(e),r.options),h=new n.Chart(u)[e](s,f);return r.$emit("create",h),["hover","click"].forEach(function(t){r[t]&&(o["click"===t?"onclick":"onmousemove"]=i(r,h,t))}),r.legend&&"false"!==r.legend&&v(a,h),h}}function i(t,e,n){return function(r){var a=e.getPointsAtEvent||e.getBarsAtEvent||e.getSegmentsAtEvent;if(a){var o=a.call(e,r);t[n](o,r),t.$apply()}}}function c(r,a){for(var o=t.copy(a.colours||n.getOptions(r).colours||e.defaults.global.colours);o.length<a.data.length;)o.push(a.getColour());return o.map(u)}function u(t){return"object"==typeof t&&null!==t?t:"string"==typeof t&&"#"===t[0]?s(d(t.substr(1))):l()}function l(){var t=[f(0,255),f(0,255),f(0,255)];return s(t)}function s(t){return{fillColor:h(t,.2),strokeColor:h(t,1),pointColor:h(t,1),pointStrokeColor:"#fff",pointHighlightFill:"#fff",pointHighlightStroke:h(t,.8)}}function f(t,e){return Math.floor(Math.random()*(e-t+1))+t}function h(t,e){return"rgba("+t.concat(e).join(",")+")"}function d(t){var e=parseInt(t,16),n=e>>16&255,r=e>>8&255,a=255&e;return[n,r,a]}function g(e,n,r,a){return{labels:e,datasets:n.map(function(e,n){var o=t.copy(a[n]);return o.label=r[n],o.data=e,o})}}function p(t,e,n){return t.map(function(t,r){return{label:t,value:e[r],color:n[r].strokeColor,highlight:n[r].pointHighlightStroke}})}function v(t,e){var n=t.parent(),r=n.find("chart-legend"),a="<chart-legend>"+e.generateLegend()+"</chart-legend>";r.length?r.replaceWith(a):n.append(a)}function y(t,e,n){Array.isArray(n.data[0])?t.datasets.forEach(function(t,n){(t.points||t.bars).forEach(function(t,r){t.value=e[n][r]})}):t.segments.forEach(function(t,n){t.value=e[n]}),t.update(),n.$emit("update",t)}function C(t){return!t||Array.isArray(t)&&!t.length||"object"==typeof t&&!Object.keys(t).length}return function(e){return{restrict:"CA",scope:{data:"=",labels:"=",options:"=",series:"=",colours:"=?",getColour:"=?",chartType:"=",legend:"@",click:"=",hover:"="},link:function(n,a){function i(r,i){if(!C(r)&&!t.equals(r,i)){var u=e||n.chartType;u&&(c&&c.destroy(),c=o(u,n,a))}}var c,u=document.createElement("div");u.className="chart-container",a.replaceWith(u),u.appendChild(a[0]),"object"==typeof window.G_vmlCanvasManager&&null!==window.G_vmlCanvasManager&&"function"==typeof window.G_vmlCanvasManager.initElement&&window.G_vmlCanvasManager.initElement(a[0]),n.$watch("data",function(t,i){if(t&&t.length&&(!Array.isArray(t[0])||t[0].length)){var u=e||n.chartType;if(u){if(c){if(r(t,i))return y(c,t,n);c.destroy()}c=o(u,n,a)}}},!0),n.$watch("series",i,!0),n.$watch("labels",i,!0),n.$watch("options",i,!0),n.$watch("colours",i,!0),n.$watch("chartType",function(e,r){C(e)||t.equals(e,r)||(c&&c.destroy(),c=o(e,n,a))}),n.$on("$destroy",function(){c&&c.destroy()})}}}}e.defaults.global.responsive=!0,e.defaults.global.multiTooltipTemplate="<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>",e.defaults.global.colours=["#97BBCD","#DCDCDC","#F7464A","#46BFBD","#FDB45C","#949FB1","#4D5360"],t.module("chart.js",[]).provider("ChartJs",n).factory("ChartJsFactory",["ChartJs",r]).directive("chartBase",["ChartJsFactory",function(t){return new t}]).directive("chartLine",["ChartJsFactory",function(t){return new t("Line")}]).directive("chartBar",["ChartJsFactory",function(t){return new t("Bar")}]).directive("chartRadar",["ChartJsFactory",function(t){return new t("Radar")}]).directive("chartDoughnut",["ChartJsFactory",function(t){return new t("Doughnut")}]).directive("chartPie",["ChartJsFactory",function(t){return new t("Pie")}]).directive("chartPolarArea",["ChartJsFactory",function(t){return new t("PolarArea")}])});
//# sourceMappingURL=angular-chart.min.js.map