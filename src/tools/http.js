"use strict"
/**
 * 统一获取http数据
 * Created by yaoze on 2017/2/17.
 */
import axios from "axios" // 引入axios组件
import Qs from "qs" // 引入axios组件
import {MessageBox} from 'element-ui'; // 从element组件中引入Message，用于展示错误信息


// 创建axios实例
let http = axios.create({
    // baseURL: process.env.BASE_API, // api的base_url，后台开发/本地调试时不需要指定
    // timeout: 5000                  // 请求超时时间，后台开发不需要指定，响应时间如果真的太长的话，锤子比配置好使

    // // 将post转成form-urlencoded的形式
    // transformRequest: [function (data) {
    //     data = Qs.stringify(data);
    //     return data;
    // }],
    // // 设置post类型
    // headers:{'Content-Type':'application/x-www-form-urlencoded'},

});

// respone拦截器
http.interceptors.response.use(
    // 响应成功
    response => {
        /**
         * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
         * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
         */
        const code = response.data.code;
        const data = response.data
        console.log("receive response => ")
        console.log(response)
        if (response.status === 302) {
            // 302跳转，一般都是没权限了
            // 跟着跳过去
            console.log("302跳转")
            MessageBox.alert('点击确定跳转到登录界面', '登录已过期', {
                type: 'warning',
                confirmButtonText: '确定',
            });
            location.href = response.headers.Location
        } else {
            console.log("收到200响应")
            if(response.status === 200){
                if (code !== 0) {
                    console.log("code不等于0,直接展示错误消息")
                    MessageBox.alert(data.msg, '服务器响应异常', {
                        type: 'error',
                        confirmButtonText: '确定',
                    });
                    return response
                } else {
                    console.log("响应成功，直接返回data数据")
                    return response
                }
            }else{
                // 异常响应
                console.log("服务器状态码不为200,返回response,留待程序自行处理")
                return response
            }
        }
    },
    // 响应失败
    error => {
        // 一般情况下，只要服务器返回的状态码不是2XX或者304,都会报这个错误
        console.log('服务器响应错误');
        console.log('error.message => ');
        console.log(error.message);
        if(error.request){
            console.log("请求信息:")
            console.log(error.request);
        }
        let return_error = error
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("响应内容:")
            console.log(error.response);
            if(error.response.status === 302){
                // 针对302跳转做特殊处理
                MessageBox.alert(error.message, '登录过期，请刷新页面重新登录', {
                    type: 'error',
                    confirmButtonText: '确定',
                });
            }
            return_error = error.response;
        }else{
            console.log('没有响应内容');
            return_error = Promise.reject(error);
        }
        MessageBox.alert(error.message, '服务器响应错误', {
            type: 'error',
            confirmButtonText: '确定',
        });
        return return_error
    }
)
console.log("random")
console.log(http.config)
export default http;
