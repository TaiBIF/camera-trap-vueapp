import { getLanguage } from '@/utils/i18n';
import { getNotifications, getSystemAnnouncements } from '@/service';
import idx from 'idx';

const state = {
  systemAnnouncements: [],
  notifications: [],
};

const getters = {
  systemAnnouncements: state =>
    state.systemAnnouncements.map(({ id, message, createTime }) => ({
      id,
      message: idx(message, _ => _[getLanguage()]),
      createTime,
    })),
};

const mutations = {
  setSystemAnnouncements(state, payload) {
    state.systemAnnouncements = payload;
  },
  setNotifications(state, payload) {
    state.notifications = payload;
  },
};

const actions = {
  async loadSystemAnnouncements({ commit }) {
    const data = await getSystemAnnouncements();
    commit('setSystemAnnouncements', data);
  },
  async loadNotifications({ commit }) {
    const data = await getNotifications();
    commit('setNotifications', data);
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
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-system-notifications
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-menotifications

*/
