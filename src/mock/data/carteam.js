/**
 * Created by xiangc on 2017/6/29.
 */
import Mock from 'mockjs';

const CarTeams = [];
for (let i = 0; i < 5; i++) {
    CarTeams.push(Mock.mock({
        id: Mock.Random.guid(),
        name: '车队' + Mock.Random.cname(),
        driver_name: Mock.Random.cname(),
        bus_size: Mock.Random.integer(10, 50) + '',
        driver_phone: Mock.Random.integer(18911410800, 18911410899) + '',
    }))
}

export default CarTeams