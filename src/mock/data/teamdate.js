/**
 * 团期列表
 * Created by xiangc on 2017/6/29.
 */
import Mock from 'mockjs';

const TeamDates = [];
for (let i = 0; i < 5; i++) {
    TeamDates.push(Mock.mock({
        id: Mock.Random.guid(),
        title: '团期-' + Mock.Random.province(),
        num: Mock.Random.integer(10, 99) + '',
        member_count: Mock.Random.integer(10,99) + '',
        location: Mock.Random.province(),
        date: Mock.Random.date() + '',
    }))
}

export default TeamDates