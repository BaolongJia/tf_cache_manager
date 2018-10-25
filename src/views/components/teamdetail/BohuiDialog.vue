/**
* Created by xiangc on 2017/8/23.
*/
<template>
    <el-dialog
            :close-on-click-modal="false"
            :beforeClose="onBeforeClose"
            v-model="formVisible">
        <el-form ref="editForm" :rules="rules" :model="formData">
            <el-form-item label="驳回理由" prop="reason">
                <el-input v-model="formData.reason" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <div>
                <el-button @click.native="onReset">重置</el-button>
                <el-button @click.native="onClose">取消</el-button>
                <el-button type="primary" @click.native="onSubmit">确定</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import ElDialog from "../../../../node_modules/element-ui/packages/dialog/src/component.vue";
    import ElInput from "../../../../node_modules/element-ui/packages/input/src/input.vue";

    export default {
        components: {
            ElInput,
            ElDialog
        },
        data: function () {
            return {
                rules: {
                    reason: [
                        {required: true, message: '请输入驳回名称', trigger: 'blur'},
                    ],
                }
            }
        },
        props: {
            formData: {
                type: Object
            },
            formVisible: {
                default: function () {
                    return true;
                }
            },
        },
        methods: {
            onClose: function () {
                this.$refs.editForm.resetFields();
                this.$emit("onClose");
            },
            onBeforeClose: function () {
                this.$refs.editForm.resetFields();
                this.$emit("onClose");
            },
            onSubmit: function () {
                this.$refs.editForm.validate((isvalid) => {
                    if (isvalid) {
                        this.$emit("onSubmit", this.formData.reason);
                    }
                });
            },
            onReset: function () {
                this.$refs.editForm.resetFields();
            },
        }
    }
</script>

<style scoped>

</style>