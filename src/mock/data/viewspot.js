/**
 * Created by xiangc on 2017/6/29.
 */
import Mock from 'mockjs';

const ViewSpot = [];
for (let i = 0; i < 5; i++) {
    ViewSpot.push(Mock.mock({
        id: Mock.Random.guid(),
        name: '景点名称' + Mock.Random.province(),
        phone: Mock.Random.integer(18911410000, 18911419999) + '',
        mark: "备注" + Mock.mock('@county(true)'),
    }))
}

export default ViewSpot