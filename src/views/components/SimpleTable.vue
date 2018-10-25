/**
* 简单表格组件
* Created by xiangc on 2017/7/5.
*/
<template>
    <!--列表-->
    <div>
        <p class="table_title">{{ title }}</p>
        <el-table :data="srcdata" highlight-current-row style="width: 100%;" @row-click="row_click">
            <el-table-column :prop="fieldmap[0].key" :label="fieldmap[0].name" :min-width="fieldmap[0].width">
            </el-table-column>

            <el-table-column v-for="item in fieldmap.slice(1)" :prop="item.key" :key="item.key" :label="item.name"
                             :width="item.width" 
            >
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {}
        },
        props: {
            config: Object,
            srcdata: Array,
            title: String,
        },
        computed: {
            fieldmap: function () {
                return this.config.fieldmap
            }
        },
        methods: {
            row_click:function (row) {
                this.$router.push(row.scheme);
            }
        },
        mounted: function () {
        }
    }
</script>

<style scoped>
    .table_title {
        padding: 10px;
        color: #475669;
    }
</style>