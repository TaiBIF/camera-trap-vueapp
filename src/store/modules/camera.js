import { getCameraType, getCameras } from '@/service';
import idx from 'idx';

const state = {
  cameras: [],
  camerasByFilter: [],
};

const mutations = {
  setCameras(state, payload) {
    state.cameras = payload;
  },
  setCamerasByFilter(state, payload) {
    state.camerasByFilter = payload;
  },
};

const actions = {
  async getCameras({ commit }) {
    const data = await getCameras();
    commit('setCameras', idx(data, _ => _.items) || []);
  },
  setCamerasByFilter({ commit }, payload) {
    commit('setCamerasByFilter', payload);
  },
  async getCamerasByFilter({ commit }, payload) {
    let filters = '';
    Object.keys(payload).map(key => {
      let keyMod = key;
      if (key.indexOf(['sn', 'vn'] >= 0)) {
        keyMod = `${key}s`;
        payload[key].forEach(x => {
          if (filters === '') filters = `?${keyMod}=${x}`;
          else filters = filters + `&${keyMod}=${x}`;
        });
      } else {
        if (filters === '') filters = `?${keyMod}=${payload[key]}`;
        else filters = filters + `&${keyMod}=${payload[key]}`;
      }
    });

    const data = await getCameras(filters);
    commit('setCamerasByFilter', idx(data, _ => _.items) || []);
  },
  async getCameraType(_, { type, searchName = '' }) {
    let filter = '';
    if (searchName !== '') filter = `?name=${searchName}`;
    const data = await getCameraType(type, filter);
    return idx(data, _ => _.items) || [];
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
