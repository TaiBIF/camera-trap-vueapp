import idx from 'idx';

import { getAnnotations } from '@/service';
import { getLanguage } from '@/utils/i18n';

// 計畫標注資訊，全放在 project 會過大

const state = {
  annotations: [],
  annotationsTotal: 0,
};

const getters = {
  annotations: state =>
    state.annotations.map(v => ({
      ...v,
      species: {
        ...v.species,
        title: v.species[getLanguage()],
      },
    })),
};

const mutations = {
  setAnnotations(state, payload) {
    state.annotations = idx(payload, _ => _.items) || [];
    state.annotationsTotal = idx(payload, _ => _.total);
  },
};

const actions = {
  async getAnnotations({ commit }, query) {
    const data = await getAnnotations(query);
    commit('setAnnotations', data);
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
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-projectsprojectidannotations
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#put-projectsprojectidannotationsannotationid
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-annotations

*/
