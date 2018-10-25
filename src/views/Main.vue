<template>
    <section>
        <el-row>
            <ValueCardGroup :data="base_data"></ValueCardGroup>
        </el-row>
        <el-row>
            <ValueCardGroup :data="slide_data"></ValueCardGroup>
        </el-row>
        <el-row>
            <el-select v-model="selected_year" @change="getChartData">
                <el-option v-for="item in limite_data" :label="item" :value="item"></el-option>
            </el-select>

            <template v-for="item in charts">
                <el-col :span="24">
                    <SingleChart
                            :title="item.title"
                            :chart_type="item.type"
                            :x_name="item.x_name"
                            :y_name="item.y_name"
                            :x_axis="item.x_data"
                            :x_data="item.y_data"
                            :is_loading="chart_loading"
                            :more_info="item.more_info"
                    ></SingleChart>
                </el-col>
            </template>
        </el-row>
        <HomeBody :table_list="tables"></HomeBody>
    </section>
</template>

<script>
    import NumberCard from './components/NumberCard';
    import ValueCard from './components/ValueCard';
    import HomeBody from './components/home/HomeBody';
    import SingleChart from './components/SingleChart.vue';
    import ValueCardGroup from './components/ValueCardGroup.vue'

    import {
        getMainpageCards,
        getAssignedTeam,
        getUnassignedTeam,
        getCheckedTeam,
        getUncheckedTeam,
        getCharts,
        getHomeTables,
    } from '../api/api'

    import TeamAssign from '../data/home/team_assign';
    // import echarts from 'echarts';
    const echarts = ()=>import('echarts')
    import Vue from 'vue';

    export default {
        data() {
            let init_charts = [];
            for (let i = 0; i < 1; i++) {
                init_charts.push({
                    type: 'line',
                    title: "",
                    x_name: "",
                    y_name: "",
                    y_data: [],
                    x_data: [],
                    more_info: [
                        {
                            key: "",
                            value: "",
                            scheme: "",
                        }
                    ],
                });
            }


            return {
                base_data: [],
                slide_data: [],
                charts: init_charts,
                tables: [],
                chartLine: null,
                chart_loading: true,
                limite_data: [2017, 2016],
                selected_year: 2017,
            }
        },
        components: {NumberCard, HomeBody, ValueCard, SingleChart, ValueCardGroup},
        methods: {
            getData(dataitem){
                console.log("select" + dataitem);
            },
            getChartData: function () {
                this.chart_loading = true;
                getCharts().then((res) => {
                        let chartdata = res.data.data.data;
                        for (let i = 0; i < chartdata.length; i++) {
                            Vue.set(this.charts, i, chartdata[i]);
                        }
                        this.chart_loading = false;
                    }
                )
            },
            getData: function () {
                getMainpageCards().then((res) => {
                        this.base_data = res.data.data.base_data;
                        this.slide_data = res.data.data.slide_data;
                    }
                )

                getHomeTables().then((res) => {
                    this.tables = res.data.data.tables;
                })
            },
        },
        computed: {
            teamassigns: function () {
                return TeamAssign
            },
        },
        mounted(){
            this.getData();
            this.getChartData();
        }
    }

</script>

<style scoped lang="scss">
    @import '~scss_vars';

    .el-row {
        margin-bottom: 20px;

        last-child {
            margin-bottom: 0;
        }

    }

    .el-col {
        border-radius: 4px;
        margin-top: 10px;

        .value-card {
            margin-right: 5px;
        }

        .el-card {
            margin-right: 5px;
        }
        .title {
            text-align: center;
            color: #48576a;
        }
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 100px;
        margin-left: 10px;
        margin-top: 10px;
        padding: 10px;
    }

    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>