import {
  deleteProjectCamera,
  editProjectCamera,
  getProjectCameras,
} from '@/service';
import idx from 'idx';

const state = {
  projectCameras: [],
  editProjectCameraList: [],
};

const mutations = {
  setProjectCameras(state, payload) {
    state.projectCameras = payload;
  },
  setEditProjectCameraList(state, payload) {
    state.editProjectCameraList = payload;
  },
};

const actions = {
  async getProjectCameras({ commit }, { projectId }) {
    const data = await getProjectCameras(projectId);
    commit('setProjectCameras', idx(data, _ => _.items) || []);
  },
  setEditProjectCameraList({ commit }, payload) {
    commit('setEditProjectCameraList', payload);
  },
  async editProjectCameras({ dispatch }, payload) {
    await Promise.all(
      payload.map(async body => {
        await editProjectCamera(body);
      }),
    );
    if (payload.length)
      dispatch('getProjectCameras', { projectId: payload[0].project });
  },
  async deleteProjectCamera({ dispatch }, { projectId, cameraId }) {
    await deleteProjectCamera(projectId, cameraId);
    dispatch('getProjectCameras', { projectId });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
