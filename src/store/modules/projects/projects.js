import idx from 'idx';
import produce from 'immer';

import { getLanguage } from '@/utils/i18n';
import { getProjectDetail, getProjects } from '@/service';

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
    }),
};

const mutations = {
  setProjects(state, payload) {
    state.projects = payload;
  },
  setProjectDetail(state, data) {
    state.projectDetail = data;
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
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

/*
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#post-projects
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#put-projectsprojectid
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-projectsprojectidspecies
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#post-projectsprojectidspecies
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#put-projectsprojectidspeciesspeciesid
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#delete-projectsprojectidspeciesspeciesid
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#post-projectsprojectidmembers
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#delete-projectsprojectidmembersuserid

*/
