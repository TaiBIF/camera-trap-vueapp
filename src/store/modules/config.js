import { getLanguage } from '@/utils/i18n';
import { getProjectAreas } from '@/service';
import idx from 'idx';

// 各種專案設定

const state = {
  projectAreas: [],
  projectAreasOrientationTotal: [],
};

const getters = {
  projectAreas: state =>
    state.projectAreas.map(({ id, title, type, dataCount }) => ({
      id,
      title: idx(title, _ => _[getLanguage()]),
      type,
      dataCount,
    })),
  projectAreasOrientationTotal: state => {
    return state.projectAreasOrientationTotal;
  },
};

const mutations = {
  setProjectAreas(state, payload) {
    state.projectAreas = payload;
  },
  setProjectAreasOrientationTotal(state, payload) {
    state.projectAreasOrientationTotal = payload;
  },
};

const actions = {
  async getProjectAreas({ commit }) {
    const data = await getProjectAreas();
    commit('setProjectAreas', idx(data, _ => _.items) || []);
  },
  async getProjectAreasOrientationTotal({ commit }) {
    const data = await getProjectAreas();
    commit(
      'setProjectAreasOrientationTotal',
      idx(data, _ => _.location) || 'null',
    );
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
