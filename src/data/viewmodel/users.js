/**
 * Created by xiangc on 2017/6/30.
 */

let config = {
    entityname:'user',
    fieldmap:[
        {
            key: "name",
            name: "用户名",
            width: 100,
        },{
            key: "nickname",
            name: "昵称",
            width: 100,
        },{
            key: "gender",
            name: "性别",
            width: 100,
        },{
            key: "mobile",
            name: "电话",
            width: 100,
        },{
            key: "identify_no",
            name: "身份证号",
            width: 100,
        },{
            key: "birthday",
            name: "生日",
            width: 100,
        },{
            key: "password",
            name: "密码",
            width: 100,
        },{
            key: "department_id",
            name: "部门",
            width: 100,
        },

    ],
    rules: {
        name: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        mobile: [
            {required: true, message: '请输入电话', trigger: 'blur'},
            {pattern: /^1\d{10}$/, message: '请输入正确的电话', trigger: 'blur'}
        ],
    }
}


export default config