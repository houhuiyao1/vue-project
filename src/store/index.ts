import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user:JSON.parse(window.localStorage.getItem('user')||'null')//记录当前用户登陆状态
  },
  mutations: {
    setUser(state,payload){
      state.user = JSON.parse(payload)
      window.localStorage.setItem('user',payload)
    }
  },
  actions: {
  },
  modules: {
  }
})