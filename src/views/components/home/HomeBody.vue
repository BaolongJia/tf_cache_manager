/**
* Created by xiangc on 2017/7/5.
*/
<template>
    <div>
        <el-row class="row">
            <template v-for="item in table_data_list">
                <el-col class="col" :span="12">
                    <SimpleTable :title="item.name" :srcdata="item.data" :config="item.config"></SimpleTable>
                </el-col>
            </template>
        </el-row>
    </div>
</template>

<script>
    import ElCol from "element-ui/packages/col/src/col";
    import SimpleTable from "../SimpleTable.vue"
    import {getAssignedTeam, getUnassignedTeam, getCheckedTeam, getUncheckedTeam} from "../../../api/api"
    import TeamConfig from "../../../data/home/team_assign"
    import {getConfig} from "../../../data/home/team_assign"

    export default {
        components: {ElCol, SimpleTable},
        data: function () {
            return {}
        },
        props: {
            table_list: {
                default: function () {
                    return []
                }
            }
        },
        methods: {},
        mounted: function () {
        },
        computed: {
            table_data_list: function () {
                for (let key in this.table_list) {
                    let current_item = this.table_list[key];
                    current_item.config = {
                        fieldmap: [
                            {
                                key: Object.keys(current_item.colname)[0],
                                name: Object.values(current_item.colname)[0],
                                width: 100,
                            },
                            {
                                key: Object.keys(current_item.colname)[1],
                                name: Object.values(current_item.colname)[1],
                                width: 200,
                            }
                        ]
                    };
                }

                return this.table_list;
            },

        }
    }
</script>

<style scoped lang="scss">
    .row {
        margin: 10px 0;

        .col {
            padding: 5px 10px;
        }
    }
</style>