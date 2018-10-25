/**
 * Created by xiangc on 2017/6/29.
 */
import Mock from 'mockjs';

const Parties = [];
for (let i = 0; i < 5; i++) {
    Parties.push(Mock.mock({
        id: Mock.Random.guid(),
        name: '部门' + Mock.Random.province()
    }))
}

export default Parties