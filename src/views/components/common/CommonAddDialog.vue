/**
* Created by xiangc on 2017/8/1.
*/
<template>
    <!--新增界面-->
    <el-dialog title="新增" v-model="dialog_visible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="config.rules" ref="addForm">
            <template v-for="item in config.fieldmap">
                <el-form-item :label="item.name" :prop="item.key">
                    <el-input v-model="addForm[item.key]" auto-complete="off"></el-input>
                </el-form-item>
            </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="dialog_visible = false">取消</el-button>
            <el-button type="primary" @click.native="add_submit" :loading="addLoading">提交</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {addProdData} from '../../../api/api'
    export default {
        data: function () {
            return {
                addForm: {},
            }
        },
        props: {
            config: {},
            dialog_visible: false,
        },
        methods: {
            getCleanEntity: function () {
                let obj = {}
                Object.keys(this.datas[0]).forEach(
                    key => {
                        obj[key] = ""
                    }
                )
                return obj
            },
            add_submit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            console.log(para)
                            addProdData(this.config.entityname, para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                console.log(res)
                            });
                        });
                    }
                });
            }
        },
        computed: {},
        watch:{
            dialog_visible: function () {
                if(this.dialog_visible){
                    this.addForm = this.getCleanEntity();
                }
            }
        }
    }
</script>

<style scoped>

</style>