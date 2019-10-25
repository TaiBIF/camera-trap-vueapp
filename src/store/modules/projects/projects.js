import Vue from 'vue';
import idx from 'idx';
import produce from 'immer';

import { dateFormatYYYY, dateFormatYYYYMMDD } from '@/utils/dateHelper';
import {
  getAllProjects,
  getIdentifiedSpecies,
  getProjectDetail,
  getProjectSpecies,
  getProjects,
  getPublicProjects,
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
  projectsTotal: 0,
  projectsPublicTotal: 0,
  projectDetail: {}, // 計畫詳細資料，只記錄最後一筆
  projectSpecies: [], // 計畫物種列表
  identifiedSpecies: {}, // 已辨識物種
  retrievalData: {
    lastUpdate: '',
    loadingStatus: 'init', // init -> loading -> loaded
  }, // 計畫資料辨識紀錄
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
  identifiedSpecies: state =>
    idx(state, _ => _.identifiedSpecies.records) || [],
  identifiedSpeciesLastUpdate: state => {
    const timeUpdated = idx(state, _ => _.identifiedSpecies.timeUpdated);

    if (timeUpdated) return dateFormatYYYYMMDD(timeUpdated);
    return '';
  },
  // TODO: prevent show loading screen if data already exist
  retrievalLoadingStatus: state =>
    idx(state, _ => _.retrievalData.loadingStatus),
  retrievalDataLastUpdate: state => {
    const lastUpdateTimeString = idx(state, _ => _.retrievalData.lastUpdate);
    if (lastUpdateTimeString) return dateFormatYYYYMMDD(lastUpdateTimeString);
    return '';
  },
  getRetrievalData: state => ({ year, id }) =>
    (idx(state, _ => _.retrievalData[year][id]) || Array(12)).map(item => {
      if (!item) return 0; // 無資料

      const { dataCount, fileCount } = item || {};
      if (dataCount === fileCount) return 1; // 當月資料完整
      return 2; // 當月資料不完整
      // TODO: status 3 相機撤除尚未導入
    }),
  getIdentifiedData: state => ({ year, id }) =>
    (idx(state, _ => _.retrievalData[year][id]) || Array(12)).map(item => {
      if (!item) return 0; // 無資料

      const { dataCount, speciesCount } = item || {};
      if (dataCount === speciesCount) return 1; // 當月資料已辨識
      return 2; // 當月資料未完整
    }),
  getCameraRetrievalData: state => ({ year, id }) =>
    (idx(state, _ => _.retrievalData[year][id]) || Array(12)).map(item => {
      const { dataCount, fileCount, failures, lastData } = item || {};

      return {
        dataCount: dataCount || 0,
        failures,
        isDataComplete: dataCount === fileCount,
        isCameraRemove: false, // TODO: 相機撤除尚未導入
        lastUpdate: dateFormatYYYYMMDD(lastData),
      };
    }),
  getLatestAnnotationYear: state => {
    const latestAnnotationTime = idx(
      state,
      _ => _.projectDetail.latestAnnotationTime,
    );
    if (!latestAnnotationTime) return null;
    return parseInt(dateFormatYYYY(latestAnnotationTime), 10);
  },
};

const mutations = {
  setProjects(state, payload) {
    state.projects = payload;
  },
  setPublicProjects(state, payload) {
    state.projects = payload;
  },
  appendProjects(state, payload) {
    state.projects = [...state.projects, ...payload];
  },
  setProjectsTotal(state, payload) {
    state.projectsTotal = payload;
  },
  setProjectsPublicTotal(state, payload) {
    state.projectsPublicTotal = payload;
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
    let records = [];
    if (data.records && data.records.length > 0) {
      records = [...data.records];
      records.sort(({ count: countA }, { count: countB }) => countB - countA);
    }
    state.identifiedSpecies = {
      ...data,
      records,
    };
  },
  setRetrievalStatus(state, status) {
    Vue.set(state.retrievalData, 'loadingStatus', status);
  },
  setRetrievalLastUpdate(state, timeUpdated) {
    Vue.set(state.retrievalData, 'lastUpdate', timeUpdated);
  },
  setRetrievalData(state, { year, items }) {
    const selectedYearData = items.reduce(
      (res, { cameraLocation, studyArea, data }) => {
        const id = cameraLocation || studyArea;

        return {
          ...res,
          [id]: data,
        };
      },
      state.retrievalData[year] || {},
    );

    Vue.set(state.retrievalData, year, selectedYearData);
  },
};

const actions = {
  async getProjects({ commit }, payload) {
    const data = await getProjects(payload);
    commit(
      payload.index === 0 ? 'setProjects' : 'appendProjects',
      idx(data, _ => _.items) || [],
    );
    commit('setProjectsTotal', data.total);
  },
  async getPublicProjects({ commit }, payload) {
    const data = await getPublicProjects(payload);
    commit(
      payload.index === 0 ? 'setPublicProjects' : 'appendProjects',
      idx(data, _ => _.items) || [],
    );
    commit('setProjectsPublicTotal', data.total);
  },
  async getAllProjects({ commit }, query) {
    const data = await getAllProjects(query);
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
    commit('setRetrievalStatus', 'loading');
    commit('setRetrievalLastUpdate', '');
    let res = {};
    if (cameraLocationId) {
      res = await getRetrievalDataByCameraLocation({
        year,
        projectId,
        cameraLocationId,
      });
    } else if (studyAreaId) {
      res = await getRetrievalDataByStudyArea({
        year,
        projectId,
        studyAreaId,
      });
    } else {
      res = await getRetrievalDataByProject({ year, projectId });
    }
    const { items, timeUpdated } = res || {};
    commit('setRetrievalStatus', 'loaded');
    commit('setRetrievalLastUpdate', timeUpdated);
    commit('setRetrievalData', { year, items });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
