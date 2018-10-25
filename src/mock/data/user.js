import Mock from 'mockjs';

import Duties from './duty'
import Companies from './company'
import Parties from './party'


const LoginUsers = [];

const Users = [];

for (let i = 0; i < 10; i++) {
    Users.push(Mock.mock({
        id: Mock.Random.guid(),
        name: Mock.Random.cname(),
        sex: Mock.Random.integer(0, 1),
        phone: Mock.Random.integer(18911410000, 18911419999) + '',
        address: Mock.mock('@county(true)'),
        id_card_num: "" + Mock.Random.integer(130183198600000000, 130183198699999999), // 身份证
        guide_card_num: "D-"+Mock.Random.integer(1000, 9999) + '-'+ Mock.Random.integer(100000, 999999),                            // 导游证
        party_id: Mock.Random.pick(Parties).id,
        duties_id: Mock.Random.pick(Duties).id,
        company_id: Mock.Random.pick(Companies).id
    }));
}

Users[0] = Object.assign(Users[0],{
    username: 'admin',
    password: '123456',
    avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
})

LoginUsers.push(Users[0])

// console.log(Users)
// console.log(LoginUsers)
// console.log(Duties)
// console.log("refresh users")

export {LoginUsers, Users, Parties, Duties, Companies};
