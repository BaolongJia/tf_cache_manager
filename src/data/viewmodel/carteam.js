/**
 * Created by xiangc on 2017/6/30.
 */

let config = {
    entityname:'driver',
    fieldmap:[
        {
            key: "driver_group",
            name: "车队名称",
            width: 100,
        },
        {
            key: "name",
            name: "司机姓名",
            width: 150,
        },
        {
            key: "bus_size",
            name: "车型",
            width: 100,
        },
        {
            key: "phone",
            name: "司机电话",
            width: 300,
        },
    ],
    rules: {
        driver_group: [
            {required: true, message: '请输入车队名称', trigger: 'blur'}
        ],
        phone: [
            {required: true, message: '请输入司机电话', trigger: 'blur'},
            {pattern: /^1\d{10}$/, message: '请输入正确的电话', trigger: 'blur'}
        ],
        bus_size: [{required: true, message: '请输入车型', trigger: 'blur'}],
        name: [{required: true, message: '请输入司机姓名', trigger: 'blur'}],
    }
}


export default config