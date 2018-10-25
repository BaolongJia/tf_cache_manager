/**
 * Created by xiangc on 2017/7/23.
 */
var Mock =require('mockjs')

function getRandomData(size) {
    let result = [];
    for (let i = 0; i < size; i++) {
        result.push(Mock.Random.integer(1, 1000));
    }
    return result;
}

function getRandomTitle(size) {
    let result = [];
    for (let i = 0; i < size; i++) {
        result.push(Mock.Random.ctitle(2));
    }
    return result;
}

function getCharts(size) {
    let result = [];
    for (let i = 0; i < size; i++) {
        result.push(getOneChart());
    }
    return result;
}

function getOneChart() {
    return {
        type: Mock.Random.pick(['line', 'bar']),
        title: "title" + Mock.Random.ctitle(4),
        x_name: "xn" + Mock.Random.ctitle(2),
        y_name: "yn" + Mock.Random.ctitle(2),
        x_axis: getRandomTitle(12),
        x_data: getRandomData(12),
    }
}

let Charts =
    {
        "charts": getCharts(4),
        "limit": [
            2015,
            2016,
            2017
        ]
    };

console.log("apiresult");
console.log(Charts);

export default Charts;