import {
  getUploadSessions,
  postUploadSessionCancelled,
  postUploadSessionOverwritten,
} from '@/service';

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
  async postUploadSessionCancelled({ commit }, { id, body }) {
    const data = await postUploadSessionCancelled(id, {
      ...body,
    });
    commit('setUploadSessions', data);
  },
  async postUploadSessionOverwritten({ commit }, { id, body }) {
    const data = await postUploadSessionOverwritten(id, {
      ...body,
    });
    commit('setUploadSessions', data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
