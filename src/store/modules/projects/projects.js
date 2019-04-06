import idx from 'idx';
import produce from 'immer';

import {
  deleteProjectMember,
  getProjectDetail,
  getProjects,
  postProject,
  postProjectMember,
  putProject,
} from '@/service';
import { getLanguage } from '@/utils/i18n';

// 計畫資料

const state = {
  projects: [],
  projectDetail: {}, // 計畫詳細資料，只記錄最後一筆
};

const getters = {
  // dataFields.description 內有多語系，處理只回傳當前語系內容
  projectDetail: state =>
    produce(JSON.parse(JSON.stringify(state.projectDetail)), draft => {
      draft.dataFields &&
        draft.dataFields.forEach(
          v => (v.description = v.description[getLanguage()]),
        );
      draft.areas &&
        draft.areas.forEach(v => (v.title = v.title[getLanguage()]));
    }),
};

const mutations = {
  setProjects(state, payload) {
    state.projects = payload;
  },
  setProjectDetail(state, data) {
    state.projectDetail = data;
  },
  updateProjectMember(state, members) {
    state.projectDetail.members = members;
  },
};

const actions = {
  async getProjects({ commit }) {
    const data = await getProjects();
    commit('setProjects', idx(data, _ => _.items) || []);
  },
  async getProjectDetail({ commit }, id) {
    const data = await getProjectDetail(id);
    commit('setProjectDetail', data);
  },
  async postProject({ commit }, body) {
    const data = await postProject({
      ...body,
      areas: body.areas.map(v => v.id),
    });
    commit('setProjectDetail', data);
  },
  async putProject({ commit }, { id, body }) {
    const data = await putProject(
      id,
      produce(JSON.parse(JSON.stringify(body)), draft => {
        draft.areas = draft.areas.map(v => v.id);
        draft.coverImageFile = draft.coverImageFile.id
          ? draft.coverImageFile.id
          : draft.coverImageFile;
        draft.dataFields = draft.dataFields.map(v => v.id);
      }),
    );
    commit('setProjectDetail', data);
  },
  async postProjectMember({ commit }, { id, body }) {
    const data = await postProjectMember(id, body);
    if (!data.message) {
      commit('updateProjectMember', data);
    } else {
      return data;
    }
  },
  async deleteProjectMember({ state, commit }, { id, userId }) {
    const data = await deleteProjectMember(id, userId);
    if (data.status === 204) {
      commit(
        'updateProjectMember',
        state.projectDetail.members.filter(v => v.user.id !== userId),
      );
    } else {
      return data;
    }
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
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-projectsprojectidspecies
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#put-projectsprojectidspecies
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#post-projectsprojectidspecies
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#put-projectsprojectidspeciesspeciesid

*/
