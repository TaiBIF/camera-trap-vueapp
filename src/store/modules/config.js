import { getLanguage } from '@/utils/i18n';
import { getProjectAreas } from '@/service';
import idx from 'idx';

// 各種專案設定

const state = {
  projectAreas: [],
};

const getters = {
  projectAreas: state =>
    state.projectAreas.map(({ id, title }) => ({
      id,
      title: idx(title, _ => _[getLanguage()]),
    })),
};

const mutations = {
  setProjectAreas(state, payload) {
    state.projectAreas = payload;
  },
};

const actions = {
  async getProjectAreas({ commit }) {
    const data = await getProjectAreas();
    commit('setProjectAreas', idx(data, _ => _.items) || []);
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
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-config

*/
