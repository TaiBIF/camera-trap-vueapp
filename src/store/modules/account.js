// 帳號資訊
import { getMe, logout, putMe } from '@/service';

const state = {
  profile: {},
};

const getters = {
  isLogin: state => state.profile && !!state.profile.id,
  userName: state => (state.profile && state.profile.name) || '',
  userEmail: state => (state.profile && state.profile.email) || '',
  userId: state => (state.profile && state.profile.id) || '',
  isAdministrator: state =>
    state.profile && state.profile.permission === 'administrator',
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
  async updateProfile({ commit }, { name, email }) {
    const data = await putMe({ name, email });
    commit('setProfile', data);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
