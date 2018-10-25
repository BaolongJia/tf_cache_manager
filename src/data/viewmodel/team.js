/**
 * 旅行团列表
 * Created by xiangc on 2017/6/30.
 */

let config = {
    entityname: 'team',
    fieldmap: [
        {
            key: "title",
            name: "标题",
            width: 200,
        },
        {
            key: "team_id",
            name: "团号",
            width: 100,
        },
        {
            key: "people_count",
            name: "人数",
            width: 100,
        },
        {
            key: "location_name",
            name: "地区",
            width: 200,
        },
        {
            key: "date_on",
            name: "团期",
            width: 200,
        },
        {
            key: "status_name",
            name: "状态",
            width: 150,
            type: "checkbox",
        },
    ],
    rules: {},
    showopt:true
}


export default config