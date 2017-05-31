'use strict'

angular.module('swalk.services', [])
    .service('userService', ['$http', '$q', '$location', function ($http, $q, $location) {
        var result = {
            //用户信息
            userMess: {
                //accountId:5
            },
            //获取登录验证码接口
            checkCode: function (phone) {
                var halfUrl = "/mobile/login/loginVerify";
                var postData = {"params": {"phone": phone}}
                return reqData(postData, halfUrl);

            },
            //验证码登录接口
            login: function (phone, code) {
                var halfUrl = '/mobile/login/login';
                var postData = {"params": {"phone": phone, "code": code}};
                return requestData(postData, halfUrl);
            },
            //密码登录接口
            passwordLogin: function (phone, password) {
                var halfUrl = '/mobile/login/loginByPwd';
                var postData = {"params": {"phone": phone, "password": password}};
                return requestData(postData, halfUrl);
            },
            //获取找回密码验证码
            getCallBackCode: function (phone) {
                var halfUrl = '/mobile/login/loginPwdCode';
                var params = {"params": {"phone": phone}};

                return requestData(params, halfUrl);
            },
            //修改密码 通过手机验证码
            resetPassowrd: function (phone, code, password) {
                var halfUrl = '/mobile/login/loginPwdChangeByCode';
                var params = {"params": {"phone": phone, "code": code, "password": password}};
                return requestData(params, halfUrl);
            },
            //修改密码 通过旧密码
            resetPasswordByOld:function(data){
                var halfUrl = '/mobile/login/changeLoginPwd';
                var params = {"params": data};
                return reqData(params, halfUrl);
            },

            //获取用户信息
            getUserInfo:function(data){
                var halfUrl = '/mobile/user/userInfo';
                var postData = {"params": data};
                return reqData(postData, halfUrl);
            },
            //更新用户信息
            updateUserInfo:function(data){
                var halfUrl = '/mobile/user/userUpdate';
                var postData = {"params": data};
                return reqData(postData, halfUrl);
            },
            //更改用户头像
            updateUserPortrait:function(){

            }
        }

        //请求需要用户信息的数据
        function reqData(postdata, lastUrl) {
            var deferred = $q.defer();
            $http({
                method: "POST",
                url: urlStr + lastUrl,
                params: postdata
            }).success(function (data) {
                return deferred.resolve({list: data});
            });
            return deferred.promise;
        }

        return result;
    }])
    .filter('phoneHash', [function () {
        return function (value) {
            var input = value + '';
            input = input.replace(/(\s+)/g, "");
            var out = '';
            for(var i = 0; i < input.length; i++){
                if(i == 2){
                    out = out + input[i] + ' ';
                }else if(i>2 && i<=6){
                    out = out + '*';
                    if(i == 6){
                        out = out + ' '
                    }
                }else {
                    out = out + input[i]
                }
            }
            return out
        }
    }])
    .filter('dateFormate', [function () {
        return function (value) {
            if(!value){
                return;
            }
            var out;
            if(value.substring(value.length-2)==='.0'){
                out=value.substring(0,value.length-2);
            }else{
                out=value;
            }
            return out;
        }
    }])
    .filter('passageDescFilter',[function(){
        return function(value){
            if(value.toString().length>13){
                value=value.substr(0,13)+'...';
            }
            return value;
        }
    }])