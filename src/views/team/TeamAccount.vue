/**
* Created by xiangc on 2017/8/6.
*/
<template>
    <section>
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
                        :dijie="allotInfo.dijie"
                        :quanpei="allotInfo.quanpei"
                        :chedui="allotInfo.chedui"
                        :gongsi="allotInfo.gongsi"
                ></ProfitAllotTable>
            </el-col>
        </el-row>
        <div class="block bottom-buttons">
            <span class="bottom_botton_wraper">
                <div class="team_status" :style="teamStatusColor">{{ teamStatus.name }}</div>
            </span>
        </div>
        <el-row>
            <el-table
                    :data="accountInfo"
            >
                <el-table-column
                        prop="name"
                        label="名称"
                ></el-table-column>
                <el-table-column
                        prop="people_count"
                        label="人数"
                ></el-table-column>
                <el-table-column
                        prop="profit"
                        label="利润"
                ></el-table-column>
                <el-table-column
                        prop="allot_str"
                        label="分配方式"
                ></el-table-column>
                <el-table-column
                        prop="pay_type_name"
                        label="签单/现付"
                ></el-table-column>
                <el-table-column
                        prop="status_name"
                        label="审验状态"
                ></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button
                                size="small"
                                @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                size="small"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <div class="block bottom-buttons">
            <span class="bottom_botton_wraper">
                <el-button type="primary" class="button"
                           @click.native="handleTijiaojidiao"
                           :disabled="!tijiaojidiaoEnable"
                           v-if="isDaoyou"
                >提交计调</el-button>
                <el-button type="primary" class="button"
                           @click.native="handleTeamDetail"
                >行程详情</el-button>
                <el-button type="primary" class="button"
                           @click.native="handleBohui"
                           :disabled="!bohuiEnable"
                           v-if="showBohui"
                >驳回</el-button>
                <el-button type="primary" class="button"
                           @click.native="handleShenhetongguo"
                           :disabled="!shenhetongguoEnable"
                >审核通过</el-button>
                <el-button type="primary" class="button"
                           @click.native="handleTijiaocaiwu"
                           :disabled="!tijiaocaiwuEnable"
                           v-if="showTijiaocaiwu"
                >提交财务</el-button>

                <el-button type="primary"
                           class="button"
                           :disabled="!tianjiaEnable"
                           @click.native="handleAdd">添加条目</el-button>
            </span>
        </div>

        <TeamAccountDialog
                :formData="addFormData"
                :form_visible="addFormVisible"
                @on_submit="addSubmit"
                @onClose="addFormVisible = false"
                :accountConfig="accountConfig"
                :teamId="teamId"
                :title="'添加'"
        ></TeamAccountDialog>

        <TeamAccountDialog
                :formData="editFormData"
                :form_visible="editFormVisible"
                @on_submit="editSubmit"
                @onClose="editFormVisible = false"
                :accountConfig="accountConfig"
                :teamId="teamId"
                :title="'编辑'"
        ></TeamAccountDialog>

        <BohuiDialog
                :formData="bohuiInfo"
                :formVisible="bohuiVisible"
                @onClose="onBohuiClose"
                @onSubmit="onBohuiSubmit"
        ></BohuiDialog>
    </section>
</template>

<script>
    import {mapActions, mapState} from 'vuex';
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";
    import Config from '../../tools/config'
    import {accountStatusEnum, teamStatusEnum} from '../../tools/config'
    import {getDataListPage, updateTeamStatus} from '../../api/api'
    import UserUtils from "../../tools/userutils"
    import {computedprops} from "../../tools/userutils"
    import TeamAccountDialog from '../components/teamdetail/TeamAccountDialog.vue'
    import BohuiDialog from '../components/teamdetail/BohuiDialog.vue'
    import {calculateProfit, calcuAllotInfoTable, calcuBaseInfoTable, calcuAllotAndBaseInfoForList} from '../../tools/utils'
    import BaseInfoTable from '../components/teamdetail/BaseInfoTable.vue'
    import ProfitAllotTable from '../components/teamdetail/ProfitAllotTable.vue'

    export default {
        components: {
            ElCol,
            ElRow,
            TeamAccountDialog,
            BaseInfoTable,
            ProfitAllotTable,
            BohuiDialog,
        },
        data: function () {
            return {
                addFormVisible: false,
                addFormData: {},
                editFormVisible: false,
                editFormData: {},
                bohuiVisible: false,
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
                bohuiInfo:{
                    reason: ""
                },
                teamStatus: 0,
                accountInfo: []
            }
        },
        props: {},
        methods: {
            ...mapActions([
                'refreshAccountConfig',
            ]),
            formatData: function (inarr) {
                if(inarr) {
                    inarr.forEach(item => {
                        item.profit = calculateProfit(
                            item.sell_price, item.back_price,
                            item.people_count, item.with_cash
                        );

                        if (item.pay_type == 0) {
                            item.pay_type_name = "签单";
                        } else {
                            item.pay_type_name = "现付";
                        }

                        if (item.allot_type == 1) {
                            item.allot_type_name = "比例";
                        } else {
                            item.allot_type_name = "利润";
                        }

                        item.status_name = accountStatusEnum.getName(item.status_id);

                        item.allot_str = ('(' + item.allot_type_name + ')'
                            + item.allot_local + '\\' + item.allot_company + '\\'
                            + item.allot_driver + '\\' + item.allot_company);

                    });
                }
                return inarr;
            },
            addSubmit: function () {
                this.addFormVisible = false;
                this.getData();
            },
            editSubmit: function () {
                this.editFormVisible = false;
                this.getData();
            },
            showBohuiDialog: function () {
                this.bohuiInfo={
                    reason: ""
                };
                this.bohuiVisible = true;
            },
            onBohuiClose: function () {
              this.bohuiVisible = false;
            },
            onBohuiSubmit: function (reason) {
                console.log("bohui reason:"+reason);
                if(teamStatusEnum.weishenhe_jidiao.id == this.teamStatus.id) {
                    this.callUpdateTeamStatus(teamStatusEnum.yixiatuan.id, reason);
                }
                if(teamStatusEnum.weishenhe_caiwu.id == this.teamStatus.id){
                    this.callUpdateTeamStatus(teamStatusEnum.weishenhe_jidiao.id, reason);
                }
            },
            handleAdd: function () {
                this.addFormVisible = true;
                this.addFormData = {
                    type_id: 2,   // 类型
                    date_on: "",  // 日期
                    sell_price: "",
                    back_price: "",
                    with_cash: "",
                    flow_account: 0,
                    flow_num: "",
                    parking_price: "",
                    pay_type: 2,
                    allot_type: 1,
                    allot_local: "",
                    allot_national: "",
                    allot_driver: "",
                    allot_company: "",
                    mark:"",
                    name:"",
                    people_count:"",
                };
            },
            handleEdit: function (row_index, row) {
                this.editFormData = Object.assign({}, row);
                this.editFormData.editstate = true;
                this.editFormVisible = true;
            },
            handleBohui: function () {
                this.showBohuiDialog();
            },
            handleTeamDetail: function () {
                this.$router.push({path:'/team/detail/'+this.teamId})
            },
            handleShenhetongguo: function () {
                if(this.isJiDiao) {
                    this.callUpdateTeamStatus(teamStatusEnum.yishenhe_jidiao.id);
                } else {
                    this.callUpdateTeamStatus(teamStatusEnum.yishenhe_caiwu.id);
                }
            },
            handleTijiaocaiwu: function () {
                this.callUpdateTeamStatus(teamStatusEnum.weishenhe_caiwu.id);
            },
            handleTijiaojidiao: function () {
                this.callUpdateTeamStatus(teamStatusEnum.weishenhe_jidiao.id);
            },
            callUpdateTeamStatus: function (status_id, reason="") {
                updateTeamStatus({
                    team_id: this.teamId,
                    status_id: status_id,
                }).then((resp)=>{
                    this.teamStatus = resp.data.data.status;
                });
            },
            getData: function () {
                if (Object.keys(this.$route.params).length > 0) {
                    getDataListPage(Config.entityName.ACCOUNT, this.$route.params).then(
                        (resp) => {
                            console.log("getdatalistpage");
                            console.log(resp.data.data.data);
                            console.log(resp.data.data.team_status);
                            this.accountInfo = this.formatData(resp.data.data.data);
                            this.teamStatus = resp.data.data.team_status;
                            this.calcSummaryInfo();
                        }
                    )
                }
            },
            calcSummaryInfo() {
                var infoResult = calcuAllotAndBaseInfoForList(this.accountInfo);

                Object.assign(this.baseInfo, infoResult.baseInfo);
                Object.assign(this.allotInfo, infoResult.allotInfo);
            }
        },
        computed: {
            ...mapState([
                'accountConfig',
            ]),
            ...computedprops,
            teamId: function () {
                return this.$route.params['team_id'];
            },
            showBohui: function () {
                return this.isJiDiao || this.isCaiwu || this.isJingli;
            },
            showTijiaocaiwu: function () {
                return this.isJiDiao;
            },
            bohuiEnable(){ //驳回是否可用
                if(this.accountInfo && this.teamStatus) {
                    if(this.isJiDiao
                        && this.teamStatus.id == teamStatusEnum.weishenhe_jidiao.id
                    ) {
                        if (this.accountInfo.some(item => item.status_id == accountStatusEnum.weitongguo_jidiao.id)) {
                            return true;
                        } else {
                            return false;
                        }
                    } else if(
                        this.isCaiwu
                        && this.teamStatus.id == teamStatusEnum.weishenhe_caiwu.id
                    ){
                        if (this.accountInfo.some(item => item.status_id == accountStatusEnum.weitongguo_caiwu.id)) {
                            return true;
                        } else {
                            return false;
                        }
                    } else if(this.isJingli
                        && this.teamStatus.id == teamStatusEnum.yishenhe_caiwu.id){
                        if (this.accountInfo.some(item => item.status_id == accountStatusEnum.weitongguo_jingli.id)) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            },
            shenhetongguoEnable: function () { // 审核通过是否可用
                if(this.accountInfo && this.teamStatus) {
                    if (this.isJiDiao
                        && this.accountInfo.every(item => item.status_id == accountStatusEnum.tongguo_jidiao.id)
                        && this.teamStatus.id < teamStatusEnum.weishenhe_caiwu
                    ) {
                        return true;
                    } else if(this.isCaiwu
                        && this.accountInfo.every(item => item.status_id == accountStatusEnum.tongguo_caiwu.id)
                        && this.teamStatus.id < teamStatusEnum.yishenhe_caiwu
                    ){
                        return true;
                    }else{
                        return false;
                    }
                }
            },
            tijiaocaiwuEnable: function () { // 提交财务是否可用
                if(this.accountInfo && this.teamStatus) {
                    if (this.teamStatus.id == teamStatusEnum.yishenhe_jidiao.id) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            tijiaojidiaoEnable: function () { // 提交计调是否可用
                if(this.accountInfo && this.accountInfo.length > 0 && this.teamStatus){
                    return this.isDaoyou && this.teamStatus.id < teamStatusEnum.weishenhe_jidiao.id;
                } else {
                    return false;
                }
            },
            tianjiaEnable: function () { //添加条目是否可用
                console.log("current status_id:"+this.teamStatus.id);
                if(!this.teamStatus){
                    return false;
                }
                if(this.isDaoyou){
                    return this.teamStatus.id < teamStatusEnum.weishenhe_jidiao.id;
                } else if(this.isJiDiao){
                    return this.teamStatus.id >= teamStatusEnum.weishenhe_jidiao.id
                        && this.teamStatus.id < teamStatusEnum.weishenhe_caiwu.id;
                } else if(this.isCaiwu){
                    return this.teamStatus.id >= teamStatusEnum.weishenhe_caiwu.id
                        && this.teamStatus.id < teamStatusEnum.yishenhe_caiwu.id;
                }
                return false;
            },
            teamStatusColor: function(){
                return "background-color:"+this.teamStatus.color+";border-radius:4px;color: white;";
            }

        },
        mounted: function () {
            this.refreshAccountConfig();
            this.getData();
        }
    }
</script>

<style scoped lang="scss">
    .summary-row {
        .el-col {
            padding: 5px;
        }
    }

    .team_status {
        width: 100px;
        line-height: 40px;
        float: right;
        margin: 10px;
        margin-right: 50px;
        text-align: center;
        border: 2px;
    }

    .bottom_botton_wraper {
        text-align: right;

        .button {
            float: right;
            margin: 10px;
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