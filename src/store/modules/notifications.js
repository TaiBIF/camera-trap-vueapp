import { getLanguage } from '@/utils/i18n';
import {
  getNotifications,
  getSystemAnnouncements,
  postNotificationsRead,
} from '@/service';
import idx from 'idx';

const state = {
  systemAnnouncements: [],
  notifications: [],
};

const getters = {
  systemAnnouncements: state =>
    state.systemAnnouncements.map(({ id, message, createTime }) => ({
      id,
      message: idx(message, _ => _[getLanguage()]) || '',
      createTime,
    })),
  notifications: state =>
    state.notifications.map(
      ({
        id,
        type,
        dataField,
        sender,
        uploadSession,
        createTime,
        isRead,
        message,
      }) => {
        const result = {
          id,
          type,
          createTime,
          isRead,
          dataField: {},
          sender: {},
          message: {},
          uploadSession: {
            project: {},
            studyArea: {},
            cameraLocation: {},
          },
        };

        if (dataField) {
          result.dataField = {
            ...dataField,
            title: idx(dataField, _ => _.title[getLanguage()]) || '',
          };
        }
        if (sender) {
          result.sender = sender;
        }

        if (message) {
          result.message = message;
        }

        if (uploadSession) {
          const { project, cameraLocation } = uploadSession;
          const { studyArea, name, settingTime } = cameraLocation || {};
          const { id: projectId, title: projectTitle } = project || {};
          const { id: studyAreaId, title: studyAreaTitle, parent } =
            studyArea || {};

          result.uploadSession = {
            project: {
              id: projectId,
              title: projectTitle,
            },
            studyArea: {
              id: studyAreaId,
              title: studyAreaTitle ? studyAreaTitle[getLanguage()] : '',
              parentTitle: parent ? parent.title[getLanguage()] : '',
            },
            cameraLocation: {
              name,
              settingTime,
            },
          };
        }

        return result;
      },
    ),
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
  async reaAllNotifications({ commit }) {
    await postNotificationsRead();
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
