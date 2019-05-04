import Vue from 'vue';
import idx from 'idx';

import { dateFormatYYYYMMDDHHmmss } from '@/utils/dateHelper';
import {
  getAnnotations,
  getRevision,
  rollbackRevision,
  setAnnotations,
} from '@/service';

// 計畫標注資訊，全放在 project 會過大

const state = {
  query: {}, // 暫存最後一次的 annotations query，讓還原版本之後可以再次取值
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
  saveQuery(state, query) {
    state.query = query;
  },
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
    commit('saveQuery', query);
  },
  async setAnnotations({ commit }, { annotationId, body }) {
    const data = await setAnnotations(annotationId, body);
    commit('updateAnnotations', data);
  },
  async getRevision({ commit }, annotationId) {
    const data = await getRevision(annotationId);
    commit('setRevision', idx(data, _ => _.items) || []);
  },
  async rollbackRevision({ state, dispatch }, { annotationId, revisionId }) {
    await rollbackRevision(annotationId, revisionId);

    dispatch('getRevision', annotationId);
    dispatch('getAnnotations', state.query); // todo 目前是整個重新 query，之後需改成用新 api 只更新指定 annotation
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
