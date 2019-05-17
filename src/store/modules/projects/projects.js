import idx from 'idx';
import produce from 'immer';

import { dateFormatYYYYMMDD } from '@/utils/dateHelper';
import {
  getIdentifiedSpecies,
  getProjectDetail,
  getProjectSpecies,
  getProjects,
  getRetrievalDataByCameraLocation,
  getRetrievalDataByProject,
  getRetrievalDataByStudyArea,
  postProject,
  postProjectMember,
  putProject,
  putProjectMember,
  putProjectSpecies,
} from '@/service';
import { getLanguage } from '@/utils/i18n';

// 計畫資料

const state = {
  projects: [],
  projectDetail: {}, // 計畫詳細資料，只記錄最後一筆
  projectSpecies: [], // 計畫物種列表
  identifiedSpecies: {}, // 已辨識物種
  retrievalData: {}, // 計畫資料辨識紀錄
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
  /*
   * https://github.com/TaiBIF/camera-trap-api/wiki/role-permission
   * https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#payload-6
   * manager (計畫管理員)
   * researcher (計畫研究員)
   * executor (計畫執行者)
   */
  isProjectManager: state => userId => {
    const projectMembers = idx(state, _ => _.projectDetail.members) || [];
    const permission = projectMembers.find(({ user }) => user.id === userId);

    if (permission && permission.role === 'manager') return true;
    return false;
  },
  isProjectResearcher: state => userId => {
    const projectMembers = idx(state, _ => _.projectDetail.members) || [];
    const permission = projectMembers.find(({ user }) => user.id === userId);

    if (permission && permission.role === 'researcher') return true;
    return false;
  },
  identifiedSpecies: state => {
    const records = idx(state, _ => _.identifiedSpecies.records) || [];
    records.sort(({ count: countA }, { count: countB }) => countB - countA);

    return records;
  },
  identifiedSpeciesLastUpdate: state => {
    const timeUpdated = idx(state, _ => _.identifiedSpecies.timeUpdated);

    if (timeUpdated) return dateFormatYYYYMMDD(timeUpdated);
    return '';
  },
  getReceivedRetrievalData: state => ({ year, id }) =>
    (idx(state, _ => _.retrievalData[year][id]) || Array(12)).map(item => {
      if (!item) return 0; // 無資料

      const { dataCount, fileCount } = item || {};
      if (dataCount === fileCount) return 1; // 當月資料完整
      return 2; // 當月資料不完整
      // TODO: status 3 相機撤除尚未導入
    }),
  getIdentifyRetrievalData: state => ({ year, id }) =>
    (idx(state, _ => _.retrievalData[year][id]) || Array(12)).map(item => {
      if (!item) return 0; // 無資料

      const { dataCount, speciesCount } = item || {};
      if (dataCount === speciesCount) return 1; // 當月資料已辨識
      return 2; // 當月資料未完整
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
  setProjectSpecies(state, data) {
    state.projectSpecies = data;
  },
  setIdentifiedSpecies(state, data) {
    state.identifiedSpecies = data;
  },
  setRetrievalData(state, { year, data }) {
    state.retrievalData = data.reduce(
      (res, { cameraLocation, studyArea, data }) => {
        const id = cameraLocation || studyArea;
        const selectYearData = res[year] || {};

        return {
          ...res,
          [year]: {
            ...selectYearData,
            [id]: data,
          },
        };
      },
      state.retrievalData,
    );
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
  async putProjectMember({ commit }, { projectId, members }) {
    const data = await putProjectMember(
      projectId,
      members.map(v => ({
        user: v.id,
        role: v.role.key,
      })),
    );
    commit('updateProjectMember', data);
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
  async loadIdentifiedSpecies({ commit }, projectId) {
    const data = await getIdentifiedSpecies(projectId);
    commit('setIdentifiedSpecies', data || {});
  },
  async loadRetrievalData(
    { commit },
    { year, projectId, studyAreaId, cameraLocationId },
  ) {
    let data = [];
    if (cameraLocationId) {
      data = await getRetrievalDataByCameraLocation({
        year,
        projectId,
        cameraLocationId,
      });
    } else if (studyAreaId) {
      data = await getRetrievalDataByStudyArea({
        year,
        projectId,
        studyAreaId,
      });
    } else {
      data = await getRetrievalDataByProject({ year, projectId });
    }
    commit('setRetrievalData', { year, data });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
