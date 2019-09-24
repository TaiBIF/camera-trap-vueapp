import { getCameras } from '@/service';
import idx from 'idx';

const state = {
  cameras: [],
};

const mutations = {
  setCameras(state, payload) {
    state.cameras = payload;
  },
};

const actions = {
  async getCameras({ commit }) {
    const data = await getCameras();
    commit('setCameras', idx(data, _ => _.items) || []);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
