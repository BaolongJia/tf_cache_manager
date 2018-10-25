/**
 * 旅行团列表
 * Created by xiangc on 2017/6/30.
 */

let config = {
    entityname: 'account',
    fieldmap: [
        {
            key: "title",
            name: "标题",
            width: 100,
        },
        {
            key: "num",
            name: "团号",
            width: 100,
        },
        {
            key: "member_count",
            name: "人数",
            width: 100,
        },
        {
            key: "location",
            name: "地区",
            width: 200,
        },
        {
            key: "price",
            name: "地区",
            width: 200,
        },
        {
            key: "date",
            name: "日期",
            width: 200,
        },
        {
            key: "finished",
            name: "是否完成",
            width: 150,
            type: "checkbox",
        },
        {
            key: "validate_off",
            name: "是否审验",
            width: 150,
            type: "checkbox",
        },
        {
            key: "account_off",
            name: "是否已报",
            width: 150,
            type: "checkbox",
        },
    ],
    rules: {},
    showopt:false
}


export default config