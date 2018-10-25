<template>
    <section>
        <el-card class='numberCard' bordered=false   style='padding: 0'>
            <div class="iconWrap"></div>
            <div class='content'>
                <p class='title'>{{ cardname }}</p>
                <p class='number'>{{ cardvalue }}</p>
            </div>
        </el-card>
    </section>
</template>

<script>
    export default {
        data(){
            return {}
        },
        props: {
            cardname: '',
            cardvalue: '',
        }
    }
</script>

<style scoped lang="scss">

    .numberCard {
        padding: 32px;
        margin: 10px;
        cursor: pointer;

        .iconWrap {
            width: 54px;
            height: 54px;
            float: left;
            background: url('/static/image/team.png') no-repeat;
            background-size: cover;
            /*background-size: 100%;*/
        }

        .content {
            width: 100%;
            padding-left: 78px;

            .title {
                line-height: 16px;
                font-size: 16px;
                margin-bottom: 8px;
                height: 16px;
            }

            .number {
                line-height: 32px;
                font-size: 24px;
                height: 32px;
            }
        }
    }
</style>