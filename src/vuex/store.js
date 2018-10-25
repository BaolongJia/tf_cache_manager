import Vue from 'vue'
import Vuex from 'vuex'
// import * as actions from './actions'
// import * as getters from './getters'

Vue.use(Vuex)

import {
    getCompanyList,
    getJobList,
    getDepartmentList,
    getGuides,
    getLocations,
    getProdDataListPage,
    getAccountConfig,
} from '../api/api'

import {
    accountStatus,
    accountAllotType
} from '../tools/config'

// 应用初始状态
const state = {
    companies: [],
    parties: [],
    duties: [],
    guides: [],
    locations: [],
    hotels: [],
    drivers: [],
    accountConfig:{},
}

// 定义所需的 mutations
const mutations = {
    setCompanies(state, data){
        state.companies.length = 0;
        state.companies.push(...data);
    },
    setParties(state, data){
        state.parties.length = 0;
        state.parties.push(...data);
    },
    setDuties(state, data){
        state.duties.length = 0;
        state.duties.push(...data);
    },
    setGuides(state, data){
        state.guides.length = 0;
        state.guides.push(...data);
    },
    setLocations(state, data){
        state.locations.length = 0;
        state.locations.push(...data);
    },
    setHotels(state, data){
        state.hotels.length = 0;
        state.hotels.push(...data);
    },
    setDrivers(state, data){
        state.drivers.length = 0;
        state.drivers.push(...data);
    },
    setAccountConfig(state, data){
        state.accountConfig = {};
        data.allot_type =accountAllotType.getArray();
        data.account_status=accountStatus;
        state.accountConfig = data;
    }
};

const actions = {
    refreshCompanies(context){
        getCompanyList().then(resp => {
                console.log('getCompanyList')
                context.commit("setCompanies", resp.data.data);
            }
        )
    },
    refreshParties(context){
        getDepartmentList().then(resp=>{
            console.log('refreshParties')
            context.commit("setParties", resp.data.data);
        })
    },
    refreshDuties(context){
        getJobList().then(resp=>{
            context.commit("setDuties", resp.data.data);
        })
    },
    refreshGuides(context){
        getGuides().then(resp=>{
            context.commit("setGuides", resp.data.data.data);
        })
    },
    refreshLocations(context){
        getLocations().then(resp=>{
            context.commit("setLocations", resp.data.data.data);
        })
    },
    refreshHotels(context){
        getProdDataListPage('hotel', {}).then(resp=>{
            context.commit("setHotels", resp.data.data.data);
        })
    },
    refreshDrivers(context){
        getProdDataListPage('driver', {}).then(resp=>{
            context.commit("setDrivers", resp.data.data.data);
        })
    },
    refreshAccountConfig(context){
        if(context.state.accountConfig != undefined && Object.keys(context.state.accountConfig).length > 0){
            return;
        }
        getAccountConfig().then(resp=>{
            context.commit('setAccountConfig', resp.data.data.data);
        })
    },
    refreshBaseInfo(context){
        context.dispatch("refreshCompanies");
        context.dispatch("refreshParties");
        context.dispatch("refreshDuties");
    },
}

// 创建 store 实例
export default new Vuex.Store({
    state,
    mutations,
    actions,
})