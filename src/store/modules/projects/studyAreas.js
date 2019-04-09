import produce from 'immer';

import { getLanguage } from '@/utils/i18n';
import { getProjectStudyAreas, postProjectStudyAreas } from '@/service';

// 計畫內的樣區資訊，全放在 project 會過大

const state = {
  studyAreas: [], // 計畫樣區列表
};

const getters = {
  studyAreas: state =>
    produce(JSON.parse(JSON.stringify(state.studyAreas)), draft =>
      draft.forEach(d => {
        d.title = d.title[getLanguage()];
        d.children.forEach(v => (v.title = v.title[getLanguage()]));
      }),
    ),
};

const mutations = {
  setStudyAreas(state, payload) {
    state.studyAreas = payload;
  },
  addStudyAreas(state, payload) {
    state.studyAreas = payload;
  },
};

const actions = {
  async getProjectStudyAreas({ commit }, id) {
    const data = await getProjectStudyAreas(id);
    commit('setStudyAreas', data);
  },
  async postProjectStudyAreas({ dispatch }, { id, area }) {
    const body = {
      ...area,
      title: {
        [getLanguage()]: area.title,
      },
    };
    await postProjectStudyAreas(id, body);
    dispatch('getProjectStudyAreas', id);
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
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-projectsprojectidcamera-locations
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-projectsprojectidstudy-areasstudyareaidcamera-locations
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#post-projectsprojectidstudy-areasstudyareaidcamera-locations
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#put-projectsprojectidcamera-locationscameralocationid
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#delete-projectsprojectidcamera-locationscameralocationid

*/
