/**
 * Created by xiangc on 2017/6/30.
 */

let config = {
    entityname:'restaurant',
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
            key: "location_id",
            name: "地区",
            width: 300,
            type: 'location',
            for_dialog: true,
        },
        {
            key: "mark",
            name: "备注",
            width: 300,
        },
    ],
    rules: {
        name: [
            {required: true, message: '请输入餐厅名称', trigger: 'blur'}
        ],
        phone: [
            {required: true, message: '请输入电话', trigger: 'blur'},
            {pattern: /^1\d{10}$/, message: '请输入正确的电话', trigger: 'blur'}
        ],
        location_id: [{type: 'number', required: true, message: '请输入地址', trigger: 'blur'}],
    }
}


export default config