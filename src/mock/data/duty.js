/**
 * Created by xiangc on 2017/6/29.
 */
import Mock from 'mockjs';

const Duties = [];
for (let i = 0; i < 5; i++) {
    Duties.push(Mock.mock({
        id: Mock.Random.guid(),
        name: '职务' + Mock.Random.province()
    }))
}

export default Duties