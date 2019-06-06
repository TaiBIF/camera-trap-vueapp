import {
  cancelUploadSession,
  getUploadSessions,
  postUploadSession,
} from '@/service';

const state = {
  uploadSessions: [],
  uploadSessionOverwritten: [],
  uploadSessionCancelled: [],
};

const mutations = {
  setUploadSessions(state, payload) {
    state.uploadSessions = payload;
  },
  postUploadSession(state, payload) {
    state.uploadSessionOverwritten = payload;
  },
  cancelUploadSession(state, payload) {
    state.uploadSessionCancelled = payload;
  },
};

const actions = {
  async getUploadSessions({ commit }) {
    const data = await getUploadSessions();
    commit('setUploadSessions', data);
  },
  async postUploadSession({ commit }) {
    const data = await postUploadSession();
    commit('postUploadSession', data);
  },
  async cancelUploadSession({ commit }) {
    const data = await cancelUploadSession();
    commit('cancelUploadSession', data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
