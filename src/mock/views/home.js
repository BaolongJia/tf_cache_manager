/**
 * Created by xiangc on 2017/7/22.
 */
import Mock from 'mockjs'
import routers from '../../routes'

let router_result = new Set()
function getAllRouter(imputrouters) {
    for(let key in imputrouters){
        let item = imputrouters[key];
        router_result.add(item.path);
        console.log(item.path);
        if(item.children){
            getAllRouter(item.children);
        }
    }
}

getAllRouter(routers);
router_result = Array.from(router_result);
console.log(router_result);
console.log(router_result.entries());

function getKdvArr() {
    let result = [];
    for(let i=0; i<4; i++){
        let obj = {
            key:Mock.Random.ctitle(4),
            value: Mock.Random.integer(1,10000),
            schema: Mock.Random.pick(router_result)
        }
        result.push(obj);
    }
    return result;
}


let Home = {
        base_data: getKdvArr(),
        slide_data:  getKdvArr(),
        recent_team_info: { // 最近团信息
            team_date: "",
            team_id: "",
            traffic_no: "",
            pick_up_time: "",
            driver_phone: "",
            hotel_phone: "",
            schema:"",
        },
    };

export default Home
