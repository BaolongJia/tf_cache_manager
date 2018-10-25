/**
* Created by xiangc on 2017/7/31.
*/
<template>
    <el-dialog :title="title" v-model="form_visible" :close-on-click-modal="false" :beforeClose="onBeforeClose">
        <el-form ref="routineAddForm" :rules="routine_rules" :model="form_data" label-position="right"
                 label-width="100px">
            <el-form-item label="接站时间" prop="date_on">
                <el-date-picker v-model="form_data.date_on" type="date"
                                auto-complete="off"></el-date-picker>
            </el-form-item>
            <el-form-item label="行程描述" prop="description">
                <el-input type="textarea" v-model="form_data.description"></el-input>
            </el-form-item>
            <el-form-item label="食宿" prop="eat">
                <el-select v-model="form_data.eat" placeholder="请选择食宿">
                    <el-option v-for="item in eats" :label="item" :value="item" :key="item.id">
                        {{ item }}
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="地区" prop="location_id">
                <el-select v-model="form_data.location_id" placeholder="请选择地区">
                    <el-option v-for="item in locations" :label="item.name" :value="item.id" :key="item.id">

                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="onClose">取消</el-button>
            <el-button type="primary" @click.native="addSubmit" >提交</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        data: function () {
            return {
                routine_rules: {
                    date_on: [
                        {type: "date", required: true, message: '请选择日期', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '请输入行程', trigger: 'blur'}
                    ],
                    eat: [
                        {required: true, message: '请选择食宿', trigger: 'blur'}
                    ],
                    location_id: [
                        {type:'integer', required: true, message: '请选择地区', trigger: 'change'}
                    ],
                },
            }
        },
        props: {
            form_data: {
                default: function () {
                    return {
                        id:"",
                        date_on: "",
                        description: "",
                        eat: "",
                        location_id: "",
                    }
                }
            },
            form_visible: {
                default: function () {
                    return true;
                }
            },
            locations: {
                type: Array,
            },
            eats: {
                type: Array,
            },
            title:{
                type: String,
            }

        },
        methods: {
            addSubmit: function () {
                this.$refs.routineAddForm.validate((valid) => {
                    if (valid) {
                        this.form_data.location_name = this.locations[this.form_data.location_id].name;
                        this.$emit('on_submit', this.form_data);
                    }
                });
            },
            onClose: function () {
                this.$emit("onClose");
            },
            onBeforeClose: function () {
                this.$emit("onClose");
            }
        }
    }
</script>

<style scoped>

</style>