import { getUploadSessions } from '@/service';

const state = {
  uploadSessions: [],
};

const getters = {
  uploadSessions: state =>
    state.uploadSessions.map(({ id }) => ({
      id,
    })),
  // dataFields.description 內有多語系，處理只回傳當前語系內容
  /*
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
  */
};

const mutations = {
  setUploadSessions(state, payload) {
    state.uploadSessions = payload;
  },
  /*
  setProjectDetail(state, data) {
    state.projectDetail = data;
  },
  updateProjectMember(state, members) {
    state.projectDetail.members = members;
  },
  setProjectSpecies(state, data) {
    state.projectSpecies = data;
  },
  */
};

const actions = {
  async getUploadSessions({ commit }) {
    const data = await getUploadSessions();
    commit('setUploadSessions', data);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
