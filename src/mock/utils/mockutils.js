/**
 * Created by xiangc on 2017/6/29.
 */

import MockAdapter from 'axios-mock-adapter';

/**
 *
 * @param {MockAdapter} mock
 * @param path
 * @param datas
 */
function bindMock(mock, path, datas) {

    // 新增
    mock.onGet(`/${path}/add`).reply(config => {
        console.log("request:" + `/${path}/add`)

        let attr_arr = Reflect.ownKeys(config.params)
        let obj = Object()
        attr_arr.forEach(key =>
            obj[key] = config.params[key]
        )

        datas.push(obj);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([200, {
                    code: 0,
                    msg: '新增成功'
                }]);
            }, 500);
        });
    });

    //编辑
    mock.onGet(`/${path}/edit`).reply(config => {
        console.log("request:" + `/${path}/edit`)

        let attr_arr = Reflect.ownKeys(config.params)
        let obj = Object()
        let id = ''
        attr_arr.forEach(key => {
                obj[key] = config.params[key]
                if (key == 'id') id = config.params['id']
            }
        )

        datas.some(u => {
            if (u.id === id) {
                Object.assign(u, obj)
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

    bindListPage(mock, path, datas)
    bindRemove(mock, path, datas)
}


/**
 * 绑定获取列表
 * @param {MockAdapter} mock
 * @param path
 * @param datas
 */
function bindListPage(mock, path, datas) {
    // 获取列表
    mock.onGet(`/${path}/listpage`).reply(config => {
        console.log("request:" + `/${path}/listpage`)

        let name = ''
        if (config.params) {
            name = config.params.name;
        }

        let mock_data = datas.filter(data_item => {
            if (name && data_item.name.indexOf(name) == -1) return false;
            return true;
        });

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([200, {
                    code: 0,
                    data: mock_data
                }]);
            }, 1000);
        });
    });
}

/**
 * 绑定删除
 * @param {MockAdapter} mock
 * @param path
 * @param datas
 */
function bindRemove(mock, path, datas) {

    //批量删除
    mock.onGet(`/${path}/batchremove`).reply(config => {
        console.log("request:" + `/${path}/batchremove`)

        let {ids} = config.params;
        ids = ids.split(',');

        ids.forEach(u => {
            let itemindex = datas.findIndex(ui => ui.id == u)
            console.log(itemindex)
            if (itemindex > 0) datas.splice(itemindex, 1)
        })

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([200, {
                    code: 0,
                    msg: '删除成功'
                }]);
            }, 500);
        });
    });

    //删除
    mock.onGet(`/${path}/remove`).reply(config => {
        console.log("request:" + `/${path}/remove`)

        let {id} = config.params;

        let itemindex = datas.findIndex(ui => ui.id == id)
        console.log(itemindex)
        if (itemindex > 0) datas.splice(itemindex, 1)

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([200, {
                    code: 0,
                    msg: '删除成功'
                }]);
            }, 500);
        });
    });


}

export {bindMock}