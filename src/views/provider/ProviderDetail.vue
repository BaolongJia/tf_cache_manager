/**
* Created by xiangc on 2017/7/25.
*/
<template>
    <section v-loading="loading">
        <el-form ref="detailForm" :rules="check_rules" :model="formData" label-position="right" label-width="100px">
            <!-- 基础信息 begin -->
            <el-card header="基础信息">

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="品牌名称" prop="name">
                            <el-input v-model="formData.name" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="品牌介绍" prop="description">
                            <el-input type="textarea" :rows="3" v-model="formData.description"
                                      auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-form-item label="品牌logo">
                        <el-upload
                                class="avatar-uploader"
                                :action="uploadPath"
                                :show-file-list="false"
                                :on-success="handleLogoFileSuccess"
                                :before-upload="beforeLogoFileUpload">
                            <img v-if="imageLogoUrl" :src="imageLogoUrl" class="avatar">
                            <i v-else class="el-upload el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="经营范围" prop="category_ids">
                            <template v-if="formData.category_ids.length>0">
                                {{ formData.category_names }} <br/>
                            </template>
                            <el-button type="primary" class="button"
                                       @click.native="chooseCagegory">选择
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="类型" prop="type_id">
                            <el-select v-model="formData.type_id" placeholder="请选择地区">
                                <el-option v-for="item in typeData" :label="item.value" :value="item.id" :key="item.id">
                                    {{ item.value }}
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="formData.type_id===1">
                    <img>
                    <el-col :span="11">
                        <el-form-item label="企业全称" prop="company_name">
                            <el-input v-model="formData.company_name" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="企业代码" prop="company_code">
                            <el-input v-model="formData.company_code" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="formData.type_id===1" :span="24">
                    <el-form-item label="企业营业执照">
                        <el-upload
                                class="avatar-uploader"
                                :action="uploadPath"
                                :show-file-list="false"
                                :on-success="handleFileSuccess"
                                :before-upload="beforeFileUpload">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-upload el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="负责人姓名" prop="supervisor_name">
                            <el-input v-model="formData.supervisor_name" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="负责人电话" prop="supervisor_mobile">
                            <el-input v-model="formData.supervisor_mobile" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客服电话" prop="service_mobile">
                            <el-input v-model="formData.service_mobile" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="状态" prop="status_id">
                        <el-switch
                                v-model="formData.status_id"
                                active-color="#13ce66"
                                :active-value="1"
                                :inactive-value="0"
                                inactive-color="#ff4949"/>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="合同时间" prop="display_protocol_time">
                            <el-date-picker
                                    v-model="formData.display_protocol_time"
                                    type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <!-- 基础信息 end -->
        </el-form>
        <div class="block bottom-buttons">
            <span class="bottom_botton_wraper">
                <el-button type="primary" class="button"
                           @click.native="submitForm">保存</el-button>
                <el-button type="primary" class="button"
                           @click.native="back">返回列表</el-button>
            </span>
        </div>

        <el-dialog
                title="选择类别"
                :visible.sync="categoryDialogVisible"
        >
            <el-tree
                    :data="categoryData"
                    show-checkbox
                    default-expand-all
                    ref="categoryTree"
                    node-key="id"/>
            <span slot="footer" class="dialog-footer">
                <el-button @click="onCategoryCancel">取 消</el-button>
                <el-button type="primary" @click="onCategoryConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
    import ElCol from "element-ui/packages/col/src/col";
    import SimpleChoseTable from "../components/SimpleChoseTable.vue"
    import {
        addJsonData,
        getDataListPage,
        getUploadPath,
        editJsonData,
        getData,
    } from "../../api/api"
    import deepcopy from "deepcopy";

    export default {
        components: {
            ElCol, SimpleChoseTable
        },
        data: function () {
            var validateDate = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error("日期不能为空"));
                } else {
                    callback();
                }
            };
            return {
                formType: "add",
                imageUrl: "",
                imageLogoUrl: "",
                loading: true,
                check_rules: {
                    name: [
                        {required: true, message: "请输入品牌名称", trigger: "blur"},
                    ],
                    description: [],
                    company_name: [
                        {required: true, message: "请输入企业全称", trigger: "blur"},
                    ],
                    company_code: [
                        {required: true, message: "请输入企业代码", trigger: "blur"},
                    ],
                    supervisor_name: [
                        {required: true, message: "请输入负责人姓名", trigger: "blur"},
                    ],
                    supervisor_mobile: [
                        {required: true, message: "请输入负责人电话", trigger: "blur"},
                    ],
                    service_mobile: [
                        {required: true, message: "请输入客服电话", trigger: "blur"},
                    ],
                    protocol_time: [
                        {type: "date", required: true, message: "请选择合同时间", trigger: "blur"},
                    ],
                },

                currentSelectedDriverItem: {},
                categoryData: [],
                categoryDialogVisible: false,
                selectCategoryItems: [],
                uploadPath:"",
                typeData:[
                    {id:0, value:'个人'},
                    {id:1, value:'企业'}
                ],
                formTreeData: {
                    name: "",
                    description: "",
                    category_ids: [],
                    category_names: "",
                    type_id: "",
                    status_id: "",
                    supervisor_name: "",
                    supervisor_mobile: "",
                    service_mobile: "",
                    company_name: "",
                    company_code: "",
                    company_pass: "",
                    protocol_time: "",
                },
                formData:{
                    name: "",
                    description: "",
                    category_ids: [],
                    category_names: "",
                    type_id: "",
                    status_id: 0,
                    supervisor_name: "",
                    supervisor_mobile: "",
                    service_mobile: "",
                    company_name: "",
                    company_code: "",
                    company_pass: "",
                    protocol_time: new Date(),
                }
            }
        },
        props: {},
        methods: {
            back(){
              this.$router.go(-1);
            },
            handleFileSuccess(res, file) {
                this.imageUrl = res.data.file_path;
            },
            beforeFileUpload(file){
                console.log(file);
            },
            handleLogoFileSuccess(res, file) {
                this.imageLogoUrl = res.data.file_path;
            },
            beforeLogoFileUpload(file){
                console.log(file);
            },
            getCategory() {
                getDataListPage("category").then(result => {
                    console.log(result);
                    this.categoryData = result.data.data.list;
                })
            },
            onCategoryCancel() {
                this.categoryDialogVisible = false;
            },
            onCategoryConfirm: function () {
                this.categoryDialogVisible = false;
                let checkedKeys = this.$refs.categoryTree.getCheckedKeys();
                this.selectCategoryItems = [];
                checkedKeys.forEach(ele => {
                    let item = this.findChild(this.categoryData, ele);
                    if (item && !item.children) {
                        this.selectCategoryItems.push(item);
                    }
                });

                this.formData.category_ids = this.selectCategoryItems.map(ele => ele.id);
                if (this.selectCategoryItems && this.selectCategoryItems.length > 0) {
                    this.formData.category_names = (this.selectCategoryItems.map(ele => ele.label)).join(" , ");
                }

            },
            findChild(treeData, nodeId) {
                for (let index = 0; index < treeData.length; index++) {
                    let item = treeData[index];
                    if (item.id === nodeId) {
                        return item;
                    } else if (item.children) {
                        let ritem = this.findChild(item.children, nodeId);
                        if(ritem){
                            return ritem;
                        }
                    }
                }
            },
            chooseCagegory() {
                this.categoryDialogVisible = true;
            },
            clearAPIData(formData){
                formData.category_names = formData.category_names.join(',');
                formData.display_protocol_time = new Date(formData.protocol_time*1000);
                this.imageUrl = formData.company_pass;
                this.imageLogoUrl = formData.logo_url;
                return formData;
            },
            clearSubmitData(para){
                para.protocol_time = parseInt(para.display_protocol_time.getTime()/1000);
                para.company_pass = this.imageUrl;
                para.logo_url = this.imageLogoUrl;
                delete para.category_names;
                delete para.display_protocol_time;
                return para;
            },
            submitForm() {
                console.log("addTeamSubmit:");
                this.$refs.detailForm.validate((valid) => {
                    console.log("addTeamSubmit:" + valid);
                    if (valid) {
                        let para = deepcopy(this.formData);
                        if(!this.imageUrl && para.type_id === 1){
                            this.$alert('请上传执照', '错误', {
                                confirmButtonText: '确定',
                            });
                            return;
                        }
                        if(!this.imageLogoUrl && para.type_id === 1){
                            this.$alert('请上传企业Logo', '错误', {
                                confirmButtonText: '确定',
                            });
                            return;
                        }

                        para = this.clearSubmitData(para);

                        if(this.formType==='add') {
                            addJsonData("provider", para).then((resp) => {
                                console.log("result", resp.data);
                                this.formType="edit";
                                if (resp.data.code === 0) {
                                    this.$message.success(resp.data.msg);
                                } else {
                                    this.$message.success(resp.data.msg);
                                }
                            });
                        } else {
                            editJsonData('provider', para).then((resp) => {
                                console.log("result", resp.data);
                                if (resp.data.code === 0) {
                                    this.$message.success(resp.data.msg);
                                } else {
                                    this.$message.success(resp.data.msg);
                                }
                            })
                        }
                    }
                });
            },
        },
        computed: {},
        mounted() {

            this.getCategory();
            this.uploadPath = getUploadPath();

            if (Object.keys(this.$route.params).length > 0) {
                this.formType = "edit";
                getData("provider", this.$route.params).then((resp) => {
                    let formData = resp.data.data;
                    console.log(formData);
                    this.loading = false;
                    this.formData = this.clearAPIData(formData);
                });
            } else {
                this.loading = false;
                this.formType = "add";
            }
        }
    }
</script>

<style scoped lang="scss">
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    .el-card {
        margin-top: 20px;
        .el-row {
            .el-col {
                margin-left: 10px;
            }
        }
    }

    .display-card {
        .card-header {
            height: 20px;
        }

        .display_header_button {
            float: right;
            clear: both;
            margin-top: -8px;
            width: 100px;
        }

        .display_body_button_wraper {
            float: right;
            clear: both;
            margin-top: -8px;

            .el-button {
                width: 100px;
            }
        }

        .common_button_wraper {
            float: right;
            clear: both;

            .el-button {
                margin: 5px;
                width: 100px;
            }
        }

        .routine_card {
            border: 1px solid #d1dbe5;
            padding: 5px;
            margin-top: 5px;
            box-sizing: border-box;

            .el-form-item {
                margin-bottom: 0px;
            }
        }

        .common_card {
            border: 1px solid #d1dbe5;
            padding: 5px;
            margin-top: 5px;
            box-sizing: border-box;
        }

    }

    .clear-fix:after {
        content: ".";
        display: block;
        height: 0;
        visibility: hidden;
        clear: both;
    }

    .single-item {
        margin-bottom: 0px;
    }

    .bottom_botton_wraper {
        text-align: right;

        .button {
            float: right;
            margin: 10px;

            &:first-child {
                width: 500px;
            }
        }

        &:after {
            content: ".";
            display: block;
            height: 0;
            visibility: hidden;
            clear: both;
        }
    }


</style>
<style lang="scss">
    .simple-chose-dialog {
        .el-dialog__body {
            padding-top: 0px;
        }
    }
</style>