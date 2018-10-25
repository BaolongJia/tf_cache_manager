import axios from 'axios';
import http from '../tools/http'
const queryString = require('query-string');
import UserUtils from '../tools/userutils'

let base = '';
let basecache = '/api';
let requesttool = http;

let prefix = '';
let product_base = '/api'+prefix;
// let product_base = '/api'+prefix;
let product_request_tool = axios;

export const getUploadPath = ()=>{
    return `${product_base}/posts`;
};

let postRequest = function (vueobj, path, params) {
    if(params === undefined) params={}
    params['adminUid'] = UserUtils.getUserId()
    return product_request_tool.post(path, queryString.stringify(params))
        .then(res => {
            if (res.data.code !== 0) {
                let msg = "请求失败，错误码"+res.data.code;
                if(res.data.message){
                    msg = res.data.message;
                }
                // const toast = vueobj.$createToast({
                //     time: 1000,
                //     type: 'error',
                //     txt: msg,
                // })
                // toast.show()
                return Promise.reject('请求失败')
            } else {
                return res.data.data
            }
        });
}

export const requestLogin = params =>product_request_tool.get(`${product_base}/login`, { params: params })

// 获取部门列表
export const getDepartmentList = params => { return product_request_tool.get(`${product_base}/department/get/all`, { params: params }); }
// 获取职务列表
export const getJobList = params => { return requesttool.get(`${base}/duty/listpage`, { params: params }); }
//获取线下jbl本地测试缓存列表
export const getLocalCacheList = params => {
    console.log(`${basecache}/models/CacheShow/ApiCacheShow.php?_ijt=dr6705k08uimut3h9q071ctp8u`)
    return requesttool.get(`${basecache}/models/CacheShow/ApiCacheShow.php?_ijt=dr6705k08uimut3h9q071ctp8u`, { params: params });
}




//获取线上缓存
export const getCacheList = params => { return requesttool.get(`${base}/cachelist`, { params: params }); }
// 获取公司列表
export const getCompanyList = params => { return requesttool.get(`${base}/company/listpage`, { params: params }); }


// 获取数据
export const getDataListPage = (entityname, params) => { return product_request_tool.get(`${product_base}/${entityname}/get/all`, { params: params }); };
export const getProdDataListPage = getDataListPage;
export const getData = (entityname, params) => { return product_request_tool.get(`${product_base}/${entityname}/get`, { params: params }); };


// 账目
export const getAccountConfig = () => { return product_request_tool.get(`${product_base}/account/get/type_config`); };

