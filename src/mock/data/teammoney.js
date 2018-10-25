/**
 * Created by xiangc on 2017/7/2.
 */

/**
 * 钱款
 * Created by xiangc on 2017/6/29.
 */
import Mock from 'mockjs';

const TeamMoneys = [];
for (let i = 0; i < 5; i++) {
    TeamMoneys.push(Mock.mock({
        id: Mock.Random.guid(),
        title: '团款-' + Mock.Random.province(),
        num: Mock.Random.integer(10, 99) + '',
        member_count: Mock.Random.integer(10,99) + '',
        location: Mock.Random.province(),
        price: Mock.Random.integer(1000, 9999) + '',
        date: Mock.Random.date() + '',
        finished: Mock.Random.pick(['是', '否']) + '',
        validate_off: Mock.Random.pick(['是', '否']) + '',
        account_off: Mock.Random.pick(['是', '否']) + '',
    }))
}

export default TeamMoneys