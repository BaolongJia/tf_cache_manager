/**
* Created by xiangc on 2017/7/31.
*/
<template>
    <el-dialog title=""
               v-model="form_visible"
               :close-on-click-modal="false"
               :beforeClose="onBeforeClose"
               @open="onOpened"
    >


        <el-row class="summary-row">
            <el-col :span="12" class="el-col">
                <BaseInfoTable
                        :xianjin="baseInfo.xianjin"
                        :qiandan="baseInfo.qiandan"
                        :shishou="baseInfo.shishou"
                        :lirun="baseInfo.lirun"
                ></BaseInfoTable>
            </el-col>
            <el-col :span="12" class="el-col">
                <ProfitAllotTable
                        ref="profittable"
                        :dijie="allotInfo.dijie"
                        :quanpei="allotInfo.quanpei"
                        :chedui="allotInfo.chedui"
                        :gongsi="allotInfo.gongsi"
                ></ProfitAllotTable>
            </el-col>
        </el-row>

        <el-form ref="addForm" :rules="validate_rules" class="add-form"
                 :model="formData" label-position="right" label-width="100px">

            <div class="box">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="类型" prop="type_id">
                            <el-select v-model="formData.type_id" placeholder="请选择类型" v-if="showInput">
                                <el-option v-for="item in accountConfig.account_type" :label="item.name"
                                           :value="item.id"
                                           :key="item.id">
                                </el-option>
                            </el-select>
                            {{ formData.type_id }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="日期" prop="date_on">
                            <el-date-picker v-model="formData.date_on" type="date"
                                            auto-complete="off"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row class="el-row">
                    <el-col :span="12">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model.trim="formData.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="人数" prop="people_count" :rules="validate_rules.price">
                            <el-input v-model.number="formData.people_count" @change="recalcInfo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row class="el-row">
                    <el-col :span="6">
                        <el-form-item label="单价" prop="sell_price" :rules="validate_rules.price">
                            <el-input v-model.number="formData.sell_price" @change="recalcInfo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="提现" prop="with_cash" :rules="validate_rules.price">
                            <el-input v-model.number="formData.with_cash" @change="recalcInfo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="底价" prop="back_price" :rules="validate_rules.price">
                            <el-input v-model.number="formData.back_price" @change="recalcInfo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="停车费" prop="parking_price" :rules="validate_rules.price">
                            <el-input v-model.number="formData.parking_price" @change="recalcInfo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="流水" prop="flow_account" :rules="validate_rules.price">
                            <el-input v-model.number="formData.flow_account"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="流水单号" prop="flow_num">
                            <el-input v-model="formData.flow_num"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>


                <el-row>
                    <el-col :span="12">
                        <el-form-item label="现付/签单" prop="pay_type">
                            <el-select v-model="formData.pay_type" placeholder="选择类型" @change="recalcInfo">
                                <el-option v-for="item in accountConfig.pay_type" :label="item.name" :value="item.id"
                                           :key="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                </el-row>
            </div>

            <!--<el-card>-->

            <div class="box" style="margin-top: 10px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="分配类型" prop="allot_type">
                            <el-select v-model="formData.allot_type" placeholder="选择分配方式">
                                <el-option v-for="item in accountConfig.allot_type" :label="item.name" :value="item.id"
                                           :key="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="地接" prop="allot_local" :rules="validate_rules.allot_price">
                            <el-input v-model.number="formData.allot_local" @blur="recalcInfo"
                                      :disabled="allotDiabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="全陪" prop="allot_national" :rules="validate_rules.allot_price">
                            <el-input v-model.number="formData.allot_national" @blur="recalcInfo"
                                      :disabled="allotDiabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车队" prop="allot_driver" :rules="validate_rules.allot_price">
                            <el-input v-model.number="formData.allot_driver" @blur="recalcInfo"
                                      :disabled="allotDiabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="旅行社" prop="allot_company" :rules="validate_rules.allot_price">
                            <el-input v-model.number="formData.allot_company" @blur="recalcInfo"
                                      :disabled="allotDiabled"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="明细说明" prop="mark">
                            <el-input type="textarea" v-model.string="formData.mark"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <!--</el-card>-->


        </el-form>
        <div slot="footer" class="dialog-footer">
            <div style="padding-bottom: 10px">
                最后修改人 {{ formData.editor }}
            </div>
            <div>
                <el-button @click.native="onReset">重置</el-button>
                <el-button
                        @click.native="onPass"
                        v-if="showShenhe"
                        :disabled="!isShenheEnable"
                >通过
                </el-button>
                <el-button
                        @click.native="onNoPass"
                        v-if="showShenhe"
                        :disabled="!isWeiTongguoEnable"
                >不通过
                </el-button>
                <el-button @click.native="onClose">取消</el-button>
                <el-button type="primary" @click.native="addSubmit">保存</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";
    import {addJsonData, editJsonData, updateAccountStatus} from "../../../api/api"
    import {formatDate, calcuAllotInfoTable, calcuBaseInfoTable} from 'jushuai_utils/utils'
    import StringUtils from '../../../tools/stringutils.js'
    import {calculateProfit} from "../../../tools/utils";
    import BaseInfoTable from '../../components/teamdetail/BaseInfoTable.vue'
    import ProfitAllotTable from '../../components/teamdetail/ProfitAllotTable.vue'
    import UserUtils, {computedprops} from "../../../tools/userutils"
    import {accountStatusEnum} from "../../../tools/config";

    export default {
        components: {
            ElCol,
            ElRow,
            BaseInfoTable,
            ProfitAllotTable,
        },
        data: function () {
            var validateDate = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('日期不能为空'));
                } else {
                    callback();
                }
            };
            return {
                allot_keys: ['allot_local',
                    'allot_national',
                    'allot_driver',
                    'allot_company',],
                profit_keys: ['people_count',
                    'sell_price',
                    'with_cash',
                    'back_price',
                    'parking_price',],
                baseInfo: {
                    xianjin: 0,
                    qiandan: 0,
                    shishou: 0,
                    lirun: 0,
                },
                allotInfo: {
                    dijie: 0,
                    quanpei: 0,
                    chedui: 0,
                    gongsi: 0,
                },
                allotEnable: false,
                validate_rules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                    ],
                    flow_num: [
                        {required: true, message: '请输入流水单号', trigger: 'blur'},
                    ],
                    date_on: [
                        {validator: validateDate, trigger: 'blur'},
                    ],
                    people_count: [
                        {type: 'integer', required: true, message: '请输入人数', trigger: 'blur'},
                        {pattern: /^[\d]+$/, message: '请输入正确的人数', trigger: 'blur'}
                    ],
                    allot_type: [
                        {type: 'integer', required: true, message: '请选择分配类型', trigger: 'blur'}
                    ],
                    pay_type: [
                        {type: 'integer', required: true, message: '请选择支付类型', trigger: 'blur'}
                    ],
                    type_id: [
                        {type: 'integer', required: true, message: '请选择类型', trigger: 'blur'}
                    ],
                    price: [
                        {type: 'number', required: true, message: '请输入金额', trigger: 'blur'},
                        {pattern: /^[\d\.]+$/, message: '请输入正确的金额', trigger: 'blur'}
                    ],
                    allot_price: [
                        {type: 'number', required: true, message: '请输入金额'},
                        {pattern: /^[\d\.]+$/, message: '请输入正确的金额'}
                    ],
                },
            }
        },
        props: {
            formData: {
                type: Object,
            },
            form_visible: {
                default: function () {
                    return true;
                }
            },
            accountConfig: {
                type: Object,
            },
            teamId: {
                type: String,
            },
            editStatus: "edit",
        },
        computed: {
            ...computedprops,
            allotDiabled: function () {
                return !this.allotEnable;
            },
            showInput: function () {
                return this.editStatus == "edit"
            },
            isShenheEnable: function () {
                if (this.isJiDiao) {
                    return this.formData.status_id < accountStatusEnum.tongguo_jidiao.id;
                } else if (this.isCaiwu) {
                    let is_enable = this.formData.status_id == accountStatusEnum.weitongguo_caiwu.id
                        || this.formData.status_id == accountStatusEnum.tongguo_jidiao.id;
                    return is_enable;
                } else {
                    return false;
                }
            },
            isWeiTongguoEnable: function () {
                if (this.isJiDiao) {
                    return this.formData.status_id == accountStatusEnum.tongguo_jidiao.id;
                } else if (this.isCaiwu) {
                    return this.formData.status_id == accountStatusEnum.tongguo_caiwu.id;
                } else {
                    return false;
                }
            },
            showShenhe: function () {
                return this.isJiDiao || this.isCaiwu || this.isJingli;
            },
        },
        mounted: function () {

        },
        methods: {
            addSubmit: function () {
                var param = Object.assign({}, this.formData);
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        param.date_on = formatDate(param.date_on);
                        param.team_id = this.teamId;
                        if (param.editstate) {
                            editJsonData('account', param).then(resp => {
                                this.$emit('on_submit', this.formData);
                            });
                        } else {
                            addJsonData('account', param).then(resp => {
                                this.$emit('on_submit', this.formData);
                            });
                        }
                    }
                });
            },
            onClose: function () {
                this.$refs.addForm.resetFields();
                this.$emit("onClose");
            },
            onReset: function () {
                console.log("reset");
                this.resetFields();
            },
            onPass: function () {
                if (this.isJiDiao) {
                    this.callUpdateAccountStatus(accountStatusEnum.tongguo_jidiao.id);
                } else {
                    this.callUpdateAccountStatus(accountStatusEnum.tongguo_caiwu.id);
                }
            },
            onNoPass: function () {
                if (this.isJiDiao) {
                    this.callUpdateAccountStatus(accountStatusEnum.weitongguo_jidiao.id);
                } else {
                    this.callUpdateAccountStatus(accountStatusEnum.weitongguo_caiwu.id);
                }
            },
            callUpdateAccountStatus: function (status_id) {
                updateAccountStatus({
                    id: this.formData.id,
                    status_id: status_id,
                }).then((resp) => {
                    this.$emit("on_submit");
                });
            },
            onBeforeClose: function () {

                this.$emit("onClose");
            },
            resetFields: function () {
                console.log("call reset");
                console.log(this.$refs.addForm)
                this.$refs.addForm.resetFields();
            },
            recalcInfo: function () {
                var formData = this.formData;
                Object.assign(this.baseInfo, calcuBaseInfoTable(formData));

                // 如果有利润相关项目没有填完，不进行利润可用性check
                for (let index = 0; index < this.profit_keys.length; index++) {
                    let item_value = this.profit_keys[index];
                    if (formData[item_value] != undefined && formData[item_value].toString().length > 0) {
                    } else {
                        return;
                    }
                }

                if (!this.checkAllotEnable()) {
                    return;
                }

                this.autoFill();
                this.checkAllotProfit();
                // 计算利润
                Object.assign(this.allotInfo, calcuAllotInfoTable(formData));
                console.log("this.allotInfo");
                console.log(this.allotInfo);

            },
            checkAllotProfit: function () {
                var formData = this.formData;
                this.baseInfo.lirun = calculateProfit(formData);
                console.log(this.baseInfo);
                // 如果利润相关条目没填写完不进行check
                for (let index = 0; index < this.allot_keys.length; index++) {
                    let item_value = this.allot_keys[index];
                    if (formData[item_value] != undefined && formData[item_value].toString().length > 0) {
                    } else {
                        return;
                    }
                }

                if (formData.allot_type == 1) {
                    if (StringUtils.parseFloat(formData.allot_local) + StringUtils.parseFloat(formData.allot_national)
                        + StringUtils.parseFloat(formData.allot_driver) + StringUtils.parseFloat(formData.allot_company) != 10) {
                        this.$message.error('比例分配合计必须为10');
                    }
                } else {
                    if (StringUtils.parseFloat(formData.allot_local) + StringUtils.parseFloat(formData.allot_national)
                        + StringUtils.parseFloat(formData.allot_driver) + StringUtils.parseFloat(formData.allot_company) != this.baseInfo.lirun) {
                        this.$message.error('分配金额与利润不相符，请重新填写分配');
                    }
                }
            },
            autoFill: function () {
                var formData = this.formData;
                this.baseInfo.lirun = calculateProfit(formData);
                let hasval = [];
                let nothas = [];

                let has_sum = 0;
                for (let index = 0; index < this.allot_keys.length; index++) {
                    let item_value = this.allot_keys[index];
                    if (StringUtils.parseFloat(formData[item_value]) > 0) {
                        hasval.push(item_value);
                        has_sum += StringUtils.parseFloat(formData[item_value]);
                    } else {
                        nothas.push(item_value);
                    }
                }
                if (hasval.length == 3) {
                    if (formData.allot_type == 1) {
                        formData[nothas[0]] = 10 - has_sum;
                    } else {
                        formData[nothas[0]] = this.baseInfo.lirun - has_sum;
                    }
                } else {
                }
            },
            checkAllotEnable: function () {
                if (calculateProfit(this.formData) <= 0) {
                    this.allotEnable = false;
                } else {
                    this.allotEnable = true;
                }
                return this.allotEnable;
            },
            onOpened: function () {
                console.log("opened");
                Object.assign(this.allotInfo, {
                    dijie: 0,
                    quanpei: 0,
                    chedui: 0,
                    gongsi: 0,
                });
                this.allotInfo.dijie = 1;
                this.recalcInfo();
            }
        },
    }
</script>

<style scoped lang="scss">
    .el-row {
        border-bottom: black 2px;
    }

    .summary-row .el-col {
        padding: 5px;
    }

    .add-form {
        margin-top: 10px;
    }

    .el-table-out {
        font-size: 5px;

        tr {
            height: 10px;
        }

        td {
            height: 10px;
        }
    }

    .row-class {
        height: 10px;
        font-size: 5px;

        td: {
            height: 10px;
        }
    }

    .box {
        border: 1px solid #d1dbe5;
        padding: 5px;
    }
</style>