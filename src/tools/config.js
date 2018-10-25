export default {
    entityName: {
        ACCOUNT: "account",
    },
    dutyType: {
        daoyou: {id: 1, name: "导游员"},
        jidiao: {id: 2, name: "计调员"},
        caiwu: {id: 3, name: "财务员"},
        jingli: {id: 4, name: "经理"},
        getArray: function () {
            return getArray(this);
        },
        getName: function (id) {
            return getName(this, id);
        }
    }
}

var getArray = function (obj) {
    return Object.values(obj).filter(
        item => {
            return typeof(item) == typeof({});
        }
    );
};

var getName = function (obj, id) {
    return obj.getArray().find(item => item.id == id).name;
};


export const accountStatusEnum = {
    weitongguo_jidiao: {id: 1, name: "未通过(计调)"},
    tongguo_jidiao: {id: 2, name: "通过(计调)"},
    weitongguo_caiwu: {id: 3, name: "未通过(财务)"},
    tongguo_caiwu: {id: 4, name: "通过(财务)"},
    weitongguo_jingli: {id: 5, name: "未通过"},
    tongguo_jingli: {id: 5, name: "通过"},
    getArray: function () {
        return getArray(this);
    },
    getName: function (id) {
        return getName(this, id);
    }
};
export const accountStatus = accountStatusEnum.getArray();

export const teamStatusEnum = {
    quanbu: {id: 0, name: "全部"},
    weishangtuan: {id: 1, name: "未上团"},
    shangtuanzhong: {id: 2, name: "上团中"},
    yixiatuan: {id: 3, name: "已下团"},
    weishenhe_jidiao: {id: 4, name: "未审核(计调)"},
    yishenhe_jidiao: {id: 5, name: "已审核(计调)"},
    weishenhe_caiwu: {id: 6, name: "未审核(财务)"},
    yishenhe_caiwu: {id: 7, name: "已审核(财务)"},
    yibao: {id: 8, name: "已报"},
    getArray: function () {
        return getArray(this);
    },
    getName: function (id) {
        return getName(this, id);
    }
}


export const accountAllotType = {
    anbili: {
        id: 1, name: "按比例"
    },
    anlirun: {
        id: 2, name: "按利润"
    },
    getArray: function () {
        return getArray(this);
    },
    getName: function (id) {
        return getName(this, id);
    }
};
