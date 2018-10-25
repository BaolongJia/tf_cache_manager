/**
 * Created by xiangc on 2017/7/30.
 */

var moment = require('moment');
var uuid = require('uuid/v4');
var deepcopy = require('deepcopy')

import StringUtils from './stringutils'

/**
 * date转string
 * @param datevalue
 */
function formatDate(datevalue) {
    return moment(datevalue).format("YYYY-MM-DD");
}

/**
 * datetime转string
 * @param datevalue
 */
function formateDateTime(datevalue) {
    return moment(datevalue).format("YYYY-MM-DD HH:mm:ss");
}

/**
 * 将string转date
 * @param dateString
 * @returns {Date}
 */
function getDateFromString(dateString) {
    let datex = moment(dateString).toDate();
    console.log("decode" + datex);
    return datex;
}

/**
 * 获取uuid
 * @returns {*}
 */
function getUUID() {
    return uuid();
}

function deepCopy(obj) {
    return deepcopy(obj);
}

/**
 * 利润计算
 * @param sell_price
 * @param back_price
 * @param people_count
 * @param with_cash
 * @returns {number}
 */
var calculateProfit = function (dataparam) {
    var result = (StringUtils.parseFloat(dataparam.sell_price) - StringUtils.parseFloat(dataparam.back_price))
        * StringUtils.parseFloat(dataparam.people_count) + StringUtils.parseFloat(dataparam.with_cash)
        - StringUtils.parseFloat(dataparam.parking_price);

    return result;
};

/**
 * 计算基础信息项目
 * @param formData
 * @returns {{}}
 */
var calcuBaseInfoTable = function (formData) {
    var baseInfo = {};

    var payValue = StringUtils.parseFloat(formData.people_count) * StringUtils.parseFloat(formData.back_price);
    if (formData.pay_type == 1) {
        baseInfo.qiandan = payValue;
        baseInfo.xianjin = 0;
    } else {
        baseInfo.qiandan = 0;
        baseInfo.xianjin = payValue;
    }

    baseInfo.shishou = StringUtils.parseFloat(formData.people_count) * StringUtils.parseFloat(formData.sell_price);
    baseInfo.lirun = calculateProfit(formData);

    baseInfo.heji = baseInfo.xianjin + baseInfo.qiandan;

    return baseInfo;
};

/**
 * 计算分配项目
 * @param formData
 * @returns {{}}
 */
var calcuAllotInfoTable = function (formData) {
    var allotInfo = {};
    var lirun = calculateProfit(formData);

    if(formData.allot_type == 1) {
        allotInfo.dijie = lirun * StringUtils.parseFloat(formData.allot_local)/10;
        allotInfo.quanpei = lirun * StringUtils.parseFloat(formData.allot_national)/10;
        allotInfo.chedui = lirun * StringUtils.parseFloat(formData.allot_driver)/10;
        allotInfo.gongsi = lirun * StringUtils.parseFloat(formData.allot_company)/10;
    } else {
        allotInfo.dijie = StringUtils.parseFloat(formData.allot_local);
        allotInfo.quanpei = StringUtils.parseFloat(formData.allot_national);
        allotInfo.chedui = StringUtils.parseFloat(formData.allot_driver);
        allotInfo.gongsi = StringUtils.parseFloat(formData.allot_company);
    }

    return allotInfo;
};

/**
 * 为列表计算基础信息和分配信息
 * @returns {{baseInfo: *, allotInfo: *}}
 */
var calcuAllotAndBaseInfoForList = function (accountInfo) {

    var baseInfo = {
        xianjin: 0,
        qiandan: 0,
        shishou: 0,
        lirun: 0,
    };

    var allotInfo = {
        dijie: 0,
        quanpei: 0,
        chedui: 0,
        gongsi: 0,
    };

    function sumKeys(sourceObj, destObj) {
        var keys = Object.keys(sourceObj);
        for (let k_index = 0; k_index < keys.length; k_index++) {
            destObj[keys[k_index]] += sourceObj[keys[k_index]];
        }
    }


    var tempBaseInfo;
    var tempAllotInfo;
    for (let index = 0; index < accountInfo.length; index++) {
        var formData = accountInfo[index];
        var tempBaseInfo = calcuBaseInfoTable(formData);
        var tempAllotInfo = calcuAllotInfoTable(formData);
        sumKeys(tempBaseInfo, baseInfo);
        sumKeys(tempAllotInfo, allotInfo);
    }

    tempBaseInfo.heji = tempBaseInfo.xianjin + tempBaseInfo.qiandan;

    return {
        baseInfo: tempBaseInfo,
        allotInfo: tempAllotInfo,
    }
};

export {formatDate, getUUID, formateDateTime, getDateFromString, deepCopy,
    calculateProfit, calcuAllotInfoTable, calcuBaseInfoTable, calcuAllotAndBaseInfoForList}