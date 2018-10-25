import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import TeamConfig from './data/viewmodel/team'
import ParseExcel from './views/tools/ParseExcel'
import MapTool from './views/tools/MapTool'
import CacheManager from './views/tools/CacheManager'


let routes = [
    {
        path: '/login',
        component: Login,
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        hidden: true
    },
    {
        path: '/main',
        component: Main,
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '主页',
        iconCls: 'el-icon-message',//图标样式class
        hidden: true,
        children: [
            {path: '/', component: Main, name: '主页', hidden: true},
        ]
    },
    // {
    //     path: '/',
    //     name: '团信息',
    //     component: Home,
    //     iconCls: 'fa fa-id-card-o',
    //     children: [
    //         {path: '/team/list', component: Simple2Admin, name: '团列表', meta: TeamConfig},
    //         {path: '/team/detail/:team_id', component: TeamDetail, name: '团详情', hidden: true},
    //         {path: '/team/detail/', component: TeamDetail, name: '团详情'},
    //         {path: '/team/account/:team_id', component: TeamAccount, name: '团账目', hidden: true},
    //         {path: '/team/account', component: TeamAccount, name: '团账目'},
    //         {path: '/team/money', component: Simple2Admin, name: '团款列表', meta: TeamMoneyConfig},
    //         {path: '/team/date', component: Simple2Admin, name: '团期列表', meta: TeamDateConfig},
    //     ]
    // },
    {
        path: '/',
        name: '用户',
        component: Home,
        iconCls: 'fa fa-id-card-o',
        children: [
            {path: '/user/parse_excel', component: ParseExcel, name: 'excel处理', meta: TeamConfig},
            {path: '/user/map', component: MapTool, name: '地图', meta: TeamConfig},
            {path: '/user/cachemanager', component: CacheManager, name: '缓存管理', meta: TeamConfig},
            // {path: '/user/health/:uid', component: UserHealthDetail, name: '用户详情', meta: TeamConfig},

        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: {path: '/404'}
    }
];

export default routes;