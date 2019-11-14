import {
  addProjectTrip,
  deleteProjectTrip,
  editProjectTrip,
  getProjectTrips,
} from '@/service';
import idx from 'idx';

const state = {
  projectTrips: [],
  editProjectTripData: {},
};

const mutations = {
  setProjectTrips(state, payload) {
    state.projectTrips = payload;
  },
  setEditProjectTripData(state, payload) {
    state.editProjectTripData = payload;
  },
};

const actions = {
  async getProjectTrips({ commit }, projectId) {
    const data = await getProjectTrips(projectId);
    commit('setProjectTrips', idx(data, _ => _.items) || []);
  },
  async addProjectTrip({ dispatch }, { projectId, body, reGetProjectTrip }) {
    await addProjectTrip(projectId, body);
    if (reGetProjectTrip) {
      dispatch('getProjectTrips', projectId);
    }
  },
  async setEditProjectTripData({ commit }, payload) {
    commit('setEditProjectTripData', payload);
  },
  async editProjectTrip(
    { dispatch },
    { projectId, tripId, body, reGetProjectTrip = true },
  ) {
    await editProjectTrip(projectId, tripId, body);
    if (reGetProjectTrip) dispatch('getProjectTrips', projectId);
  },
  async deleteProjectTrip(
    { dispatch },
    { projectId, tripId, reGetProjectTrip = true },
  ) {
    await deleteProjectTrip(projectId, tripId);
    if (reGetProjectTrip) dispatch('getProjectTrips', projectId);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
