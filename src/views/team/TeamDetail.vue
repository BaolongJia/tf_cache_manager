/**
* Created by xiangc on 2017/7/25.
*/
<template>
    <section>
        <el-form ref="detailForm" :rules="check_rules" :model="formData" label-position="right" label-width="100px">
            <!-- 基础信息 begin -->
            <el-card header="基础信息">

                <el-row>
                    <el-col :span="6">
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="formData.title" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="地区" prop="location_id">
                            <el-select v-model="formData.location_id" placeholder="请选择地区">
                                <el-option v-for="item in locations" :label="item.name" :value="item.id" :key="item.id">
                                    {{ item.name }}
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="团号" prop="team_id">
                            <el-input v-model="formData.team_id" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="人数" prop="people_count">
                            <el-input v-model="formData.people_count" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="地陪导游" prop="local_guide">
                            {{ formData.local_guide }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="地陪导游电话" prop="local_guide_phone">
                            {{ formData.local_guide_phone }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-button @click.native="showChoseGuide" type="primary">选择导游</el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="全陪导游" prop="national_guide">
                            <el-input v-model="formData.national_guide" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="全陪电话" prop="national_guide_phone">
                            <el-input v-model="formData.national_guide_phone" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="6">
                        <el-form-item label="接站班次" prop="traffic_on">
                            <el-input v-model="formData.traffic_on" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="接站时间" prop="date_on">
                            <el-date-picker v-model="formData.date_on" type="datetime"
                                            auto-complete="off"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="送站班次" prop="traffic_off">
                            <el-input v-model="formData.traffic_off" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="送站时间" prop="date_off">
                            <el-date-picker v-model="formData.date_off" type="datetime"
                                            auto-complete="off"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <!-- 基础信息 end -->

            <!-- 酒店 begin -->
            <el-card class="display-card">
                <div slot="header" class="card-header">
                    酒店
                    <el-button class="display_header_button" type="primary" @click.native="handleAddHotelItem">新增
                    </el-button>
                </div>
                <el-row v-for="(item, item_index) in formData.hotels" class="common_card">
                    <el-col :span="2">
                        <el-button type="primary" @click.native="handleSelectHotelItem(item)">选择酒店</el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="酒店名称">
                            {{ item.hotel_name }}
                        </el-form-item>
                        <el-form-item label="电话">
                            {{ item.hotel_phone }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="时间" :prop="'hotels.' + item_index + '.date_on'"
                                      :rules="check_rules.required_fileds_change" class="is-required">
                            <el-date-picker v-model="item.date_on" type="date"
                                            auto-complete="off"></el-date-picker>
                        </el-form-item>

                        <el-form-item label="价格" :prop="'hotels.' + item_index + '.price'"
                                      :rules="check_rules.price">
                            <el-input type="input" v-model="item.price"></el-input>
                        </el-form-item>
                    </el-col>
                    <div class="block">
                            <span class="display_body_button_wraper">
                                <el-button type="danger"
                                           @click.native="handleDelHotelItem(item)">删除</el-button>
                            </span>
                    </div>
                </el-row>
            </el-card>
            <!-- 酒店 end -->

            <!-- 车队 begin -->
            <el-card class="display-card">
                <div slot="header" class="card-header">
                    车队
                    <el-button class="display_header_button" type="primary" @click.native="handleAddDriveItem">新增
                    </el-button>
                </div>
                <el-row v-for="(item, item_index) in formData.drivers" class="common_card">
                    <el-col :span="2">
                        <el-button type="primary" @click.native="handleSelectDriverItem(item)">选择车队</el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车队名称">
                            {{ item.driver_group }}
                        </el-form-item>
                        <el-form-item label="司机名称">
                            {{ item.driver_name }}
                        </el-form-item>
                        <el-form-item label="车队电话">
                            {{ item.driver_phone }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="时间" :prop="'drivers.' + item_index + '.date_on'"
                                      :rules="check_rules.required_fileds_change" class="is-required">
                            <el-date-picker v-model="item.date_on" type="date"
                                            auto-complete="off"></el-date-picker>
                        </el-form-item>

                        <el-form-item label="价格" :prop="'drivers.' + item_index + '.price'"
                                      :rules="check_rules.price">
                            <el-input type="input" v-model="item.price"></el-input>
                        </el-form-item>
                    </el-col>
                    <div class="block">
                            <span class="display_body_button_wraper">
                                <el-button type="danger"
                                           @click.native="handleDelDriveItem(item)">删除</el-button>
                            </span>
                    </div>
                </el-row>
            </el-card>
            <!-- 车队 end -->

            <!-- 行程 begin -->
            <el-card class="display-card">
                <div slot="header" class="card-header">
                    行程
                    <el-button class="display_header_button" type="primary" @click.native="handleAddRoutineItem">新增
                    </el-button>
                </div>
                <el-row v-for="item in formData.routines">
                    <el-col class="routine_card">
                        <el-form-item label="接站时间">
                            {{ formatDate(item.date_on) }}
                        </el-form-item>
                        <el-form-item label="行程描述">
                            {{ item.description }}
                        </el-form-item>
                        <el-form-item label="食宿">
                            {{ item.eat }}
                        </el-form-item>
                        <el-form-item label="地区">
                            {{ item.location_name }}
                        </el-form-item>
                        <div class="block">
                            <span class="display_body_button_wraper">
                                <el-button type="success"
                                           @click.native="handleEditRoutineItem(item)">编辑</el-button>
                                <el-button type="danger"
                                           @click.native="handleDelRoutineItem(item)">删除</el-button>
                            </span>
                        </div>
                    </el-col>
                </el-row>
            </el-card>
            <!-- 行程 end -->
            <template v-for="item in formData.more_info">
                <el-card class="display-card">
                    <div slot="header" class="card-header">
                        <el-input v-model="item.title" v-if="item.title_editable"></el-input>
                        <p v-else>
                            {{ item.title }}
                        </p>
                    </div>
                    <el-form-item class="single-item" prop="service_standard" label-width="0px">
                        <el-input type="textarea" v-model="item.content"></el-input>
                    </el-form-item>
                    <div class="block">
                            <span class="common_button_wraper">
                                <el-button type="danger"
                                           @click.native="handleDelMoreInfoItem(item.id)">删除</el-button>
                            </span>
                    </div>
                </el-card>
            </template>
        </el-form>

        <div class="block bottom-buttons">
            <span class="bottom_botton_wraper">
                <el-button type="primary" class="button"
                           @click.native="addTeamSubmit">保存</el-button>
                <el-button type="primary" class="button"
                           @click.native="handleAddMoreInfoItem">新增模块</el-button>
            </span>
        </div>

        <el-dialog class="simple-chose-dialog"
                   title="选择地接"
                   v-model="selectGuideVisible"
                   :close-on-click-modal="false">
            <SimpleChoseTable @on_confirm="confirm_user" :srcdata="guides"
                              :config="guidetable_config"></SimpleChoseTable>
        </el-dialog>

        <el-dialog class="simple-chose-dialog"
                   title="选择酒店"
                   v-model="selectHotelVisible"
                   :close-on-click-modal="false">
            <SimpleChoseTable @on_confirm="confirmHotel"
                              :srcdata="hotels"
                              :config="guidetable_config"
                              :other_link="'/dutyadmin/hotel'"
            ></SimpleChoseTable>
        </el-dialog>

        <el-dialog class="simple-chose-dialog"
                   title="选择车队"
                   v-model="selectDriverVisible"
                   :close-on-click-modal="false">
            <SimpleChoseTable @on_confirm="confirmDriver"
                              :srcdata="drivers"
                              :config="guidetable_config"
                              :other_link="'/dutyadmin/carteam'"
            ></SimpleChoseTable>
        </el-dialog>


        <days-dialog
                :form_data="routine_add_form"
                :form_visible="addFormVisible"
                @on_submit="routineSubmit"
                @onClose="addFormVisible = false"
                :locations="locations"
                :eats="eats"
                :title="'添加'"
        ></days-dialog>

        <days-dialog
                :form_data="routine_edit_form"
                :form_visible="editFormVisible"
                @on_submit="routineSubmit"
                @onClose="editFormVisible = false"
                :locations="locations"
                :eats="eats"
                :title="'编辑'"
        ></days-dialog>

    </section>
</template>

<script>
    import {mapActions, mapState} from 'vuex';
    import ElCol from "element-ui/packages/col/src/col";
    import SimpleChoseTable from "../components/SimpleChoseTable.vue"
    import {
        formatDate,
        getUUID,
        formateDateTime,
        getDateFromString,
        deepCopy
    } from '../../tools/utils';
    import {addTeam, updateTeam, getData, deleteTeamElement} from "../../api/api";
    import DaysDialog from "../components/teamdetail/DaysDialog.vue"
    import CommonDialog from "../components/common/CommonAddDialog.vue"
    import ElInput from "../../../node_modules/element-ui/packages/input/src/input";


    export default {
        components: {
            ElInput,
            ElCol, SimpleChoseTable, DaysDialog, CommonDialog
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
                eats: [
                    "早中晚", "早中", "早晚", "中晚"
                ],
                travel_routine_form: {
                    date: "111",
                    description: "111",
                    location: "111",
                    eat: "11",
                },
                routine_add_form: {
                    date: "",
                    description: "",
                    eat: "",
                    location: "",
                },
                routine_edit_form: {
                    date: "",
                    description: "",
                    eat: "",
                    location: "",
                },
                check_rules: {
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur'},
                    ],
                    location_id: [
                        {type: 'number', required: true, message: '请选择地区', trigger: 'blur'},
                    ],
                    team_id: [
                        {required: true, message: '请输入团号', trigger: 'blur'},
                    ],
                    people_count: [
                        {required: true, message: '请输入人数', trigger: 'blur'},
                        {pattern: /^[\.\d]+$/, required: true, message: '请输入正确的人数', trigger: 'blur'}
                    ],
                    national_guide: [
                        {required: true, message: '请输入地陪导游', trigger: 'blur'},
                    ],
                    national_guide_phone: [
                        {required: true, message: '请输入地陪导游手机号', trigger: 'blur'},
                    ],
                    traffic_on: [
                        {required: true, message: '请输入接站班次', trigger: 'blur'},
                    ],
                    traffic_off: [
                        {required: true, message: '请输入送站班次', trigger: 'blur'},
                    ],
                    date_on: [
                        {type: "date", required: true, message: '请选择接站日期', trigger: 'blur'},
                    ],
                    date_off: [
                        {type: "date", required: true, message: '请选择送站日期', trigger: 'blur'},
                    ],

                    date_time: [
                        {type: "date", required: true, message: '请选择日期', trigger: 'blur'},
                    ],
                    price: [
                        {required: true, message: '请输入价格', trigger: 'blur'},
                        {pattern: /^[\\.\d]+$/, required: true, message: '请输入正确的价格', trigger: 'blur'}
                    ],
                    required_fileds_change: [
                        {validator: validateDate, trigger: 'blur'},
                    ],
                },
                addFormVisible: false,
                editFormVisible: false,
                editLoading: false,
                selectGuideVisible: false,
                selectHotelVisible: false,
                currentSelectedHotelItem: {},
                selectDriverVisible: false,
                currentSelectedDriverItem: {},
                formData: {
                    title: "",
                    team_id: "",
                    people_count: "",
                    guide_id: "",
                    location_id: "",
                    local_guide: "",
                    local_guide_phone: "",
                    national_guide: "",
                    national_guide_phone: "",
                    date_on: "",
                    traffic_on: "",
                    date_off: "",
                    traffic_off: "",
                    service_standard: "",
                    attentions: "",
                    tips: "",
                    more_info: [
                        {
                            title_editable: false,
                            title: "服务标准",
                            content: "",
                        },
                        {
                            title_editable: false,
                            title: "注意事项",
                            content: "",
                        },
                    ],
                    status_id: 0,
                    routines: [],
                    hotels: [],
                    drivers: [],
                },
                guidetable_config: {
                    fieldmap: [
                        {
                            key: "id",
                            name: "编号",
                            width: 100,
                        },
                        {
                            key: "name",
                            name: "名字",
                            width: 200,
                        }
                    ]
                },
            }
        },
        props: {},
        methods: {
            ...mapActions([
                "refreshGuides",
                "refreshLocations",
                "refreshHotels",
                "refreshDrivers"
            ]),

            // 酒店操作部分 begin
            handleAddHotelItem: function () {
                var new_item = this.getCleanHotelForm();
                new_item.id = getUUID();
                this.formData.hotels.push(new_item);
            },
            handleDelHotelItem: function (item) {
                if (item.editstate) {
                    deleteTeamElement("hotel", {id: item.id}).then(res => {
                        this.delItemById(this.formData.hotels, item.id);
                    });
                } else {
                    this.delItemById(this.formData.hotels, item.id);
                }

            },
            handleAddRoutineItem: function () {
                this.addFormVisible = true;
                this.routine_add_form = this.getCleanAddForm();
            },
            handleSelectHotelItem: function (item) {
                this.selectHotelVisible = true;
                if (item.id && item.id.length > 0) {
                    this.currentSelectedHotelItem = item;
                }
            },
            confirmHotel: function (value) {
                this.currentSelectedHotelItem.hotel_id = value.id;
                this.currentSelectedHotelItem.hotel_name = value.name;
                this.currentSelectedHotelItem.hotel_phone = value.phone;
                this.selectHotelVisible = false;
            },
            getCleanHotelForm: function () {
                return {
                    date_on: "",
                    hotel_id: 0,
                    hotel_name: "",
                    hotel_phone: "",
                    price: "",
                }
            },
            // 酒店操作部分 end
            // 司机操作部分 begin
            handleAddDriveItem: function () {
                var new_item = this.getCleanDriverForm();
                new_item.id = getUUID();
                this.formData.drivers.push(new_item);
            },
            handleDelDriveItem: function (item) {
                if (item.editstate) {
                    deleteTeamElement("driver", {id: item.id}).then(res => {
                        this.delItemById(this.formData.drivers, item.id);
                    });
                } else {
                    this.delItemById(this.formData.drivers, item.id);
                }
            },
            handleSelectDriverItem: function (item) {
                this.selectDriverVisible = true;
                if (item.id && item.id.length > 0) {
                    this.currentSelectedDriverItem = item;
                }
            },
            confirmDriver: function (value) {
                console.log(value);
                this.currentSelectedDriverItem.driver_id = value.id;
                this.currentSelectedDriverItem.driver_group = value.driver_group;
                this.currentSelectedDriverItem.driver_name = value.name;
                this.currentSelectedDriverItem.driver_phone = value.phone;
                this.selectDriverVisible = false;
            },
            getCleanDriverForm: function () {
                return {
                    date_on: "",
                    driver_id: 0,
                    driver_name: "",
                    driver_group: "",
                    driver_phone: "",
                    price: "",
                }
            },
            // 司机操作部分 end
            // 更多信息部分 begin
            handleAddMoreInfoItem: function () {
                var new_item = this.getCleanMoreInfoForm();
                new_item.id = getUUID();
                this.formData.more_info.push(new_item);
            },
            handleDelMoreInfoItem: function (id) {
                this.delItemById(this.formData.more_info, id);
            },
            getCleanMoreInfoForm: function () {
                return {
                    title_editable: true,
                    title: "",
                    content: "",
                }
            },
            // 更多信息部分 end
            handleEditRoutineItem: function (item) {
                if (item) {
                    this.routine_edit_form = Object.assign({}, item);
                }
                this.editFormVisible = true;
            },
            handleDelRoutineItem: function (item) {
                if (item.editstate) {
                    deleteTeamElement("day", {id: item.id}).then(res => {
                        this.delItemById(this.formData.routines, item.id);
                    });
                } else {
                    this.delItemById(this.formData.routines, item.id);
                }
            },
            routineSubmit: function (value) {
                let para = Object.assign({}, value);
                if (para.id) { // 编辑
                    var item = this.formData.routines.find((item) => {
                        return item.id === para.id;
                    });
                    Object.assign(item, value);
                    this.editFormVisible = false;
                } else { // 添加
                    para.id = getUUID();
                    this.formData.routines.push(para);
                    this.addFormVisible = false;
                }
            },
            /**
             * 提交团队修改
             */
            addTeamSubmit: function () {
                console.log("addTeamSubmit:");
                this.$refs.detailForm.validate((valid) => {
                    console.log("addTeamSubmit:" + valid);
                    if (valid) {
                        let para = deepCopy(this.formData);
                        let valid_guide = false;
                        if (para.guide_id) {
                            valid_guide = true;
                        } else {
                            this.$message.error('请选择导游');
                        }
                        if (!valid_guide) return;

                        let valid_hotel = this.checkArrayData(para.hotels, "hotel_id", '请完善酒店信息');
                        if (!valid_hotel) return;
                        let valid_driver = this.checkArrayData(para.drivers, "driver_id", "请完善车队信息");
                        if (!valid_driver) return;
                        let valid_routines = this.checkArrayData(para.routines, "", "请完善日程信息");
                        if (!valid_routines) return;

                        let valid_more = valid_driver && valid_hotel && valid_guide;
                        if (valid_more) {
                            this.cleanFormData(para);
                            if (!para.editstate) {
                                addTeam(para).then((resp) => {
                                    this.$router.push({name: '团列表'});
                                })
                            } else {
                                updateTeam(para).then((resp) =>{
                                    this.$router.push({name: '团列表'});
                                })
                            }
                        } else {
                            // do nothing
                        }
                    }
                });
            },
            getCleanAddForm: function () {
                return {
                    date: "",
                    description: "",
                    eat: "",
                    location: "",
                };
            },

            showChoseGuide: function () {
                this.selectGuideVisible = true;
            },
            confirm_user: function (value) { // 完成用户选择
                this.selectGuideVisible = false;
                this.formData.guide_id = value.id;
                this.formData.local_guide = value.name;
                this.formData.local_guide_phone = value.phone;
            },
            delItemById: function (arr, id) {
                let del_index = 0;
                let if_has = false;
                for (let index = 0; index < arr.length; index++) {
                    if (arr[index].id === id) {
                        del_index = index;
                        if_has = true;
                        break;
                    }
                }
                if (if_has) {
                    arr.splice(del_index, 1);
                }
            }, deleteArrayId: function (arr) { // 新建数据的时候用户删除生成的随机id
                for (let index = 0; index < arr.length; index++) {
                    if (!arr[index].editstate) {
                        delete arr[index].id;
                    }
                }
            }, checkArrayData: function (arr, check_property, tips) { // 用于校验，酒店，车队，日程是否正确
                let valid_driver = true;
                console.log(arr);
                if (arr.length == 0) {
                    valid_driver = false;
                    this.$message.error(tips);
                } else if (check_property) {
                    for (let driver_index = 0; driver_index < arr.length; driver_index++) {
                        if (!arr[driver_index][check_property]) {
                            valid_driver = false;
                            this.$message.error(tips);
                        }
                    }
                }
                return valid_driver;
            },
            /**
             * 获取数据后对数据进行一定的格式化
             * @param para
             */
            deCleanFormData(para) {
                para.date_on = getDateFromString(para.date_on);
                para.date_off = getDateFromString(para.date_off);

                this.deFormateDateTime(para.hotels, "date_on");
                this.deFormateDateTime(para.drivers, "date_on");
                this.deFormateDateTime(para.routines, "date_on");

                this.addEditTag(para.hotels);
                this.addEditTag(para.drivers);
                this.addEditTag(para.routines);
                this.addEditTag(para.more_info);
                para.editstate = true;
                console.log(para);
                return para;
            },
            /**
             * 提交前清理数据
             * @param para
             */
            cleanFormData(para) {
                para.date_on = formateDateTime(para.date_on);
                para.date_off = formateDateTime(para.date_off);

                this.formateDateTime(para.hotels, "date_on");
                this.formateDateTime(para.drivers, "date_on");
                this.formateDateTime(para.routines, "date_on");

                this.deleteArrayId(para.hotels);
                this.deleteArrayId(para.drivers);
                this.deleteArrayId(para.routines);
            },

            /**
             * 格式化数组中的时间
             * @param arr
             * @param property_name
             */
            formateDateTime(arr, property_name) {
                for (let index = 0; index < arr.length; index++) {
                    if (typeof(arr[index][property_name]) != "string") {
                        arr[index][property_name] = formatDate(arr[index][property_name]);
                    }
                }
            },
            /**
             * 把字串转换成时间
             * @param arr
             * @param property_name
             */
            deFormateDateTime(arr, property_name) {
                for (let index = 0; index < arr.length; index++) {
                    if (typeof(arr[index][property_name]) == "string") {
                        arr[index][property_name] = getDateFromString(arr[index][property_name]);
                    }
                }
            },
            addEditTag(arr) {
                for (let index = 0; index < arr.length; index++) {
                    arr[index].editstate = true;
                }
            },
            formatDate(date) {
                console.log("date" + date);
                let svalue = formatDate(date);
                console.log("date" + svalue);
                return svalue;
            }
        },
        computed: {
            ...mapState([
                "guides",
                "locations",
                "hotels",
                "drivers",
            ])
        },
        mounted() {
            this.refreshGuides();
            this.refreshLocations();
            this.refreshHotels();
            this.refreshDrivers();

            if (Object.keys(this.$route.params).length > 0) {
                getData("team", this.$route.params).then((resp) => {
                    console.log("item detail");
                    console.log(resp.data.data);
                    this.formData = this.deCleanFormData(resp.data.data);
                });
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


</style>
<style lang="scss">
    .simple-chose-dialog {
        .el-dialog__body {
            padding-top: 0px;
        }
    }
</style>