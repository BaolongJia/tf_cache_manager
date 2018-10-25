import axios from '../tools/http';
import MockAdapter from 'axios-mock-adapter';
import {LoginUsers, Users, Parties, Duties, Companies} from './data/user';
import Hotel from './data/hotel'
import CarTeam from './data/carteam'
import Restaurant from './data/restaurant'
import ViewSpot from './data/viewspot'
import MainPageCards from './data/mainpage_cards'
import {getNewMock} from './data/team'
import Teams from './data/team'
import TeamMoneys from './data/teammoney'
import TeamDates from './data/teamdate'
import Home from './views/home'
import Charts from './views/charts'
import { bindMock } from './utils/mockutils'

function getData(key, datas) {
    let temp_data = JSON.parse(sessionStorage.getItem(key))
    let result_data = [];
    if(!temp_data){
        result_data.push(...datas)
        sessionStorage.setItem(key, JSON.stringify(result_data))
    } else {
        result_data.push(...temp_data)
    }
    return result_data
}

let _Users = getData("user_mock_data", Users)
let _Parties = getData("party_mock_data", Parties)
let _Duties = getData("duty_mock_data", Duties)
let _Companies = getData("company_mock_data", Companies)

export default {
    /**
     * mock bootstrap
     */
    bootstrap() {
        console.log(axios)
        let mock = new MockAdapter(axios);

        // mock success request
        mock.onGet('/success').reply(200, {
            msg: 'success'
        });

        // mock error request
        mock.onGet('/error').reply(500, {
            msg: 'failure'
        });

        //登录
        mock.onPost('/login').reply(config => {
            let {username, password} = JSON.parse(config.data);
            return new Promise((resolve, reject) => {
                let user = null;
                setTimeout(() => {
                    let hasUser = LoginUsers.some(u => {
                        if (u.username === username && u.password === password) {
                            user = JSON.parse(JSON.stringify(u));
                            user.password = undefined;
                            return true;
                        }
                    });

                    if (hasUser) {
                        resolve([200, {code: 0, msg: '请求成功', user}]);
                    } else {
                        resolve([200, {code: 430, msg: '账号或密码错误'}]);
                    }
                }, 1000);
            });
        });

        //获取用户列表
        mock.onGet('/user/list').reply(config => {
            let {name} = config.params;
            let mockUsers = _Users.filter(user => {
                if (name && user.name.indexOf(name) == -1) return false;
                return true;
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 0,
                        users: mockUsers
                    }]);
                }, 1000);
            });
        });

        //获取用户列表（分页）
        mock.onGet('/user/listpage').reply(config => {
            let {page, name} = config.params;
            let mockUsers = _Users.filter(user => {
                if (name && user.name.indexOf(name) == -1) return false;
                return true;
            });
            let total = mockUsers.length;
            mockUsers = mockUsers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 0,
                        total: total,
                        users: mockUsers
                    }]);
                }, 1000);
            });
        });

        //删除用户
        mock.onGet('/user/remove').reply(config => {
            let {id} = config.params;
            _Users = _Users.filter(u => u.id !== id);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 0,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });

        //批量删除用户
        mock.onGet('/user/batchremove').reply(config => {
            let {ids} = config.params;
            ids = ids.split(',');
            _Users = _Users.filter(u => !ids.includes(u.id));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 0,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });

        //编辑用户
        mock.onGet('/user/edit').reply(config => {
            console.log("get request")
            console.log(config.params)
            let {id, name, sex, address, phone, id_card_num, guide_card_num, party_id, duties_id, company_id} = config.params;
            _Users.some(u => {
                if (u.id === id) {
                    u.name = name
                    u.sex = sex
                    u.address = address
                    u.phone = phone
                    u.id_card_num = id_card_num
                    u.guide_card_num = guide_card_num
                    u.party_id = party_id
                    u.duties_id = duties_id
                    u.company_id = company_id
                    return true
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 0,
                        msg: '编辑成功'
                    }]);
                }, 500);
            });
        });

        //修改密码
        mock.onGet('/user/changepassword').reply(config => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 0,
                        msg: '密码修改成功'
                    }]);
                }, 500);
            });
        });

        //编辑用户
        mock.onGet('/user/single').reply(config => {
            let {id} = config.params;
            let temp_user = undefined
            _Users.some(u => {
                if (u.id === id) {
                    temp_user = u
                    return true
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 0,
                        msg: '编辑成功'
                    }]);
                }, 500);
            });
        });

        //新增用户
        mock.onGet('/user/add').reply(config => {
            let {name, sex, address, phone, id_card_num, guide_card_num, party_id, duties_id, company_id} = config.params;

            _Users.push({
                name: name,
                sex: sex,
                address: address,
                phone: phone,
                id_card_num: id_card_num,
                guide_card_num: guide_card_num,
                party_id: party_id,
                duties_id: duties_id,
                company_id: company_id
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 0,
                        msg: '新增成功'
                    }]);
                }, 500);
            });
        });


        bindMock(mock, 'duty', _Duties);
        bindMock(mock, 'company', _Companies);
        bindMock(mock, 'party', _Parties);
        bindMock(mock, 'hotel', Hotel);
        bindMock(mock, 'carteam', CarTeam);
        bindMock(mock, 'restaurant', Restaurant);
        bindMock(mock, 'viewspot', ViewSpot);
        bindMock(mock, 'team', Teams);
        bindMock(mock, 'teammoney', TeamMoneys);
        bindMock(mock, 'teamdate', TeamDates);
        //获取用户列表
        mock.onGet('/home').reply(config => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 0,
                        data: Home
                    }]);
                }, 1000);
            });
        });

        function TeamCommonReply(config, data) {
            return new Promise((resolve, reject)=>{
                setTimeout(() => {
                    resolve([200, {
                        code: 0,
                        data: data
                    }])
                }, 1000)
            })
        }
        mock.onGet('/team/assigned').reply(config => TeamCommonReply(config, getNewMock()));
        mock.onGet('/team/unassigned').reply(config => TeamCommonReply(config, getNewMock()));
        mock.onGet('/team/checked').reply(config => TeamCommonReply(config, getNewMock()));
        mock.onGet('/team/unchecked').reply(config => TeamCommonReply(config, getNewMock()));


        // 图表接口
        mock.onGet('/team/charts').reply(config => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 0,
                        data: Charts
                    }]);
                }, 500);
            });
        })

    }
};