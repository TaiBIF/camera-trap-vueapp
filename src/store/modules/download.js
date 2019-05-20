import { getSearchResults } from '@/service';

const state = {
  searchResults: [],
};

const getters = {
  searchResults: state =>
    state.searchResults.map(({ id }) => ({
      id,
    })),
};

const mutations = {
  setsearchResults(state, payload) {
    state.searchResults = payload;
  },
};

const actions = {
  async getSearchResults({ commit }) {
    const data = await getSearchResults();
    commit('set', data);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
