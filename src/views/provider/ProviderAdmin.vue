<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getProviders">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="datas" highlight-current-row v-loading="listLoading"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="id" label="id" width="60">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="100" sortable>
            </el-table-column>
            <el-table-column prop="type_name" label="类型" width="100" sortable>
            </el-table-column>
            <el-table-column prop="status_name" label="状态" width="150" sortable>
            </el-table-column>
            <el-table-column prop="create_time" label="新增" width="100" sortable>
            </el-table-column>
            <el-table-column prop="supervisor_name" label="负责人" width="100" sortable>
            </el-table-column>
            <el-table-column prop="supervisor_mobile" label="负责人电话" width="120" sortable>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" width="100" sortable>
            </el-table-column>
            <el-table-column label="操作" min-width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button  size="small" @click="handleEditUser(scope.$index, scope.row)">用户管理</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

    </section>
</template>

<script>
    import util from "../../common/js/util"
    import {
        batchRemoveUser,
        getDataListPage,
        removeData
    } from "../../api/api";

    export default {
        data() {
            return {
                filters: {
                    name: ""
                },
                datas: [],
                departments: [],
                jobRules: [],
                companies: [],
                total: 0,
                page: 1,
                listLoading: false,
                treeDepartment: "",
                sels: [],//列表选中列
                editFormVisible: false,//编辑界面是否显示
                departmentProps: {
                    value: "id",
                    label: "label",
                },

            }
        },
        methods: {
            handleEdit: function(index, data){
                this.$router.push({path:'/provider/detail/'+data.id});
            },
            handleEditUser: function(index, data){
                this.$router.push({path:'/provider_user/'+data.id});
            },
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getProviders();
            },
            handleAdd(){
                this.$router.push({path:'/provider/detail/'});
            },
            //获取用户列表
            getProviders(treeDepartmentId) {
                if (treeDepartmentId === 0 || !treeDepartmentId) {
                    treeDepartmentId = "";
                }
                console.log(treeDepartmentId);
                let para = {
                    page: this.page,
                    name: this.filters.name,
                    department: treeDepartmentId,
                };
                this.listLoading = true;
                getDataListPage("provider", para).then((res) => {
                    let data =  res.data.data;
                    this.total = data.total;
                    this.datas = this.mapData(data.list);
                    this.listLoading = false;
                });
            },
            mapData: function (list) {
                return list.map(ele=>{
                    if(ele.type_id === 0){
                        ele.type_name='个人';
                    } else {
                        ele.type_name='企业';
                    }

                    if(ele.status_id===0){
                        ele.status_name='无效';
                    } else {
                        ele.status_name='有效';
                    }
                    return ele;
                })
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm("确认删除该记录吗?", "提示", {
                    type: "warning"
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.id};
                    removeData('provider', para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        this.getProviders();
                    });
                }).catch(() => {

                });
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm("确认删除选中记录吗？", "提示", {
                    type: "warning"
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {ids: ids};
                    batchRemoveUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        this.getProviders();
                    });
                }).catch(() => {

                });
            },
        },
        mounted() {
            this.getProviders();
        }
    }

</script>

<style scoped>
    .departmentCol {
        background: #f2f2f2;
        padding: 10px;
        margin: 10px 0px;
    }
</style>