/**
 * Created by xiangc on 2017/6/30.
 */

let config = {
    entityname:'hotel',
    fieldmap:[
        {
            key: "name",
            name: "名称",
            width: 100,
        },
        {
            key: "phone",
            name: "电话",
            width: 200,
        },
        {
            key: "location_name",
            name: "地区",
            width: 300,
            for_table: true,
        },
        {
            key: "location_id",
            name: "地区",
            width: 300,
            type: 'location',
            for_dialog: true,
        }

    ],
    rules: {
        name: [
            {required: true, message: '请输入酒店名', trigger: 'blur'}
        ],
        phone: [
            {required: true, message: '请输入电话', trigger: 'blur'},
            {pattern: /^1\d{10}$/, message: '请输入正确的电话', trigger: 'blur'}
        ],
        location_id: [{type: 'number', required: true, message: '请输入地址', trigger: 'blur'}],
    },
}


export default config