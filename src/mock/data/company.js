/**
 * Created by xiangc on 2017/6/29.
 */
import Mock from 'mockjs';


const Companies = [];
for (let i = 0; i < 10; i++) {
    Companies.push(Mock.mock({
        id: Mock.Random.guid(),
        name: '公司' + Mock.Random.province()
    }))
}

export default Companies