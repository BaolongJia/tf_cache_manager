/**
* Created by xiangc on 2017/8/8.
*/
<template>
    <el-table
            :data="baseInfo"
            :span="24"
            :row-class-name="'row-class'"
    >
        <el-table-column
                prop="key"
                label="基础信息"
        ></el-table-column>
        <el-table-column
                prop="value"
                label=""
        ></el-table-column>
        <div class='helpme'  :data-watch-prop-1="xianjin" :data-watch-prop-2="qiandan" :data-watch-prop-3="shishou" :data-watch-prop-4="lirun"></div>
    </el-table>
</template>

<script>
    export default {
        data: function () {
            return {}
        },
        props: {
            xianjin: 0,
            qiandan: 0,
            shishou: 0,
            lirun: 0,
        },
        computed:{
            baseInfo:function () {
                return [{
                    key: '现金',
                    value: this.xianjin,
                }, {
                    key: '签单',
                    value: this.qiandan,
                }, {
                    key: '实收',
                    value: this.shishou,
                }, {
                    key: '利润',
                    value: this.lirun,
                }]
            }
        },
    }
</script>

<style scoped>

</style>