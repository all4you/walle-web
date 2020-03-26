import { getUserInfo } from '@/api/userService'
import { getToken, setToken, removeToken, setUserInfo, removeUserInfo } from '@/utils/dataStorage'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  account: '',
  avatar: '',
  userInfo: null,
}

const mutations = {
  resetState: (s) => {
    Object.assign(s, state)
  },
  setToken: (state, token) => {
    state.token = token
  },
  setAccount: (state, name) => {
    state.account = name
  },
  setAvatar: (state, avatar) => {
    state.avatar = avatar
  },
  setUserInfo: (state, userInfo) => {
    state.userInfo = userInfo
  },
}

const actions = {

  // get user info
  getUserInfoAction({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo()
        .then(content => {
            const user = content
            setUserInfo(user)
            commit('setUserInfo', user)
            commit('setAccount', user.account)
            commit('setAvatar', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
            resolve(user)
        }).catch(error => {
          console.error("getUserInfoAction catch error===>", error)
          reject(error.errorMsg)
        })
    })
  },

  setUserInfoAction({ commit }, user) {
    setUserInfo(user)
    commit('setUserInfo', user)
    commit('setAvatar', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
  },
  
  setTokenAction({ commit }, token) {
    setToken(token)
    commit('setToken', token)
  },

  resetStateAction({ commit }) {
    removeToken() // must remove  token  first
    removeUserInfo()
    resetRouter()
    commit('resetState')
  },

  // remove token
  resetTokenAction({ commit }) {
    removeToken() // must remove  token  first
    removeUserInfo()
    commit('resetState')
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

