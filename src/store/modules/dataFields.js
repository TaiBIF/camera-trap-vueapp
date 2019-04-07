import idx from 'idx';

import { getDataFields, postDataFields } from '@/service';
import { getLanguage } from '@/utils/i18n';

const state = {
  dataFields: [],
};

const getters = {
  dataFields: state =>
    state.dataFields.map(v => ({
      ...v,
      title: v.title[getLanguage()],
      description: v.description[getLanguage()],
    })),
};

const mutations = {
  setDataFields(state, payload) {
    state.dataFields = payload;
  },
};

const actions = {
  async getDataFields({ commit }) {
    const data = await getDataFields();
    commit('setDataFields', idx(data, _ => _.items) || []);
  },
  async postDataFields(_, newField) {
    const body = {
      ...newField,
      title: {
        [getLanguage()]: newField.title,
      },
      description: {
        [getLanguage()]: newField.description,
      },
      ...(newField.options
        ? {
            options: newField.options.map(opt => ({
              [getLanguage()]: opt,
            })),
          }
        : undefined),
    };
    const data = await postDataFields(body);
    console.log(data);
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
https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-data-fieldsdatafieldid
*/
