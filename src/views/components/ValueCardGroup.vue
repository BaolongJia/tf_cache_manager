/**
* Created by xiangc on 2017/7/29.
*/
<template>
    <section>
        <template v-for="item in card_data">
            <el-col :span="card_col_size">
                <value-card class="value-card" :cardname="item.key" :cardvalue="item.value" :linkto="item.scheme">
                </value-card>
            </el-col>
        </template>
    </section>
</template>

<script>
    import ValueCard from './ValueCard.vue';
    export default {
        data: function () {
            return {}
        },
        components: {ValueCard},
        props: {
            data: {
                default: function () {
                    return {
                        data: [],
                    }
                }
            }
        },
        methods: {},
        computed: {
            card_data: function () {
                return this.data;
            },
            card_col_size: function () {
                return 24 / this.data.length;
            }
        }
    }
</script>

<style scoped lang="scss">
    .el-col {
        border-radius: 4px;
        margin-top: 10px;

        .value-card {
            margin-right: 5px;
        }

        .el-card {
            margin-right: 5px;
        }
        .title {
            text-align: center;
            color: #48576a;
        }
    }
</style>