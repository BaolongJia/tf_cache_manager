<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getDatas">查询</el-button>
                </el-form-item>
                <el-form-item v-if="showopt">
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="datas" tooltip-effect="dark" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55" v-if="showopt">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column :prop="table_fieldmap[0].key" :label="table_fieldmap[0].name"
                             :min-width="table_fieldmap[0].width" sortable>
            </el-table-column>

            <el-table-column v-for="item in table_fieldmap.slice(1)" :prop="item.key" :key="item.key" :label="item.name"
                             :width="item.width"
                             sortable>
            </el-table-column>

            <el-table-column label="操作" width="150" v-if="showopt">
                <template scope="scope">
                    <template v-if="scope.row.btn_group && scope.row.btn_group.length>0">
                        <el-button v-for="btn_item in scope.row.btn_group"
                                   size="small"
                                   @click="goLink(btn_item.link)">{{ btn_item.name }}
                        </el-button>
                    </template>
                    <template v-else>
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    </template>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar" v-if="showopt">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>


        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm">
                <template v-for="item in dialog_fieldmap">
                    <template v-if="!item.type">
                        <el-form-item :label="item.name" :prop="item.key">
                            <el-input v-model="editForm[item.key]" auto-complete="off"></el-input>
                        </el-form-item>
                    </template>
                    <template v-if="item.type == 'location'">
                        <el-form-item :label="item.name" :prop="item.key">
                            <el-select v-model="editForm[item.key]" placeholder="请选择地区">
                                <el-option v-for="item_location in locations" :label="item_location.name"
                                           :value="item_location.id" :key="item_location.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="rules" ref="addForm">
                <template v-for="item in dialog_fieldmap">
                    <template v-if="!item.type">
                        <el-form-item :label="item.name" :prop="item.key">
                            <el-input v-model="addForm[item.key]" auto-complete="off"></el-input>
                        </el-form-item>
                    </template>
                    <template v-if="item.type == 'location'">
                        <el-form-item :label="item.name" :prop="item.key">
                            <el-select v-model="addForm[item.key]" placeholder="请选择地区">
                                <el-option v-for="item_location in locations" :label="item_location.name"
                                           :value="item_location.id" :key="item_location.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    import {
        getDataListPage,
        removeData,
        batchRemoveData,
        editData,
        addData,
    } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                entityname: '',
                fieldmap: {},
                datas: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                //编辑界面数据
                editForm: {},

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                //新增界面数据
                addForm: {},
                rules: {},
                showopt: true
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getDatas();
            },
            //获取用户列表
            getDatas() {
                let para = {
                    page: this.page,
                    name: this.filters.name
                };
                this.listLoading = true;
                getDataListPage(this.entityname, para).then((res) => {
                    this.total = res.data.total;
                    this.datas = res.data.data.data;
                    this.listLoading = false;
                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    removeData(this.entityname, para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getDatas();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = this.getCleanEntity();
            },
            goLink: function (link) {
                this.$router.push(link);
            },
            //编辑
            editSubmit: function () {
                console.log(this.$refs.editForm)
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            editData(this.entityname, para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getDatas();
                            });
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            console.log(para)
                            addData(this.entityname, para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getDatas();
                            });
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id);

                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = ids;
                    batchRemoveData(this.entityname, para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getDatas();
                    });
                }).catch(() => {

                });
            },
            getCleanEntity: function () {
                let obj = {};
                Object.keys(this.datas[0]).forEach(
                    key => {
                        obj[key] = "";
                    }
                );
                return obj;
            }
        },
        mounted() {
            this.entityname = this.$route.meta.entityname;
            this.fieldmap = this.$route.meta.fieldmap;
            this.fieldmap_fortable = this.$route.meta.fieldmap;
            this.rules = this.$route.meta.rules;
            if (this.$route.meta.showopt !== undefined) {
                this.showopt = this.$route.meta.showopt
            }
            console.log(this.showopt);
            this.getDatas();
            if (this.contains_location) {
                this.$store.dispatch('refreshLocations');
            }
        },
        computed: {
            table_fieldmap: function () {
                return this.fieldmap.filter((item) => {
                    if (!item.for_dialog) {
                        return true;
                    }
                })
            },
            dialog_fieldmap: function () {
                return this.fieldmap.filter((item) => {
                    if (!item.for_table) {
                        return true;
                    }
                })
            },
            locations: function () {
                return this.$store.state.locations;
            },
            contains_location: function () {
                return this.fieldmap.find((item) => {
                    if (item.type == 'location') {
                        return true;
                    } else {
                        return false;
                    }
                })
            }
        }
    }

</script>

<style scoped>

</style>