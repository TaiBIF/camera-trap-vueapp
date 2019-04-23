import idx from 'idx';
import produce from 'immer';

import { getLanguage } from '@/utils/i18n';
import {
  getProjectDetail,
  getProjectSpecies,
  getProjects,
  postProject,
  postProjectMember,
  putProject,
  putProjectMember,
  putProjectSpecies,
} from '@/service';

// 計畫資料

const state = {
  projects: [],
  projectDetail: {}, // 計畫詳細資料，只記錄最後一筆
  projectSpecies: [], // 計畫物種列表
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
  projectSpecies: state => {
    return state.projectSpecies
      .map(v => ({
        id: v.id,
        index: v.index,
        code: v.code,
        title: v.title[getLanguage()],
      }))
      .sort((a, b) => a.index - b.index);
  },
  projectDataFields: state =>
    state.projectDetail.dataFields
      ? state.projectDetail.dataFields.map(v => ({
          ...v,
          title: v.title[getLanguage()],
          description: v.description[getLanguage()],
        }))
      : [],
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
  setProjectSpecies(state, data) {
    state.projectSpecies = data;
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
        draft.coverImageFile = idx(draft, _ => _.coverImageFile.id)
          ? draft.coverImageFile.id
          : draft.coverImageFile;
        draft.dataFields = draft.dataFields.map(v => v.id);
      }),
    );
    commit('setProjectDetail', data);
  },
  async postProjectMember({ commit }, { id, body }) {
    const data = await postProjectMember(id, {
      ...body,
      role: idx(body, _ => _.role.key),
    });
    commit('updateProjectMember', data);
  },
  async putProjectMember({ commit }, { projectId, payload }) {
    const requests = payload.map(v =>
      putProjectMember(projectId, v.id, { role: v.role.key }),
    );
    const data = await Promise.all(requests);
    commit('updateProjectMember', data.pop());
  },
  async getProjectSpecies({ commit }, id) {
    const data = await getProjectSpecies(id);
    commit('setProjectSpecies', idx(data, _ => _.items) || []);
  },
  async putProjectSpecies({ commit }, { id, species }) {
    const body = species.map(v =>
      v.id
        ? { id: v.id }
        : {
            title: {
              [getLanguage()]: v.title,
            },
          },
    );
    const data = await putProjectSpecies(id, body);
    commit('setProjectSpecies', idx(data, _ => _.items) || []);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
