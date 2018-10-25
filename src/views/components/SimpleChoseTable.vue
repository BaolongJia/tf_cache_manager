/**
* 简单表格组件
* Created by xiangc on 2017/7/5.
*/
<template>
    <section>
        <!--工具条-->
        <el-col :span="6" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="名字"></el-input>
                </el-form-item>
            </el-form>
        </el-col>
        <!--工具条-->
        <el-col :span="18" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item label="名字">
                    <template v-if="show_input">
                        <el-input v-model="selected_item.name" placeholder="名字"></el-input>
                    </template>
                    <template v-else>
                        {{ selected_item.name }}
                    </template>
                </el-form-item>
                <el-form-item label="电话">
                    <template v-if="show_input">
                        <el-input v-model="selected_item.phone" placeholder="电话"></el-input>
                    </template>
                    <template v-else>
                        {{ selected_item.phone }}
                    </template>
                </el-form-item>
                <el-button type="info" class="button" style="float:right; margin-left: 10px;"
                           @click.native="toOhter">其他
                </el-button>
                <el-button type="info" class="button" style="float:right"
                           @click.native="confirm">确定
                </el-button>
            </el-form>
        </el-col>
        <!--列表-->
        <div>
            <p class="table_title">{{ title }}</p>
            <el-table :data="filtered_data" highlight-current-row style="width: 100%;" @row-click="row_click">
                <el-table-column :prop="fieldmap[0].key" :label="fieldmap[0].name" :min-width="fieldmap[0].width">
                </el-table-column>

                <el-table-column v-for="item in fieldmap.slice(1)" :prop="item.key" :key="item.key" :label="item.name"
                                 :width="item.width">
                </el-table-column>
            </el-table>
        </div>
    </section>
</template>

<script>
    import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
    export default {
        components: {ElButton},
        data: function () {
            return {
                filters: {
                    name: "",
                },
                selected_item: {
                    name: "",
                }
            }
        },
        props: {
            config: Object,
            srcdata: Array,
            title: String,
            show_input: true,
            other_link: "",
        },
        computed: {
            fieldmap: function () {
                return this.config.fieldmap
            },
            filtered_data: function () {
                let result = [];
                if (this.filters.name) {
                    result = this.srcdata.filter(
                        (item) => {
                            return item.name.indexOf(this.filters.name) !== -1;
                        }
                    )
                } else {
                    result = this.srcdata;
                }
                return result;
            }
        },
        methods: {
            row_click: function (row) {
                this.selected_item = row;
            },
            confirm: function () {
                this.$emit("on_confirm", this.selected_item);
            },
            toOhter:function () {
                this.$router.push(this.other_link);
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