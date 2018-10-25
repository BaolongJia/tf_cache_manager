/**
 * Created by xiangc on 2017/6/30.
 */

let config = {
    entityname:'view',
    fieldmap:[
        {
            key: "name",
            name: "景点名称",
            width: 100,
        },
        {
            key: "phone",
            name: "景点电话",
            width: 200,
        },
        {
            key: "mark",
            name: "备注",
            width: 300,
        },
    ],
    rules: {
        name: [
            {required: true, message: '请输入景点名称', trigger: 'blur'}
        ],
        phone: [
            {required: true, message: '请输入电话', trigger: 'blur'},
            {pattern: /^1\d{10}$/, message: '请输入正确的电话', trigger: 'blur'}
        ],
    }
}


export default config