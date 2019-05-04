import Vue from 'vue';
import idx from 'idx';

import { dateFormatYYYYMMDDHHmmss } from '@/utils/dateHelper';
import { getAnnotations, getRevision, setAnnotations } from '@/service';

// 計畫標注資訊，全放在 project 會過大

const state = {
  annotations: [],
  annotationsTotal: 0,
  revision: [],
};

const getters = {
  annotations: state =>
    state.annotations.map(v => ({
      ...v,
      species: idx(v, _ => _.species.id),
    })),
  revision: state =>
    state.revision.map(v => ({
      id: v.id,
      name: v.user.name,
      isCurrent: v.isCurrent,
      createTime: dateFormatYYYYMMDDHHmmss(v.createTime),
    })),
};

const mutations = {
  resetAnnotations(state) {
    state.annotations = [];
    state.annotationsTotal = 0;
  },
  setAnnotations(state, payload) {
    state.annotations = idx(payload, _ => _.items) || [];
    state.annotationsTotal = idx(payload, _ => _.total);
  },
  updateAnnotations(state, annotation) {
    const idx = state.annotations.findIndex(v => v.id === annotation.id);
    Vue.set(state.annotations, idx, annotation);
  },
  setRevision(state, payload) {
    state.revision = payload;
  },
};

const actions = {
  async getAnnotations({ commit }, query) {
    const data = await getAnnotations(query);
    commit('setAnnotations', data);
  },
  async setAnnotations({ commit }, { annotationId, body }) {
    const data = await setAnnotations(annotationId, body);
    commit('updateAnnotations', data);
  },
  async getRevision({ commit }, annotationId) {
    const data = await getRevision(annotationId);
    commit('setRevision', idx(data, _ => _.items) || []);
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
