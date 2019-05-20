import { getUploadSessions } from '@/service';

const state = {
  uploadSessions: [],
};

const mutations = {
  setUploadSessions(state, payload) {
    state.uploadSessions = payload;
  },
};

const actions = {
  async getUploadSessions({ commit }) {
    const data = await getUploadSessions();
    commit('setUploadSessions', data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
