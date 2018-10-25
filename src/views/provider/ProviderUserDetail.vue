/**
* Created by xiangc on 2017/7/25.
*/
<template>
    <section v-loading="loading">
        <el-form ref="detailForm" :rules="check_rules" :model="formData" label-position="right" label-width="100px">
            <!-- 基础信息 begin -->
            <el-card header="基础信息">

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="操作员名称" prop="name">
                            <el-input v-model="formData.name" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="formData.email" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="手机号" prop="mobile">
                            <el-input v-model="formData.mobile" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="职务" prop="rule_id">
                            <el-select v-model="formData.rule_id" placeholder="请选择职务">
                                <el-option v-for="item in jobRules" :label="item.name" :value="item.id" :key="item.id">
                                    {{ item.name }}
                                </el-option>
                            </el-select>
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

    </section>
</template>

<script>
    import {
        addJsonData,
        getDataListPage,
        editJsonData,
        getData,
    } from "../../api/api"
    import deepcopy from "deepcopy";

    export default {
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
                loading: true,
                jobRules: [],
                check_rules: {
                    name: [
                        {required: true, message: "请输入品牌名称", trigger: "blur"},
                    ],
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
                uploadPath: "",
                typeData: [
                    {id: 0, value: "个人"},
                    {id: 1, value: "企业"}
                ],
                formTreeData: {
                    name: "",
                    email: "",
                    mobile: "",
                    rule_id: "",
                    status_id: 0,
                },
                formData: {
                    name: "",
                    email: "",
                    mobile: "",
                    rule_id: "",
                    status_id: 0,
                    provider_id:"",
                },
                provider_id: "",
            }
        },
        props: {},
        methods: {
            back() {
                this.$router.go(-1);
            },

            clearAPIData(formData) {
                return formData;
            },
            clearSubmitData(para) {
                return para;
            },
            getJobRules() {
                getDataListPage("rule").then((res) => {
                    this.jobRules = res.data.data.list;
                    console.log("rules", this.jobRules);
                });
            },
            submitForm() {
                console.log("addTeamSubmit:");
                this.$refs.detailForm.validate((valid) => {
                    console.log("addTeamSubmit:" + valid);
                    if (valid) {
                        let para = deepcopy(this.formData);
                        if (!this.imageUrl && para.type_id === 1) {
                            this.$alert("请上传执照", "错误", {
                                confirmButtonText: "确定",
                            });
                            return;
                        }
                        para = this.clearSubmitData(para);

                        if (this.formType === "add") {
                            addJsonData("provider_user", para).then((resp) => {
                                console.log("result", resp.data);
                                this.formType="edit";
                                if (resp.data.code === 0) {
                                    this.$message.success(resp.data.msg);
                                } else {
                                    this.$message.success(resp.data.msg);
                                }
                            });
                        } else {
                            editJsonData("provider_user", para).then((resp) => {
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
            this.getJobRules();
            this.provider_id = this.$route.params['provider_id'];
            console.log(this.provider_id);
            this.formData.provider_id = this.provider_id;
            this.id = this.$route.params['id'];
            if (Object.keys(this.$route.params).length > 0 && this.id) {
                this.formType = "edit";
                getData("provider_user", this.$route.params).then((resp) => {
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