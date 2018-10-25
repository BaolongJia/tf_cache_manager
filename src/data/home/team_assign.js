/**
 * Created by xiangc on 2017/7/5.
 */
export default {
    fieldmap:[
        {
            key:"num",
            name:"团号",
            width: 100,
        },
        {
            key:"title",
            name:"标题",
            width: 200,
        }
    ]
}

function getConfig() {
    return {
        fieldmap:[
            {
                key:"num",
                name:"团号",
                width: 100,
            },
            {
                key:"title",
                name:"标题",
                width: 200,
            }
        ]
    }
}

export {getConfig}