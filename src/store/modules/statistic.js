import { getSstatistics, getSstatisticsByCountyName } from '@/service';

const dataStatistics = {
  year: [
    {
      year: '',
      totalPicture: '',
      totalCameraLocation: '',
    },
  ],
  species: [
    {
      species: '',
      name: '',
      totalLocation: '',
      totalPicture: '',
    },
  ],
  funder: [
    {
      name: '',
      totalData: '',
    },
  ],
};

const countyStatistics = {
  title: {
    'zh-TW': '',
  },
  project: {
    total: '',
  },
  cameraLocation: {
    total: '',
  },
  identifiedSpecies: {
    percentage: '',
    items: [
      {
        species: '',
        name: {
          'zh-TW': '',
        },
      },
    ],
  },
  picture: {
    total: '',
  },
  camera: {
    totalWorkHour: '',
  },
  studyArea: {
    items: [
      {
        studyArea: '',
        title: {
          'zh-TW': '',
        },
        cameraLocation: {
          total: '',
          items: [
            {
              cameraLocation: '',
              name: '',
              latitude: '',
              longitude: '',
              altitude: '',
              data: {
                total: '',
              },
            },
          ],
        },
        data: {
          total: '',
        },
      },
    ],
  },
};

const state = {
  dataStatistics,
  countyStatistics,
};

const mutations = {
  setDataStatistics(state, payload) {
    state.dataStatistics = payload;
  },
  setCountyStatistics(state, payload) {
    state.countyStatistics = payload;
  },
};

const actions = {
  async getSstatistics({ commit }) {
    const data = await getSstatistics();
    commit('setDataStatistics', data);
  },
  async getSstatisticsByCountyName({ commit }, countyName) {
    const data = await getSstatisticsByCountyName(countyName);
    commit('setCountyStatistics', data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
