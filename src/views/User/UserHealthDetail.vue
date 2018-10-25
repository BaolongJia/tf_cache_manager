<template>
    <section style="padding-top: 10px">
        <div class="health-info-wraper" v-loading="itemLoading">
            <el-card :header="leftTitle">
                <div v-for="item in leftData" class="left-item">
                    <div class="left">{{item.key}}</div>
                    <div class="right">{{item.value}}</div>
                </div>
            </el-card>
            <el-card header="餐单列表">
                <el-table :data="rightData" highlight-current-row style="width: 100%;">
                    <el-table-column prop="dateText" label="时间" min-width="100">
                    </el-table-column>
                    <el-table-column prop="statusText" label="状态" min-width="100">
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template scope="scope">
                            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>

        <div v-if="this.items.length" class="health_medical_info">
            <el-card>
                <div>药物使用建议</div>
                <el-input class="input" :autosize="{ minRows: 2, maxRows: 10}" type="textarea" placeholder="药物使用建议"
                          v-model="medicalSuggest" auto-complete="off"></el-input>
            </el-card>
        </div>

        <el-form v-if="this.items.length" class="health-form" ref="detailForm" :model="formData" label-position="right"
                 label-width="100px">
            <!-- 基础信息 begin -->
            <el-card header="餐单信息">
                <el-card v-for="dayitem in items" class="health-dayitem">
                    <div class="health-dayitem-right">
                        <el-row>
                            <el-col :span="3">
                                {{dayitem.timeName}}
                            </el-col>
                            <el-col :span="20">
                                <el-row>
                                    <el-col v-for="food in dayitem.foodItems" :span="8">
                                        <el-form-item label-width="120px" :label="food.name" prop="title">
                                            <el-input v-model="food.amount" auto-complete="off"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </el-card>
            <!-- 基础信息 end -->
        </el-form>

        <div class="block bottom-buttons" v-if="this.items && this.items.length>0">
            <span class="bottom_botton_wraper">
                <el-button type="primary" class="button"
                           @click.native="confirmChange">保存</el-button>
            </span>
        </div>
    </section>
</template>

<script>
    import {
        requestUserDetail,
        requestMenuDetail,
        requestmakeMenus
    } from "../../api/api";
    import ElInput from "../../../node_modules/element-ui/packages/input/src/input";
    import ElCol from "element-ui/packages/col/src/col";


    export default {
        components: {
            ElInput,
            ElCol
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
                medicalSuggest:'',
                leftTitle: '信息',
                leftData: [
                    {key: '姓名', value: '10'},
                    {key: '姓名', value: '10'}
                ],
                rightData: [],
                currentUid: '',
                currentDate: 0,
                items: [],
                itemLoading: true,
                daysLoading: false,
                formData: {}
            }
        },
        props: {},
        methods: {
            validateValues: function () {
                let status = true
                if (this.items) {
                    this.items.forEach(item => {
                        if (item && item.foodItems) {
                            item.foodItems.forEach(ele => {
                                console.log(ele)
                                if (!ele.amount || ele.amount.length === 0) {
                                    status = false
                                }
                            })
                        }
                    })
                } else {
                    status = false
                }
                return status
            },
            handleEdit: function (index, row) {
                this.currentDate = row.date
                this.daysLoading = true
                requestMenuDetail(this, {
                    uid: this.currentUid,
                    date: row.date

                }).then(data => {
                    this.medicalSuggest = data.medicalSuggest;
                    this.items = data.items;
                    this.daysLoading = false
                })
            },
            confirmChange: function () {
                console.log(this.items);
                var _this = this;
                if (this.validateValues()) {
                    this.$refs.detailForm.validate((valid) => {
                        console.log("obj:", this.items);
                        if (valid) {
                            requestmakeMenus(this, {
                                uid: this.currentUid,
                                date: this.currentDate,
                                medicalSuggest: this.medicalSuggest,
                                menus: JSON.stringify(this.items),
                            }).then(
                                this.items = [],
                                this.medicalSuggest = '',
                                this.$alert('提示', '填写餐单信息成功', {
                                    confirmButtonText: '确定',
                                    callback(event) {
                                        console.log(event)
                                        if (event === 'confirm') {
                                            requestUserDetail(_this, {'uid': _this.currentUid}).then((resp) => {
                                                console.log("item detail  " + resp.date);
                                                console.log(resp);
                                                if (resp.date === '' || resp.date == null) {
                                                    _this.leftTitle = '身体数据';
                                                } else {
                                                    _this.leftTitle = resp.date;
                                                }
                                                _this.leftData = resp.userInfo;
                                                _this.rightData = resp.menuList;
                                                _this.itemLoading = false
                                            });

                                        }
                                    }
                                })
                            )
                        }
                    });
                } else {
                    this.$alert('请填写完整信息', '信息不完整', {
                        confirmButtonText: '确定',
                    });
                }
            },
        },
        mounted() {
            if (Object.keys(this.$route.params).length > 0) {
                this.currentUid = this.$route.params['uid'];
                console.log("this.currentUid:" + this.currentUid);
                if (this.currentUid === '' || this.currentUid === 0 || this.currentUid === ":uid") {
                    this.itemLoading = false;
                    this.$alert('用户ID不能为空，请稍后重试', '提示', {
                        confirmButtonText: '确定'
                    });
                } else {
                    requestUserDetail(this, {'uid': this.currentUid}).then((resp) => {
                        console.log("item detail  " + resp.date);
                        console.log(resp);
                        if (resp.date === '' || resp.date == null) {
                            this.leftTitle = '身体数据';
                        } else {
                            this.leftTitle = resp.date;
                        }
                        this.leftData = resp.userInfo;
                        this.rightData = resp.menuList;
                        this.itemLoading = false
                    });
                }


            }
        }
    }
</script>

<style scoped lang="scss">
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

    .health-info-wraper {
        display: flex;
        flex-direction: row;
        width: 100%;

        > div {
            width: 50%;
            margin: 5px;
        }

        // 信息
        .left-item {
            display: flex;
            flex-direction: row;

            > div {
                height: 30px;
                line-height: 30px;
            }

            .left {
                width: 30%;
            }
            .right {
                flex-grow: 1;
            }
        }

        .health-dayitem {
            border-bottom: 1px solid #ddd;

        }
        .item-title {

            width: 200px;
        }
    }

    .health_medical_info {
        margin-left: 3px;
        margin-right: 3px;
        .input {
            margin-top: 20px;
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