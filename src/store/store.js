import Vue from 'vue'
import Vuex from 'vuex'
import Projects from "./modules/projects";

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules: {
        Projects,
    },
    state: {},
    mutations: {},
    actions: {},
    getters: {}

});