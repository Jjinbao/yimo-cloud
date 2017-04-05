'use strict'
/*var userInfoApp={
 userId:'14490',
 token:'app_token_63420871-bd80-4183-9e5e-ed59490e284b'
 };*/
var userInfoApp = {
    phone: '',
    password: ''
};
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
function connectWebViewJavascriptBridge(callback) {
    if(isAndroid){
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge);
            return;
        }else {
            document.addEventListener('WebViewJavascriptBridgeReady', function () {
                callback(WebViewJavascriptBridge)
            }, false)
            return;
        }
    }else{
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge);
            return;
        }
    }

    if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe)
    }, 0)
}
connectWebViewJavascriptBridge(function (bridge) {
    if(isAndroid){
        bridge.init(function (message, responseCallback) {
            var data = {'Javascript Responds': 'Wee!'};
            responseCallback(data);
        });
    }

    //bridge.registerHandler('getUserInfo', function (response) {
    //    if (response.device == '0') {
    //        var body = document.querySelector('body');
    //        var bodyClass = body.getAttribute('class');
    //        body.setAttribute('class', bodyClass + ' app');
    //    }
    //    window.localStorage.setItem('nowDevice', response.device);
    //    userInfoApp.phone = response.phone;
    //    userInfoApp.password = response.password;
    //    angular.bootstrap(document,['app']);//手动启动angularjs
    //})
});

var deviceId = localStorage.getItem('nowDevice');
var timeDao = 10;
var intervalId = setInterval(function () {
    deviceId = localStorage.getItem('nowDevice');
    if (deviceId && deviceId == '0') {
        var body = document.querySelector('body');
        var bodyClass = body.getAttribute('class');
        body.setAttribute('class', bodyClass + ' app');
        clearInterval(intervalId);
    } else {
        timeDao--;
        if (timeDao <= 0) {
            clearInterval(intervalId);
        }
    }
}, 350);
//获取当天的日期yy-MM-dd
function getTodayDate() {
    var nowDate = new Date();
    var todayYear = (nowDate.getFullYear()).toString();
    var todayMonth = (parseInt(nowDate.getMonth()) + 1) > 9 ? (parseInt(nowDate.getMonth()) + 1) : ('0' + (parseInt(nowDate.getMonth()) + 1));
    var todayDate = (nowDate.getDate() > 9 ? (nowDate.getDate()) : ('0' + nowDate.getDate()));
    var today = todayYear + '-' + todayMonth + '-' + todayDate;
    return today;
}

//获取两个日期间隔，相差几个晚上
function getDays(strDateStart, strDateEnd) {
    var strSeparator = "-"; //日期分隔符
    var oDate1;
    var oDate2;
    var iDays;
    oDate1 = strDateStart.split(strSeparator);
    oDate2 = strDateEnd.split(strSeparator);
    var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
    var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
    iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24)//把相差的毫秒数转换为天数
    return iDays;
}

//数组移除指定元素
Array.prototype.remove = function (obj) {
    for (var i = 0; i < this.length; i++) {
        var temp = this[i];
        if (!isNaN(obj)) {
            temp = i;
        }
        if (temp == obj) {
            for (var j = i; j < this.length; j++) {
                this[j] = this[j + 1];
            }
            this.length = this.length - 1;
        }
    }
}

angular.module('app', ['ionic', 'angular-carousel', 'swalk.route', 'swalk.services', 'tab.home', 'tab.stay', 'tab.holiday', 'tab.mine',
    'swalk.login', 'ymy.register', 'ymy.help.feed', 'ymy.history', 'swalk.userinfo', 'swalk.setting', 'ymy.detail', 'swalk.about'])
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
    .controller('rooCtrl', ['$rootScope', '$scope', '$ionicHistory', '$ionicViewSwitcher', '$ionicPopup', '$timeout', 'userService', '$location', '$state', '$interval',
        function ($rootScope, $scope, $ionicHistory, $ionicViewSwitcher, $ionicPopup, $timeout, userService, $location, $state, $interval) {
            //用户点击返回按钮要不要显示退出弹窗
            var canShowWindow = true;
            $scope.confirmQuit = function () {
                var confirmPopup = $ionicPopup.confirm({
                    title: '退出应用',
                    template: '你确定你要退出盛行天下?',
                    buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
                        text: '取消',
                        type: 'button-default',
                        onTap: function (e) {
                            canShowWindow = true;
                        }
                    }, {
                        text: '确定',
                        type: 'alert-button-sure',
                        onTap: function (e) {

                            connectWebViewJavascriptBridge(function (bridge) {
                                //回app
                                bridge.callHandler('closeSwalk', null, function (response) {

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

            $scope.showModelBackground = false;
            //显示模式化窗口
            $scope.indexShowModelBackground = function () {
                $scope.showModelBackground = true;
            }

            //显示，隐藏模式化窗口
            $scope.toHideModelBack = function (val) {
                $scope.indexPortraitPanel = $scope.showindexLoginPanel = $scope.showModelBackground = false;
            }

            $scope.showindexLoginPanel = false;
            //显示登录弹窗
            $scope.showLoginPanel = function () {
                $scope.showindexLoginPanel = true;
            }

            //隐藏登录弹窗
            $scope.hideLoginPanel = function () {
                $scope.showindexLoginPanel = false;
            }
            //隐藏所有弹窗
            $scope.hideAllPanel = function () {
                $scope.showModelBackground = false;
                $scope.showindexLoginPanel = false;
                $scope.indexPortraitPanel = false;
            }

            //显示头像选择弹窗
            $scope.indexPortraitPanel = false;
            $scope.indexShowPortrait = function () {
                $scope.indexPortraitPanel = true;
            }

            //隐藏头像选择弹窗
            $scope.indexHidePortrait = function () {
                $scope.indexPortraitPanel = false;
            }

            $scope.modifyPortrait = function (val) {

                var data = {
                    type: val
                }
                connectWebViewJavascriptBridge(function (bridge) {
                    console.log('--------------111111111-----------------');
                    //回app
                    bridge.callHandler('modifyAvatar', data, function (response) {
                    })
                });
                $scope.hideAllPanel();
            }

            $scope.indexToLogin = function () {
                $scope.showindexLoginPanel = $scope.showModelBackground = false;
                $state.go('login', {ragion: 'mine'});
                $ionicViewSwitcher.nextDirection('forward');
            }

            $scope.indexToReg = function () {
                $scope.showindexLoginPanel = $scope.showModelBackground = false;
                $state.go('register', {operation: 1});
                $ionicViewSwitcher.nextDirection('forward');
            }


            $rootScope.$state = $state;
            $rootScope.appType = appType;
            var deviceIntervalId = $interval(function () {
                $rootScope.deviceId = localStorage.getItem('nowDevice');
                if ($rootScope.deviceId) {
                    $interval.cancel(deviceIntervalId);
                }
            }, 350, 10)
            //$rootScope.deviceId=deviceId;
            //通过appType来判断如何执行代码
            if (appType == 0) {
                //这特么是获取微信openId
                $scope.userCode = $location.url().substring($location.url().indexOf('=') + 1, $location.url().indexOf('&'));
                var requestParams = {"code": $scope.userCode, "payUrl": 'http://wxtest.sxtx.4zlink.com/#/pay/payorder'};
                //获取缓存中用户信息，用来自动登录
                var userInfo = localStorage.getItem('userInfo');
                if (userInfo) {
                    var usermsg = eval('(' + userInfo + ')');
                    if (new Date().getTime() - usermsg.timestamp >= 86400000) {
                        localStorage.clear();
                    } else {
                        userService.userMess = usermsg;
                    }
                }
                var userContact = localStorage.getItem('contact');
                if (userContact) {
                    userService.userContact = eval('(' + userContact + ')');
                }
                //请求统一下单接口，获取openId
                userService.uniformOrder(requestParams).then(function (data) {
                    if (data.list.errcode === 10000) {
                        userService.userOpenId = data.list.data;
                    }
                })
            } else if (appType == 1) {
                var intervalId = $interval(function () {
                    if (userInfoApp.phone) {
                        $interval.cancel(intervalId);
                        if (userInfoApp.password) {
                            userService.passwordLogin(userInfoApp.phone, userInfoApp.password).then(function (data) {
                                if (data.list.errcode == 10000) {
                                    angular.copy(data.list.data, userService.userMess);
                                    data.list.data.password = userInfoApp.password;
                                    connectWebViewJavascriptBridge(function (bridge) {
                                        //回app
                                        bridge.callHandler('userMessage', data.list.data, function (response) {

                                        })
                                    });
                                } else {

                                    userService.userMess = {};
                                }
                            })
                        } else {
                            userService.userMess = {};
                        }
                    }
                }, 350, 10);
            }

            $scope.alertTab = function (val, callBack) {
                var myPop = $ionicPopup.alert({
                    title: val,
                    buttons: []
                });
                var timeId = $timeout(function () {
                    $timeout.cancel(timeId);
                    myPop.close(); //由于某种原因1.5秒后关闭弹出
                    if (callBack) {
                        callBack();
                    }
                }, 1500);
            }
            //通过向上传递来弹出提示窗口
            $scope.$on('popup.alert', function (evt, val) {
                $scope.alertTab(val);
            })

            $scope._goback = function (val) {
                $ionicHistory.goBack(val);
                $ionicViewSwitcher.nextDirection('back');

            };

            //用户没有登录，跳转到登录界面
            $rootScope.$on('swalk.no.login', function (evt, val) {
                userService.userMess = {};
                $state.go('login', {code: 'timeout'});
                $ionicViewSwitcher.nextDirection('forward');
            })

            Number.prototype.toFixed = function (d) {
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

            Date.prototype.format = function (format) {
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
                    console.log('----on back');
                    var stateId = $ionicHistory.currentView().stateId;
                    if ($scope.showModelBackground) {
                        $scope.hideAllPanel();
                        //$scope.$digest();
                    }

                    if ((stateId.indexOf('tabs.mine') >= 0)) {
                        return;
                    } else {
                        $ionicHistory.goBack();
                        $ionicViewSwitcher.nextDirection('back');
                    }
                })
            });

            $rootScope.netBreak = false;

            //在没有网的情况下调用本函数
            connectWebViewJavascriptBridge(function (bridge) {
                bridge.registerHandler('netBreak', function (response) {
                    $rootScope.netBreak = response.netStatus;
                    $state.go('tabs.mine', {});
                    //$scope.$digest();
                })
            });

            $scope.hideTabBar = function (val) {
                var showHideInfo = {
                    type: val
                }
                connectWebViewJavascriptBridge(function (bridge) {
                    //回app
                    bridge.callHandler('showHideTab', showHideInfo, function (response) {
                    })
                });
            }
        }])
    //session拦截器
    .factory("sessionInjector", ['$rootScope', '$q', function ($rootScope, $q) {
        return {
            request: function (config) {
                return config;
            },
            response: function (response) {
                if (response.data.errcode == 50001 && response.config.method == 'POST') {
                    $rootScope.$emit('swalk.no.login', 'noLogin');
                }
                return response;
            }
        }
    }])
    //把拦截器加入到$httpProvider.interceptors数组中
    .config(function ($httpProvider) {
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