import { addProjectTrip, getProjectTrips } from '@/service';
import idx from 'idx';

const state = {
  trips: [],
};

const mutations = {
  setTrips(state, payload) {
    state.trips = payload;
  },
};

const actions = {
  async getProjectTrips({ commit }, projectId) {
    const data = await getProjectTrips(projectId);
    commit('setTrips', idx(data, _ => _.items) || []);
  },
  async addProjectTrip({ dispatch }, { projectId, body, reGetProjectTrip }) {
    await addProjectTrip(projectId, body);
    if (reGetProjectTrip) {
      dispatch('getProjectTrips', projectId);
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
