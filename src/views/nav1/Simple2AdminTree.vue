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
        <br/>
        <el-col :span="24" style="padding: 0px;">
            <el-tree
                    :span="24"
                    :data="datas"
                    show-checkbox
                    node-key="id"
                    default-expand-all
                    :expand-on-click-node="false"
                    :render-content="renderContent">
            </el-tree>
        </el-col>

        <!--工具条-->
        <!--<el-col :span="24" class="toolbar" v-if="showopt">-->
        <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
        <!--<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"-->
        <!--:total="total" style="float:right;">-->
        <!--</el-pagination>-->
        <!--</el-col>-->


        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
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
    import util from "../../common/js/util"
    import {
        getDataListPage,
        removeData,
        batchRemoveData,
        editData,
        editJsonData,
        addData,
    } from "../../api/api";

    export default {
        data() {
            return {
                filters: {
                    name: ""
                },
                entityname: "",
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
            renderContent(h, {node, data, store}) {
                let showText = data.is_show === 1?"隐藏": "显示";
                let showStyle = {color: 'gray'};
                if(data.is_show){
                    showStyle.color='black';
                } else {
                    showStyle.color = 'gray';
                }
                return (
                    <span style="flex: 1;
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                font-size: 14px;
                                padding-right: 8px;">
                        <span style={showStyle}>{data.label}</span>
                        <span>
                            <el-button size="mini" type="text" disabled={data.disableUp} on-click={() => this.handleUp(node, data)}>上移</el-button>
                            <el-button size="mini" type="text" disabled={data.disableDown}
                                       on-click={() => this.handleDown(node, data)}>下移</el-button>
                            <el-button size="mini" type="text"
                                       on-click={() => this.toggleShow(node, data)}>
                                { showText }
                            </el-button>
                            <el-button size="mini" type="text"
                                       on-click={() => this.handleAdd(node, data)}>增加</el-button>
                            <el-button size="mini" type="text"
                                       on-click={() => this.handleDel(node, data)}>删除</el-button>
                        </span>
                    </span>
                );
            },
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
                    let databody = res.data.data;
                    this.total = databody.total;
                    this.datas = this.handleData(databody.list);
                    console.log("result", this.datas);

                    this.listLoading = false;
                });
            },
            //删除
            handleDel: function (node, data) {
                this.$confirm("确认删除该记录吗?", "提示", {
                    type: "warning"
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: data.id};
                    removeData(this.entityname, para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: "删除成功",
                            type: "success"
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
            handleAdd: function (node, parentNodeData) {
                this.addFormVisible = true;
                this.addForm = this.getCleanEntity(parentNodeData);
                console.log("clean parentNode", parentNodeData);
            },
            /**
             * 上移一个
             */
            handleUp: function (node, nodeData) {
                let updateDataParent = this.datas.find(ele=>ele.id===nodeData.parent_id);
                let  updateDataChildren = [];
                if(nodeData.parent_id === 0){
                    updateDataChildren = this.datas.filter(ele=>ele.parent_id === 0);
                } else {
                    updateDataChildren = updateDataParent.children;
                }
                let lastElement = updateDataChildren[0];
                updateDataChildren.forEach((element, index) => {
                    if (lastElement === null || (element.order < nodeData.order && element.order > lastElement.order)) {
                        lastElement = element;
                    }
                });
                this.switchOrder(nodeData, lastElement);
            },
            /**
             * 下移一个
             */
            handleDown: function (node, nodeData) {
                let updateDataParent = this.datas.find(ele=>ele.id===nodeData.parent_id);
                let  updateDataChildren = [];
                if(nodeData.parent_id === 0){
                    updateDataChildren = this.datas.filter(ele=>ele.parent_id === 0);
                } else {
                    updateDataChildren = updateDataParent.children;
                }
                let lastElement = updateDataChildren[updateDataChildren.length-1];
                updateDataChildren.forEach((element, index) => {
                    // console.log("nodeData", nodeData);
                    // console.log("element", element);
                    // console.log("lastElement", lastElement);
                    if (lastElement === null || (element.order > nodeData.order && element.order < lastElement.order)) {
                        lastElement = element;
                    }
                });
                this.switchOrder(nodeData, lastElement);
            },
            switchOrder: function (nodeData, lastElement) {
                let pre = {
                    id: nodeData.id,
                    order: lastElement.order
                };
                let next = {
                    id: lastElement.id,
                    order: nodeData.order
                };
                let para = [pre, next];
                console.log(para);

                editJsonData(this.entityname, {"json": para}).then((res) => {
                    this.editLoading = false;
                    this.$message({
                        message: "提交成功",
                        type: "success"
                    });
                    this.getDatas();
                });
            },
            /**
             * 切换显示状态
             */
            toggleShow: function (node, nodeData) {
                editJsonData(this.entityname, {"json": [{id:nodeData.id, is_show:!nodeData.is_show}]}).then((res) => {
                    this.editLoading = false;
                    this.$message({
                        message: "提交成功",
                        type: "success"
                    });
                    this.getDatas();
                });
            },
            goLink: function (link) {
                this.$router.push(link);
            },
            //编辑
            editSubmit: function () {
                console.log(this.$refs.editForm)
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            para.birth = (!para.birth || para.birth == "") ? "" : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");
                            editData(this.entityname, para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: "提交成功",
                                    type: "success"
                                });
                                this.$refs["editForm"].resetFields();
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
                        this.$confirm("确认提交吗？", "提示", {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            console.log("addparam", para)
                            addData(this.entityname, para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: "提交成功",
                                    type: "success"
                                });
                                this.$refs["addForm"].resetFields();
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

                this.$confirm("确认删除选中记录吗？", "提示", {
                    type: "warning"
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = ids;
                    batchRemoveData(this.entityname, para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        this.getDatas();
                    });
                }).catch(() => {

                });
            },
            getCleanEntity: function (parentNodeData) {
                let obj = {};
                Object.keys(this.datas[0]).forEach(
                    key => {
                        obj[key] = "";
                    }
                );
                console.log("entity", parentNodeData);
                if (parentNodeData) {
                    obj.parent_id = parentNodeData.id;
                    obj.level = parentNodeData.level + 1;
                } else {
                    obj.parent_id = 0;
                    obj.level = 0;
                }
                return obj;
            },
            handleData: function(data){
                let first = this.findFirst(data);
                first.disableUp = true;
                let last = this.findLast(data);
                last.disableDown = true;
                data.forEach(element=>{
                    if(element.children && element.children.length>0){
                        this.handleData(element.children);
                    }
                });
                console.log(last);
                return data;
            },
            findFirst: function(data){
                let maxItem = data[0];
                data.forEach(element=>{
                    if(maxItem.order > element.order){
                        maxItem = element;
                    }
                });
                return maxItem;
            },
            findLast: function(data){
                let maxItem = data[0];
                data.forEach(element=>{
                    if(maxItem.order < element.order){
                        maxItem = element;
                    }
                });
                return maxItem;
            },

        },
        mounted() {
            this.entityname = this.$route.meta.entityname;
            this.fieldmap = this.$route.meta.fieldmap;
            // console.log('map', this.fieldmap);
            this.fieldmap_fortable = this.$route.meta.fieldmap;
            this.rules = this.$route.meta.rules;
            if (this.$route.meta.showopt !== undefined) {
                this.showopt = this.$route.meta.showopt
            }
            console.log(this.showopt);
            this.getDatas();
            if (this.contains_location) {
                this.$store.dispatch("refreshLocations");
            }
        },
        computed: {
            table_fieldmap: function () {
                // console.log('map', this.fieldmap);
                if (this.fieldmap.length) {
                    // console.log("fieldmap", this.fieldmap)
                    return this.fieldmap.filter((item) => {
                        if (!item.for_dialog) {
                            return true;
                        }
                    })
                } else {
                    return [];
                }
            },
            dialog_fieldmap: function () {
                if (this.fieldmap.length) {
                    // console.log("fieldmap", this.fieldmap)
                    return this.fieldmap.filter((item) => {
                        if (!item.for_table) {
                            return true;
                        }
                    })
                } else {
                    return [];
                }
            },
            locations: function () {
                return this.$store.state.locations;
            },
            contains_location: function () {
                if (this.fieldmap.length) {
                    // console.log("fieldmap", this.fieldmap)
                    return this.fieldmap.find((item) => {
                        if (item.type == "location") {
                            return true;
                        } else {
                            return false;
                        }
                    })
                } else {
                    return [];
                }
            }
        }
    }

</script>

<style scoped>
    /*.custom-tree-node {*/
    /*flex: 1;*/
    /*display: flex;*/
    /*align-items: center;*/
    /*justify-content: space-between;*/
    /*font-size: 14px;*/
    /*padding-right: 8px;*/
    /*}*/
</style>