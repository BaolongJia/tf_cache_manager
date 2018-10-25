/**
 * 旅行团
 * Created by xiangc on 2017/6/29.
 */
import Mock from 'mockjs';

const Teams = [];


function refresh(data) {
   data.length = 0;
    for (let i = 0; i < 5; i++) {
        data.push(Mock.mock({
            id: Mock.Random.guid(),
            title: '团-' + Mock.Random.province(),
            num: Mock.Random.integer(10, 99) + '',
            member_count: Mock.Random.integer(10,99) + '',
            location: Mock.Random.province(),
            date: Mock.Random.date() + '',
            finished: Mock.Random.pick(['是', '否']) + ''
        }));
    }

    return data;
}

refresh(Teams)

function getNewMock() {
   let result = [];
   return refresh(result);
}

export {getNewMock};
export default Teams;
