<template>
    <section>
        <div class="container">

            <el-form ref="editForm" :rules="rules"  :model="editForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="editForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="editForm.phone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="editForm.address"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="id_card_num">
                    <el-input v-model="editForm.id_card_num" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="导游证号" prop="guide_card_num">
                    <el-input v-model="editForm.guide_card_num" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="部门" prop="party_id">
                    <el-select v-model="editForm.party_id" placeholder="请选择部门">
                        <el-option v-for="item in parties" :label="item.name" :value="item.id" :key="item.id">
                            {{ item.name
                            }}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职务" prop="duties_id">
                    <el-select v-model="editForm.duties_id" placeholder="请选择职务">
                        <el-option v-for="item in duties" :label="item.name" :value="item.id" :key="item.id">
                            {{ item.name
                            }}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="公司" prop="company_id">
                    <el-select v-model="editForm.company_id" placeholder="请选择公司">
                        <el-option v-for="item in companies" :label="item.name" :value="item.id"
                                   :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:center;">
                <el-button style="width:50%;" type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </div>
    </section>
</template>

<script>
    import {mapGetters, mapActions, mapState} from 'vuex'
    import {getUser, editUser} from '../../api/api'

    export default {
        data: function () {
            return {
                editForm: {
                    id: 0,
                    name: '',
                    sex: -1,
                    address: '',
                    phone: '',
                    id_card_num: '',
                    guide_card_num: '',
                    party_id: '',
                    duties_id: '',
                    company_id: '',
                },
                editLoading: false,
                rules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入电话', trigger: 'blur'},
                        {pattern: /^1\d{10}$/, message: '请输入正确的电话', trigger: 'blur'}
                    ],
                    address: [{required: true, message: '请输入地址', trigger: 'blur'}],
                    id_card_num: [
                        {required: true, message: '请输入身份证', trigger: 'blur'},
                        {pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证', trigger: 'blur'}
                    ],
                    guide_card_num: [
                        {required: true, message: '请输入导游证号', trigger: 'blur'},
                        {pattern: /D-\d{4}-\d{6}/, message: '请输入正确的导游证号', trigger: 'blur'}
                    ],
                    party_id: [
                        {required: true, message: '请选择部门', trigger: 'change'}
                    ],
                    duties_id: [
                        {required: true, message: '请选择职务', trigger: 'change'}
                    ],
                    company_id: [
                        {required: true, message: '请选择公司', trigger: 'change'}
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
            getUserInfo(){
                let user = JSON.parse(sessionStorage.getItem('user'))
                getUser(user).then(resp => {
                        this.editForm = Object.assign(this.editForm, resp.data.data)
                    }
                )
            },
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            editUser(para).then((res) => {
                                console.log(res.status)
                                if(res.status == 200) {
                                    this.editLoading = false;
                                    this.getUserInfo();
                                    this.$message("修改成功")
                                }
                            });
                        });
                    }
                });
            }
        },
        mounted(){
            this.refreshBaseInfo();
            this.editForm = JSON.parse(sessionStorage.getItem('user'));
            this.getUserInfo()
        }
    }

</script>

<style lang="scss" scoped="">
    .container {
        width: 600px;
        margin: 0 auto;
    }
</style>