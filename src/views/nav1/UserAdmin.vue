<template>
    <section>
        <div style="display:flex; flex-direction: row; flex-wrap: nowrap;">
            <div class="departmentCol" style="width:400px">
                <el-tree
                        :data="departmentDatas"
                        style="width:200px"
                        @node-click="onDepartmentSelect"
                        :expand-on-click-node="false"
                        default-expand-all
                >

                </el-tree>
            </div>
            <div>
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
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
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type="index" width="60">
                    </el-table-column>
                    <el-table-column prop="name" label="姓名" width="100" sortable>
                    </el-table-column>
                    <el-table-column prop="gender" label="性别" width="100" sortable>
                    </el-table-column>
                    <el-table-column prop="mobile" label="手机" width="150" sortable>
                    </el-table-column>
                    <el-table-column prop="nickname" label="用户名" width="100" sortable>
                    </el-table-column>
                    <el-table-column prop="rule" label="角色" width="80" sortable>
                    </el-table-column>
                    <el-table-column prop="department" label="部门" width="100" sortable>
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间" width="100" sortable>
                    </el-table-column>
                    <el-table-column label="操作" min-width="150">
                        <template scope="scope">
                            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
                    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"
                                   :total="total" style="float:right;">
                    </el-pagination>
                </el-col>
            </div>
        </div>


        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="nickname">
                    <el-input v-model="editForm.nickname" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input disabled type="password" v-model="editForm.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-radio-group v-model="editForm.gender">
                        <el-radio class="radio" label="male">男</el-radio>
                        <el-radio class="radio" label="female">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="identify_no">
                    <el-input v-model="editForm.identify_no" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="部门" prop="department_id">
                    <el-cascader
                            :props="departmentProps"
                            :options="departments"
                            v-model="editForm.department_id"
                            :show-all-levels="true"
                            placeholder="请选择部门"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="职务" prop="rule_id">
                    <el-select v-model="editForm.rule_id" placeholder="请选择职务">
                        <el-option v-for="item in jobRules" :label="item.name" :value="item.id" :key="item.id">
                            {{ item.name }}
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="rules" ref="addForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="nickname">
                    <el-input v-model="addForm.nickname" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="addForm.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-radio-group v-model="addForm.gender">
                        <el-radio class="radio" label="male">男</el-radio>
                        <el-radio class="radio" label="female">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="identify_no">
                    <el-input v-model="addForm.identify_no" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="部门" prop="department_id">
                    <el-cascader
                            :options="departments"
                            v-model="addForm.department_id"
                            :show-all-levels="true"
                            placeholder="请选择部门"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="职务" prop="rule_id">
                    <el-select v-model="addForm.rule_id" placeholder="请选择职务">
                        <el-option v-for="item in jobRules" :label="item.name" :value="item.id" :key="item.id">
                            {{ item.name }}
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
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
        getDataListPage,
    } from "../../api/api";

    export default {
        data() {
            return {
                filters: {
                    name: ""
                },
                departmentDatas: [],
                users: [],
                departments: [],
                jobRules: [],
                companies: [],
                total: 0,
                page: 1,
                listLoading: false,
                treeDepartment: "",
                sels: [],//列表选中列
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: "请输入姓名", trigger: "blur"}
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    name: "",
                    nickname: "",
                    gender: "male",
                    mobile: "",
                    identify_no: "",
                    birthday: "",
                    department_id: [],
                    rule_id: "",
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: "请输入姓名", trigger: "blur"}
                    ]
                },
                //新增界面数据
                addForm: {
                    name: "",
                    nickname: "",
                    gender: "male",
                    mobile: "",
                    identify_no: "",
                    department_id: [],
                    rule_id: "",
                },
                departmentProps: {
                    value: "id",
                    label: "label",
                },
                rules: {
                    name: [
                        {required: true, message: "请输入姓名", trigger: "blur"}
                    ],
                    nickname: [
                        {required: true, message: "请输入用户名", trigger: "blur"}
                    ],
                    password: [
                        {required: true, message: "请输入密码", trigger: "blur"}
                    ],
                    phone: [
                        {required: true, message: "请输入电话", trigger: "blur"},
                        {pattern: /^1\d{10}$/, message: "请输入正确的电话", trigger: "blur"}
                    ],
                    address: [{required: true, message: "请输入地址", trigger: "blur"}],
                    id_card_num: [
                        {required: true, message: "请输入身份证", trigger: "blur"},
                        {pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: "请输入正确的身份证", trigger: "blur"}
                    ],
                    // guide_card_num: [
                    //     {required: true, message: "请输入导游证号", trigger: "blur"},
                    //     {pattern: /D-\d{4}-\d{6}/, message: "请输入正确的导游证号", trigger: "blur"}
                    // ],
                    department_id: [
                        {
                            validator(rule, value, callback, source, options) {
                                var errors = [];
                                console.log(value);
                                console.log(source);
                                if (source.department_id.length === 0) {
                                    errors.push(new Error("请选择部门"))
                                }
                                console.log(errors);
                                callback(errors);
                            }
                        }
                    ],
                    rule_id: [
                        {required: true, message: "请选择职务", trigger: "change"}
                    ],
                    company_id: [
                        {required: true, message: "请选择公司", trigger: "change"}
                    ]
                }

            }
        },
        methods: {
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers();
            },
            onDepartmentSelect: function (data, node, ele) {
                this.getUsers(data.id);
            },
            //获取用户列表
            getUsers(treeDepartmentId) {
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
                //NProgress.start();
                getDataListPage('user', para).then((res) => {
                    this.total = res.data.data.total;
                    this.users = res.data.data.list;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            getDepartments() {
                getDepartmentList().then((res) => {
                    this.departments = res.data.data.list.map(ele => {
                        ele.value = ele.id;
                        return ele;
                    });
                });
            },
            getJobRules() {
                getDataListPage("rule").then((res) => {
                    this.jobRules = res.data.data.list;
                    console.log("rules", this.jobRules);
                });
            },
            getCompanies() {
                getCompanyList().then((res) => {
                    this.companies = res.data.data;
                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm("确认删除该记录吗?", "提示", {
                    type: "warning"
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.id};
                    removeUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        this.getUsers();
                    });
                }).catch(() => {

                });
            },
            getDepartment: function () {
                let para = {
                    page: this.page,
                    name: "",
                };
                this.listLoading = true;
                getDataListPage("department", para).then((res) => {
                    let databody = res.data.data;
                    this.departmentDatas = databody.list;
                    // this.listLoading = false;
                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                console.log("row", row);
                let result=[];
                this.getTreeArrayById(row.department_id, this.departments, result);
                this.editForm = Object.assign({}, row, {department_id:result});
                console.log(this.editForm);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    name: "",
                    sex: -1,
                    address: "",
                    phone: "",
                    id_card_num: "",
                    guide_card_num: "",
                    department_id: [],
                    rule_id: "",
                    company_id: "",
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {}).then(() => {
                            this.editLoading = true;
                            // console.log(this.editForm);
                            // console.log(this.editForm.department_id);
                            // console.log(this.editForm.department_id[this.editForm.department_id.length-1]);
                            let departments = this.editForm.department_id;
                            let para = Object.assign({}, this.editForm, {department_id: departments[departments.length - 1]});
                            editData("user", para).then((res) => {
                                this.editLoading = false;
                                this.$message({
                                    message: "提交成功",
                                    type: "success"
                                });
                                this.$refs["editForm"].resetFields();
                                this.editFormVisible = false;
                                this.getUsers();
                            });
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            para.department_id = para.department_id[0]
                            console.log(para)
                            addProdData("user", para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: "提交成功",
                                    type: "success"
                                });
                                this.$refs["addForm"].resetFields();
                                this.addFormVisible = false;
                                this.getUsers();
                            });
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            getTreeArrayById: function (id, tree, result) {
                if (id >= 0) {
                    let source = this.findTreeNode(id, this.departments)
                    console.log("did", id, source);
                    if (source) {
                        result.unshift(id);
                        this.getTreeArrayById(source.parent_id, tree, result);
                    }
                }
            },
            findTreeNode: function (id, tree) {
                if (tree) {
                    for(let index=0; index<tree.length; index++){
                        let current = tree[index];
                        if(current && current.id===id){
                            return tree[index];
                        } else {
                            if(current.children && current.children.length>0){
                                return this.findTreeNode(id, current.children);
                            }
                        }
                    }
                }
                return undefined;
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
                        this.getUsers();
                    });
                }).catch(() => {

                });
            },
        },
        mounted() {
            this.getUsers();
            this.getDepartments();
            this.getJobRules();
            this.getCompanies();
            this.getDepartment();
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