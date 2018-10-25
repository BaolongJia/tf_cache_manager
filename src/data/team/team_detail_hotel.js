/**
 * Created by xiangc on 2017/8/1.
 */

import hotel_base_config from '../viewmodel/hotel'

if(!hotel_base_config.fieldmap.find((item)=>{
    return item.key == "price"
})){
    hotel_base_config.fieldmap.push(
        {
            key: "price",
            name: "价格",
            width: 300,
        }
    );
}


hotel_base_config.rules.price = [
    {pattern: /^[\\.\d]+$/, required:true ,message: '请输入酒店价格', trigger: 'blur'}
];

export default hotel_base_config;