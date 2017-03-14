'use strict'

angular.module('tab.mine',[])
    .controller('mineCtrl', ['$scope','$state','$http','$ionicViewSwitcher','$ionicHistory','$ionicScrollDelegate','userService', function($scope,$state,$http,$ionicViewSwitcher,$ionicHistory,$ionicScrollDelegate,userService) {


        var phone='13888888888';
        var password='12345678';
        var sign=md5('ymy'+md5(password)+phone);
        console.log(sign);
        /*$http({
            url:'/ym/account/register.api',
            method:'POST',
            params:{
                phone:phone,
                password:md5(password),
                sign:sign
            }
        }).success(function(data){
            console.log(data);
        })*/
        /*$http({
            url:'/ym/account/login.api',
            method:'POST',
            params:{
                phone:phone,
                password:md5(password),
                sign:sign
            }
        }).success(function(data){
            console.log(data);
        })*/
    }])