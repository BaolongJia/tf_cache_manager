<template>
    <section>
        <div style="display:flex; flex-direction: row; flex-wrap: nowrap;">
            <div>
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;" v-if="false">
                    <el-form :inline="true" :model="filters">
                        <el-form-item>
                            <el-input v-model="filters.name" placeholder="姓名"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="getUsers">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleAdd">新增</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <!--列表-->
                <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                          style="width: 100%;">
                    <el-table-column type="selection" width="35">
                    </el-table-column>
                    <el-table-column type="index" width="30">
                    </el-table-column>
                    <el-table-column prop="orderId" label="订单号" width="100" sortable>
                    </el-table-column>
                    <el-table-column prop="name" label="用户名" width="100" sortable>
                    </el-table-column>
                    <el-table-column prop="phone" label="手机" width="150" sortable>
                    </el-table-column>
                    <el-table-column prop="payStatus" label="支付状态" width="150" sortable>
                    </el-table-column>
                    <el-table-column prop="serviceStatus" label="服务状态" width="150" sortable>
                    </el-table-column>
                    <el-table-column prop="sourceId" label="商家id" width="150" sortable>
                    </el-table-column>
                    <el-table-column prop="sourceName" label="商家名称" width="150" sortable>
                    </el-table-column>
                    <el-table-column label="操作" min-width="150">
                        <template scope="scope" >
                            <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
                            <el-button size="small" @click="goDetail(scope.$index, scope.row)">详情</el-button>
                            <!--<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除-->
                            <!--</el-button>-->
                        </template>
                    </el-table-column>
                </el-table>

                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
                    <el-pagination class="pageIndicator" layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"
                                   :total="total">
                    </el-pagination>
                </el-col>
            </div>
        </div>
    </section>
</template>

<script>
    import util from "../../common/js/util"
    import {
        getUserListPage,
        removeUser,
        batchRemoveUser,
        editData,
        addProdData,
        getDepartmentList,
        getCompanyList,
        getDataListPage, requestUserList,requestOrderList
    } from "../../api/api";

    export default {
        data() {
            return {
                //过滤字段
                filters: {
                    uid: ""
                },
                listLoading:false,
            }
        },
        methods: {
            goDetail: function(index, row){
                this.$router.push('/user/health/'+row.uid)
            },
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex === 1 ? "男" : row.sex === 0 ? "女" : "未知";
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers();
            },
            //获取订单列表
            getOrders(){
                let params ={

                };
                this.listLoading = true;
                requestOrderList(this,params).then(
                    data =>{
                        this.listLoading = false;
                    }
                );

            },
            //获取用户列表
            getUsers() {
                let para = {
                    page: this.page,
                    name: this.filters.name,
                };
                this.listLoading = true;
                requestUserList(this, para).then((data) => {
                    this.total = data.length;
                    this.users = data;
                    this.listLoading = false;
                });
            }
        },
        mounted() {
            this.getUsers();
        }
    }

</script>

<style scoped>

    .pageIndicator{
        float: left;
        position: relative;
        left: 40%;
    }
</style>