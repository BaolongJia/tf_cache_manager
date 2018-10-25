/**
 * Created by xiangc on 2017/6/29.
 */
import Mock from 'mockjs';

const Restaurant = [];
for (let i = 0; i < 5; i++) {
    Restaurant.push(Mock.mock({
        id: Mock.Random.guid(),
        name: '餐厅' + Mock.Random.province(),
        phone: Mock.Random.integer(18911410000, 18911419999) + '',
        mark: Mock.mock('@county(true)'),
    }))
}

export default Restaurant