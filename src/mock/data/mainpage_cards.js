/**
 * Created by xiangc on 2017/6/29.
 */
import Mock from 'mockjs';

const MainPageCards = [];
for (let i = 0; i < 6; i++) {
    MainPageCards.push(Mock.mock({
        name: '名字' + Mock.Random.cname(),
        value: Mock.Random.integer(1000, 9999),
    }))
}

export default MainPageCards