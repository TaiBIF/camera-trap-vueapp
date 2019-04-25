import idx from 'idx';
import produce from 'immer';

import {
  deleteProjectCameraLocations,
  getProjectCameraLocations,
  getProjectStudyAreas,
  postProjectCameraLocations,
  postProjectStudyAreas,
  putProjectCameraLocations,
} from '@/service';
import { getLanguage } from '@/utils/i18n';

// 計畫內的樣區資訊，全放在 project 會過大

const state = {
  studyAreas: [], // 計畫樣區列表
  cameraLocations: [], // 指定樣區內的相機位置列表，只保存最後一次的查詢結果
};

const getters = {
  studyAreas: state =>
    produce(JSON.parse(JSON.stringify(state.studyAreas)), draft =>
      draft.forEach(d => {
        d.title = d.title[getLanguage()];
        d.children.forEach(v => (v.title = v.title[getLanguage()]));
      }),
    ),
  cameraLocations: state => state.cameraLocations,
};

const mutations = {
  setStudyAreas(state, payload) {
    state.studyAreas = payload;
  },
  setCameraLocations(state, payload) {
    state.cameraLocations = payload;
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
  async getProjectCameraLocations({ commit }, { projectId, studyAreaId }) {
    const data = await getProjectCameraLocations(projectId, studyAreaId);
    commit('setCameraLocations', idx(data, _ => _.items) || []);
  },
  async postProjectCameraLocations(
    { dispatch },
    { projectId, studyAreaId, cameraLocation },
  ) {
    await postProjectCameraLocations(projectId, studyAreaId, cameraLocation);
    dispatch('getProjectCameraLocations', { projectId, studyAreaId });
  },
  async putProjectCameraLocations(
    { dispatch },
    { projectId, studyAreaId, cameraLocationId, cameraLocation },
  ) {
    await putProjectCameraLocations(
      projectId,
      cameraLocationId,
      cameraLocation,
    );
    dispatch('getProjectCameraLocations', { projectId, studyAreaId });
  },
  async deleteProjectCameraLocations(
    { dispatch },
    { projectId, studyAreaId, cameraLocationId },
  ) {
    await deleteProjectCameraLocations(projectId, cameraLocationId);
    dispatch('getProjectCameraLocations', { projectId, studyAreaId });
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
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#post-projectsprojectidstudy-areasstudyAreaIdcamera-locations

*/
