<template>
    <section style="padding-top: 10px">
        <el-upload :show-file-list="false" :on-success="onUploadSuccess" class="upload-demo" drag :file-list="fileList" action="/api/upload_file" multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传csv文件</div>
        </el-upload>
        <el-card class="box-card" v-for="item in fileList">
            <div style='width:100%;height:100%' @click="goDownload(item['name'])">
                {{ item['name'] }}
            </div>
        </el-card>
    </section>
</template>

<script>
    export default {
        components: {},
        data: function() {
            return {
                fileList: [],
                data:{},
            };
        },
        props: {},
        methods: {
            goDownload(fileName){
                // console.log(file)
                window.open('api/download?file_name='+fileName)
            },
            onUploadSuccess(resp, file) {
                this.fileList = this.fileList.concat(resp.data.file_list)
            }
        },
        mounted() {}
    };
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
</style>

<style lang="scss">
    
</style>