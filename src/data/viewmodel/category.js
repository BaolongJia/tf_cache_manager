/**
 * Created by xiangc on 2017/6/30.
 */

let config = {
    entityname:'category',
    fieldmap:[
        {
            key: "label",
            name: "名称",
            width: 100,
        },
    ],
    rules: {
        label: [
            {required: true, message: '请输入名称', trigger: 'blur'}
        ],
    }
}


export default config