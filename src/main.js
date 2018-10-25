import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import routes from './routes'

// let mocktag = sessionStorage.getItem("intmock")
import http from './tools/http'
import Mocker from './mock'
Mocker.bootstrap(http);
import 'font-awesome/css/font-awesome.min.css'
Vue.prototype.$http = http;

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);
// Vue.use(BaiduMap, {
//     ak: '2b20d3668b2a0727c99739a0a5d010f7'
// });
var createCookie = function(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
};
createCookie("user", "1", 30);
createCookie("platform", "web", 30);


//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
    routes
});

// router.beforeEach((to, from, next) => {
//     //NProgress.start();
//     if (to.path == '/login') {
//         sessionStorage.removeItem('user');
//     }
//     let user = JSON.parse(sessionStorage.getItem('user'));
//     if (!user && to.path != '/login') {
//         next({path: '/login'})
//     } else {
//         next()
//     }
// })

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

