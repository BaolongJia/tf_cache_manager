<template>
    <section>
        <el-card @click.native="go()" class='numberCard' bordered=false   style='padding: 0'>
            <div class='content'>
                <p class='title'>{{ cardname }}{{ addMaohao(cardvalue) }}</p>
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
            linkto:'',
        },
        methods:{
            go: function () {
                this.$router.push(this.linkto);
            },
            addMaohao: function (value) {
                if(value && (""+value).length > 0){
                    return ":"+value;
                } else {
                    return ""
                }
            },
        },
        computed:{
        }
    }
</script>

<style scoped lang="scss">

    .numberCard {
        padding: 32px;
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
            text-align: center;
            vertical-align: middle;

            .title {
                line-height: 16px;
                font-size: 16px;
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