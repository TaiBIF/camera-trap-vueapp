import { getCarousel } from '@/service';

const state = {
  carouselImages: [],
};

const mutations = {
  setCarouselImages(state, payload) {
    state.carouselImages = payload;
  },
};

const actions = {
  async getCarousel({ commit }) {
    const data = await getCarousel();
    commit('setCarouselImages', data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
