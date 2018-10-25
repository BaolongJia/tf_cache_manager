<template>
    <section class="chart-container">
        <div :id="random_id" style="width:100%; height:400px;"></div>
        <ValueCardGroup :data="more_info"></ValueCardGroup>
    </section>
</template>

<script>
    // import echarts from 'echarts'
    const echarts = ()=>import('echarts')
    import ValueCardGroup from './ValueCardGroup.vue'

    export default {
        data() {
            let randomid = "s" + Math.random();
            return {
                random_id: randomid,
                chartColumn: null,
            }
        },
        components: {ValueCardGroup},
        props: {
            title: {
                default: function () {
                    return "";
                }
            },
            chart_type: {
                default: function () {
                    return "line";
                }
            },
            x_name: {
                default: function () {
                    return "";
                }
            },
            y_name: {
                default: function () {
                    return "";
                }
            },
            x_data: {
                default: function () {
                    return [];
                }
            },
            x_axis: {
                default: function () {
                    return [];
                }
            },
            is_loading: {
                default: function () {
                    return true;
                }
            },
            more_info: {
                default: function () {
                    return []
                }
            }
        },
        methods: {
            drawColumnChart() {
                this.chartColumn = echarts.init(document.getElementById(this.random_id));
                console.log("type:" + this.chart_type);
                console.log("title:" + this.title);
//                setTimeout(() => {
//                    echatsInstance.setOption([option])
                this.chartColumn.setOption({
                    title: {text: this.title},
                    tooltip: {},
                    xAxis: {
                        data: this.x_axis
                    },
                    yAxis: {},
                    series: [{
                        name: this.title,
                        type: this.chart_type,
                        data: this.x_data
                    }]
                });
//                }, 500)

            },
            drawCharts() {
                this.drawColumnChart()
            },
        },

        mounted: function () {
            this.drawCharts()
        },
        watch: {
            title: function () {
                if (this.chartColumn) {
                    this.drawCharts();
                }
            },
            is_loading: function () {
                console.log("isloading0")
                if (this.chartColumn) {
                    console.log("isloading1" + this.is_loading);
                    if (this.is_loading) {
                        this.chartColumn.showLoading();
                    } else {
                        this.chartColumn.hideLoading();
                    }
                }
            }
        },
        updated: function () {
        }
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }

    /*.chart div {
        height: 400px;
        float: left;
    }*/

</style>
