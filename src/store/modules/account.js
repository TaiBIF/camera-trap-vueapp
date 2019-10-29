// 帳號資訊
import { getAllSpecies, getMe, logout, putMe } from '@/service';
import { getLanguage } from '@/utils/i18n';
import idx from 'idx';

const state = {
  profile: {},
  species: [],
};

const getters = {
  isLogin: state => state.profile && !!state.profile.id,
  userName: state => idx(state, _ => _.profile.name) || '',
  userEmail: state => idx(state, _ => _.profile.email) || '',
  userId: state => idx(state, _ => _.profile.id),
  hotkeys: state =>
    (idx(state, _ => _.profile.hotkeys) || []).map(({ hotkey, species }) => ({
      hotkey,
      species: {
        ...species,
        title: idx(species, _ => _.title[getLanguage()]) || '',
      },
    })),
  /*
   * https://github.com/TaiBIF/camera-trap-api/wiki/role-permission
   * https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-me
   * administrator (系統管理員)
   * general-account (一般使用者, 權限依計畫內 role 設定)
   */
  isAdministrator: state =>
    idx(state, _ => _.profile.permission) === 'administrator',
  species: state =>
    (state.species || []).map(({ id, title, dataCount }) => ({
      id,
      title: title[getLanguage()],
      dataCount,
    })),
};

const mutations = {
  setProfile(state, payload) {
    state.profile = payload;
  },
  setSpecies(state, payload) {
    state.species = payload;
  },
};

const actions = {
  async loadProfile({ commit }) {
    const data = await getMe();
    commit('setProfile', data);
  },
  async loadSpecies({ commit }) {
    const { items } = await getAllSpecies();
    commit('setSpecies', items || []);
  },
  async doLogout({ commit }) {
    await logout();
    commit('setProfile', {});
  },
  async updateProfile({ commit }, { name, email, hotkeys }) {
    const data = await putMe({ name, email, hotkeys });
    commit('setProfile', data);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
