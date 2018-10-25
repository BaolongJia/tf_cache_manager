/**
 * Created by xiangc on 2017/6/29.
 */
import Mock from 'mockjs';

const Hotels = [];
for (let i = 0; i < 5; i++) {
    Hotels.push(Mock.mock({
        id: Mock.Random.guid(),
        name: '酒店' + Mock.Random.province(),
        phone: Mock.Random.integer(18911410000, 18911419999) + '',
        address: Mock.mock('@county(true)'),
    }))
}

export default Hotels