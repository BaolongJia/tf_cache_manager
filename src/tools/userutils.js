import Config from './config'
var obj = {
    /**
     * 获取用户
     */
    getUser: function () {
        var user = JSON.parse(window.sessionStorage.getItem('user'));
        user.duty_id = Config.dutyType.caiwu.id;
        return user;
    },
    getUserId: function(){
        var user = JSON.parse(window.sessionStorage.getItem('user'));
        return user.uid;
    },
    /**
     * 获取用户职务
     */
    getUserDutyId: function () {
        return this.getUser().duty_id;
    },
    setUser: function (user) {
        window.sessionStorage.setItem('user', JSON.stringify(user));
    },
};
var computedprops = {
    isDaoyou: function () {
        return obj.getUserDutyId() == Config.dutyType.daoyou.id;
    },
    isJiDiao: function () {
        return obj.getUserDutyId() == Config.dutyType.jidiao.id;
    },
    isCaiwu: function () {
        return obj.getUserDutyId() == Config.dutyType.caiwu.id;
    },
    isJingli: function () {
        return obj.getUserDutyId() == Config.dutyType.jingli.id;
    },
};
export {computedprops}
export default obj