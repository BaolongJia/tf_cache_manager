<template>
    <div class="amap-page-container">
        <div class="amap-body">
            <el-amap ref="map" vid="amapDemo" :amap-manager="amapManager" :zoom="zoom" :plugin="plugin" :events="events"
                     class="amap">
                <el-amap-marker
                        v-for="(marker, index) in markers"
                        :key="index"
                        :position="marker.location"
                        :extData="marker"
                        :events="markerEvents"
                        :content="getMarkerContent(marker, 30, 30)"
                ></el-amap-marker>
                <el-amap-polygon
                        :strokeColor="'#00000000'"
                        :fillColor="'#d3ffce'"
                        :path="polygon.path" :draggable="polygon.draggable"
                        :events="polygon.events"></el-amap-polygon>
            </el-amap>
            <div class="amap-result">
                <el-table
                        :data="resultData"
                        style="width: 100%">
                    <el-table-column
                            label="结果">
                        <template slot-scope="scope">
                            <div>{{ scope.row.order }} : {{ scope.row.name }}</div>
                            <div style="font-size: 8px">{{ scope.row.address }}</div>
                            <div style="font-size: 8px">{{ scope.row.type }}</div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        background
                        small
                        :total="pager_conf.count"
                        :page-size="pager_conf.pageSize"
                        :pager-count="5"
                        layout="pager"
                        @current-change="onPageChange"
                        style="overflow: hidden"
                        >
                </el-pagination>
            </div>
        </div>


        <div style="margin-top: 10px;">
            <div class="bottom-potions">
                <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="输入点路径"
                        v-model="pio_path_points">
                </el-input>

                <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="输入搜索词"
                        v-model="pio_keywords">
                </el-input>
            </div>
            <el-button-group class="bottom_button_group">
                <el-button @click="clearPath()" size="small" type="primary">清理标记</el-button>
                <el-button @click="searchByPolygon()" size="small" type="primary">搜索</el-button>
                <el-button @click="searchByPio()" size="small" type="primary">搜索POI</el-button>
                <el-button @click="exportData()" size="small" type="primary">导出</el-button>
            </el-button-group>
        </div>
    </div>
</template>

<style>
    .amap-body {
        flex-direction: row;
        display: flex;
        align-items: stretch;
        height: 600px;
    }

    .amap {
        height: 100%;
        flex-grow: 1;
    }

    .amap-result {
        width: 250px;
    }

    .amap-page-container {
        width: 100%;
        height: 400px;
    }

    .bottom_button_group{
        margin-top: 10px;
    }
</style>


<script>

    var global_json = {
        "path_list": {
            "良乡经济开发区商圈": "116.116822 39.737364,116.111415 39.727596,116.118282 39.722974,116.123946 39.722776,116.123689 39.709703,116.150039 39.709572,116.149868 39.723436,116.157678 39.723437,116.157807 39.739047,116.146627 39.750167,116.145833 39.757822,116.116822 39.737364",
            "上地商圈": "116.28087 40.051127,116.257782 40.04748,116.272801 40.032827,116.287479 40.013701,116.293057 40.014424,116.298379 40.015212,116.305503 40.017381,116.327304 40.020536,116.32194 40.032613,116.314344 40.039694,116.304301 40.056218,116.28087 40.051127",
            "总部基地商圈": "116.283791 39.845703,116.279757 39.842869,116.277611 39.837663,116.275895 39.812218,116.298811 39.814658,116.297953 39.819273,116.307051 39.819536,116.316149 39.8198,116.320784 39.81947,116.320483 39.844566,116.309541 39.844583,116.285936 39.842079,116.283791 39.845703",
            "燕莎商圈": "116.468937 39.97161,116.460482 39.963387,116.45456 39.957729,116.460933 39.953304,116.462285 39.949538,116.488076 39.958059,116.480395 39.964242,116.468937 39.97161",
            "生命科学园商圈": "116.274026 40.11429,116.260122 40.113961,116.257118 40.110811,116.259649 40.108185,116.259392 40.105756,116.256559 40.104476,116.252311 40.106642,116.248706 40.106314,116.276172 40.088193,116.298145 40.095055,116.293166 40.101522,116.290334 40.10569,116.276773 40.115865,116.274026 40.11429",
            "西单商圈": "116.356146 39.923645,116.356876 39.900571,116.36297 39.898859,116.371381 39.896949,116.376102 39.896225,116.381252 39.898924,116.386401 39.900834,116.391937 39.907517,116.391337 39.924304,116.356146 39.923645",
            "望京商圈": "116.487132 40.012484,116.47945 40.015344,116.455847 40.015936,116.450011 39.999763,116.44323 39.988124,116.469838 39.972208,116.500651 39.999105,116.487132 40.012484",
            "石景山技园商圈": "116.17101 39.936148,116.169207 39.933318,116.168864 39.929994,116.171825 39.929698,116.175601 39.924696,116.197403 39.930258,116.207702 39.93108,116.207488 39.937728,116.206629 39.942137,116.206029 39.947204,116.206114 39.952336,116.202939 39.952007,116.192467 39.950625,116.183283 39.950099,116.1741 39.949737,116.17101 39.936148",
            "三里屯商圈": "116.461812 39.952793,116.454645 39.957497,116.443745 39.948286,116.443487 39.923541,116.446835 39.923211,116.459967 39.923277,116.461855 39.923244,116.462371 39.929465,116.461812 39.952793",
            "CBD商圈": "116.461706 39.90438,116.49003 39.905664,116.490115 39.914584,116.490115 39.921233,116.49003 39.923076,116.486767 39.92301,116.482304 39.923372,116.473636 39.923471,116.466254 39.923405,116.461447 39.923471,116.461706 39.90438",
            "通州经济开发核心区商圈": "116.655423 39.923077,116.65817 39.902273,116.656025 39.897664,116.657311 39.89233,116.695592 39.892659,116.700313 39.894437,116.711986 39.903919,116.70984 39.913795,116.708724 39.923998,116.655423 39.923077",
            "丽泽商圈": "116.282804 39.865605,116.28392 39.844455,116.286237 39.840566,116.296451 39.841884,116.319968 39.843994,116.321299 39.853449,116.338358 39.855475,116.343229 39.858819,116.343916 39.868273,116.348722 39.868371,116.350438 39.877331,116.32117 39.877067,116.320913 39.884543,116.31027 39.884049,116.295078 39.879504,116.294477 39.866462,116.282804 39.865605",
            "未来科技城商圈": "116.519589 40.034591,116.529632 40.034854,116.533923 40.042608,116.539502 40.052989,116.54079 40.0545,116.522337 40.059032,116.519589 40.034591",
            "中关村科技城商圈": "116.339686 39.976689,116.338055 39.988757,116.337196 40.008778,116.325266 40.020216,116.287157 40.01338,116.289131 40.002007,116.294968 39.997601,116.295998 39.993262,116.29943 39.990105,116.301748 39.97432,116.304924 39.975505,116.339686 39.976689",
            "亚奥商圈": "116.399285 40.034148,116.352249 40.026129,116.377827 39.991417,116.381432 39.976883,116.380573 39.968201,116.385294 39.968036,116.385252 39.965915,116.387805 39.966038,116.388223 39.963403,116.394784 39.963335,116.397311 39.96353,116.403619 39.957346,116.405314 39.957412,116.40599 39.961918,116.407744 39.962,116.40761 39.973594,116.410829 39.973824,116.411333 39.962256,116.414278 39.962169,116.414248 39.959165,116.424862 39.959451,116.450783 40.001413,116.456277 40.016861,116.43602 40.022317,116.404005 40.022448,116.399285 40.034148"
        },
        "poi_list": {
            "住宿高端": "100102|100103",
            "住宿低端": "100105",
            "休闲娱乐KTV": "080302",
            "休闲娱乐电影院": "080601",
            "休闲娱乐健身中心": "080111",
            "休闲娱乐游戏厅": "080305",
            "生活服务美容美发": "071100",
            "生活服务洗衣店": "071500",
            "生活服务药房": "090601",
            "生活服务医疗保健用品": "090602",
            "培训培训机构": "141400",
            "培训成人教育": "141205",
            "购物书店": "061205",
            "购物便利店": "060200",
            "购物书店": "061205",
            "购物超市": "060400",
            "美食快餐厅": "050300",
            "美食西餐": "050200"
        }
    }
    // 初始化高德地图的 key 和插件
    window.VueAMap.initAMapApiLoader({
        key: '05ed45de102d7a3f4723bae95b8b04d5',
        plugin: ['Autocomplete', 'PlaceSearch', 'Scale', 'OverView', 'ToolBar', 'MapType', 'PolyEditor', 'AMap.CircleEditor'],
        // 默认高德 sdk 版本为 1.4.4
        v: '1.4.4'
    });

    let amapManager = new VueAMap.AMapManager();
    module.exports = {
        data: function () {
            return {
                amapManager,
                zoom: 12,
                center: [],
                markers: [],
                resultData: [],
                pio_path_points: '',
                pio_keywords: '',
                search_type: '',
                pager_conf:{
                    count: 0,
                    page_size: 5,
                },
                events: {
                    init: (o) => {
                        console.log(o.getCenter())
                        o.getCity(result => {
                            console.log(result)
                        })
                    },
                    'moveend': () => {
                    },
                    'zoomchange': () => {
                    },
                    'click': (e) => {
                        this.polygon.path.push([e.lnglat.lng, e.lnglat.lat])
                        console.log(e)
                    }
                },
                polygon: {
                    draggable: false,
                    path: [],
                    events: {
                        click: () => {
                        },
                    }
                },
                markerEvents: {
                    click(e) {

                    }
                },
                plugin: ['ToolBar', {
                    pName: 'MapType',
                    defaultType: 0,
                    events: {
                        init(o) {
                            console.log(o);
                        }
                    }
                }]
            };
        },

        methods: {
            onPageChange(page){
                this.searchByPolygon(page);
            },
            getMarkerContent (item, width, height, isRotate = false) {
                const bgRoate = isRotate ? 'transform: rotate(45deg);' : ''
                const txRotate = isRotate ? 'transform: rotate(-45deg);' : ''
                const backgroundColor = '#0893FF'
                const content = `<div style="display: flex;
                                      justify-content: center;
                                      align-items: center;
                                      height: ${width}px;
                                      width: ${height}px;
                                      border-radius: .05rem;
                                      ${bgRoate}
                                      font-family: Arial-BoldMT;
                                      font-size: 16px;
                                      color: #FFFFFF;
                                      box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.30);
                                      background-color: ${backgroundColor};">
                                         <div style="${txRotate}"> ${item.order} </div>
                           </div>`
                return content
            },
            clearPath() {
                this.polygon.path = []
                this.markers = []
                this.resultData=[]
            },
            addMarker(lng, lat, order, name, address, type) {
                this.markers.push({
                    location: [lng, lat],
                    order,
                    name,
                    address,
                    type
                });
                this.resultData.push({
                    location: [lng, lat],
                    order,
                    name,
                    address,
                    type
                })
            },
            resolveResult(status, result) {
                console.log(status)
                console.log(result)
                this.resultData = [];
                this.markers = [];
                this.pager_conf.count = result.poiList.count
                this.pager_conf.pageSize = result.poiList.pageSize
                result.poiList.pois.forEach(
                    (item, index) => {
                        this.addMarker(
                            item.location.lng, item.location.lat, index,
                            item.name, item.address, item.type
                        );
                    }
                )
            },
            searchByPolygon(pageIndex=1, search_path=undefined, search_type='',  callback=undefined) {
                var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                    pageSize: 50, // 单页显示结果条数
                    pageIndex: pageIndex, // 页码
                    city: "010", // 兴趣点城市
                    citylimit: true,  //是否强制限制在设置的城市内搜索
                    autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
                    type:search_type,
                });
                if(!callback){
                    callback = this.resolveResult
                }
                if(!search_path){
                    let search_path = this.polygon.path
                }
                placeSearch.searchInBounds('', search_path, callback);
            },
            searchByPio(){
                this.polygon.path = this.parsePath(this.pio_path_points)
                for(let pathTitle in global_json.path_list){
                    let pathString = global_json.path_list[pathTitle]

                    for(let poiTitle in global_json.poi_list){
                        let poiValue = global_json.poi_list[poiTitle]

                        this.searchByPolygon(1, this.parsePath(pathString), poiValue, (status, result)=>{
                            console.log(status)
                            console.log(result)
                            result.poiList.pois.forEach(
                                (item, index) => {
                                    console.log(item)
                                }
                            )
                        })
                    }
                }
            },
            parsePath(pathStr){
                let ret = [];
                let rowArr = pathStr.split(',')
                rowArr.forEach(ele=>{
                    if(ele.length>0){
                        ret.push(ele.split(' '));
                    }
                })
                return ret;
            },
        },
        mounted() {
        },
    };
</script>

<style scoped lang="scss">
    .el-card {
        margin-top: 20px;
        .el-row {
            .el-col {
                margin-left: 10px;
            }
        }
    }
</style>

<style lang="scss">

</style>