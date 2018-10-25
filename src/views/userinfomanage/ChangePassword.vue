<template>
    <section>
        <div class="container">

            <el-form ref="editForm" :rules="rules" :model="editForm">
                <el-form-item label="当前密码" prop="old_password">
                    <el-input v-model="editForm.old_password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="new_password">
                    <el-input v-model="editForm.new_password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="重复新密码" prop="new_repeat_password" >
                    <el-input v-model="editForm.new_repeat_password" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:center;">
                <el-button style="width:50%;" type="primary" @click.native="editSubmit" :loading="editLoading">提交
                </el-button>
            </div>
        </div>
    </section>
</template>

<script>
    import {mapGetters, mapActions, mapState} from 'vuex'
    import {changePassword} from '../../api/api'

    export default {
        data: function () {
            var validator_equals_pass = (rule, value, callback) => {
                if(this.editForm.new_password != this.editForm.new_repeat_password){
                    callback(new Error("新旧密码不一致"))
                } else {
                    callback()
                }
            }

            return {
                editForm: {
                    old_password: '',
                    new_password: '',
                    new_repeat_password: '',
                },
                editLoading: false,
                rules: {
                    old_password: [
                        {required: true, message: '请输入旧密码', trigger: 'blur'}
                    ],
                    new_password: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min:6, message: '密码至少6位', trigger: 'blur'}
                    ],
                    new_repeat_password: [
                        {required: true, message: '请重新输入新密码', trigger: 'blur'},
                        {validator: validator_equals_pass, trigger: 'change'}
                    ]
                }
            }
        },
        computed: {
            ...mapState([
                "companies",
                "parties",
                "duties",
            ])
        },
        methods: {
            ...mapActions([
                "refreshBaseInfo",
            ]),
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            changePassword(para).then((res) => {
                                if (res.status == 200) {
                                    this.editLoading = false;

                                    var _this = this;
                                    this.$confirm('修改密码成功', '提示', {
                                    }).then(() => {
                                        sessionStorage.removeItem('user');
                                        _this.$router.push('/login');
                                    }).catch(() => {

                                    });
                                }
                            });
                        });
                    }
                });
            },
        },
        mounted(){
            this.refreshBaseInfo()
            this.editForm = JSON.parse(sessionStorage.getItem('user'));
        },
    }

</script>

<style lang="scss" scoped="">
    .container {
        width: 600px;
        margin: 0 auto;
    }
</style>