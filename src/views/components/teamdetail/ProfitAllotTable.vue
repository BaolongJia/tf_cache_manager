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
                label="利润分配"
        ></el-table-column>
        <el-table-column
                prop="value"
                label=""
        ></el-table-column>
    </el-table>
</template>

<script>
    export default {
        data: function () {
            return {}
        },
        props: {
            dijie: 0,
            quanpei: 0,
            chedui: 0,
            gongsi: 0,
        },
        computed:{
            baseInfo:function () {
                return [{
                    key: '地接',
                    value: this.dijie,
                }, {
                    key: '全陪',
                    value: this.quanpei,
                }, {
                    key: '车队',
                    value: this.chedui,
                }, {
                    key: '公司',
                    value: this.gongsi,
                }]
            }
        },
    }
</script>

<style scoped>

</style>