// 帳號資訊
import { getMe, logout } from '@/service';

const state = {
  profile: {},
};

const getters = {
  isLogin: state => state.profile && !!state.profile.id,
  userName: state => (state.profile && state.profile.name) || '',
};

const mutations = {
  setProfile(state, payload) {
    state.profile = payload;
  },
};

const actions = {
  async loadProfile({ commit }) {
    const data = await getMe();
    commit('setProfile', data);
  },
  async doLogout({ commit }) {
    await logout();
    commit('setProfile', {});
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

/*
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-me
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#put-me
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#post-logout

*/
