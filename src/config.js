/**
 * Created by dell on 2016/9/26.
 */
//var urlBase = window.location.protocol;
//var urlHost = window.location.host;
//urlHost = urlHost.split(':')[0];
//荣盛币支付接口
var rsbApi = 'http://182.92.20.230/trans/execute';
//var weChartBillUrl = 'http://123.57.225.54:8018/postingwebchat';
//var urlStr=urlBase+urlHost+'/sxtx';
var urlStr = '';
//urlStr ='http://172.16.1.238:8081/sxtx'; //本地环境
urlStr='https://v7sxtxweb.4zlink.com/sxtx';//生产环境
//urlStr='http://123.57.225.89/sxtx'; //测试环境
//urlStr='http://192.168.101.2:8081/sxtx';//开发测试环境
//urlStr='http://172.16.1.238:8081/sxtx';

//用来判断程序是公众号程序还是app程序的参数标记0-公众号，1-app
var appType=1;
var iosOrAndroid='0';
