// 林班地
import { getForestBoundary } from '@/service';
import idx from 'idx';

const state = {
  forestBoundary: [],
};

const getters = {
  forestBoundary: state => state.forestBoundary || [],
};

const mutations = {
  setForestBoundary(state, payload) {
    state.forestBoundary = payload.reduce((res, item) => {
      if (!res.find(({ id }) => id === item.id)) {
        res.push({
          id: item.id,
          points: idx(item, _ => _.geometry.coordinates[0]).map(coordinate => ({
            lng: coordinate[0],
            lat: coordinate[1],
          })),
        });
      }
      return res;
    }, state.forestBoundary);
  },
};

const actions = {
  async loadForestBoundary({ commit }, { lat, lng }) {
    const { items } = await getForestBoundary({ lat, lng });
    commit('setForestBoundary', items || []);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
