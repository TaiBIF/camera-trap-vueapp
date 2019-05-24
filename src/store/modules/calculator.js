import { getCalculateOI, getCalculateLTD } from '@/service';

const state = {
  calculator: [],
};

const mutations = {
  setCalculator(state, payload) {
    state.calculator = payload;
  },
};

const actions = {
  async getCalculateOI({ commit }, query) {
    const data = await getCalculateOI(query);
    commit('setCalculator', data);
  },
  async getCalculateLTD({ commit }, query) {
    const data = await getCalculateLTD(query);
    commit('setCalculator', data, );
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
