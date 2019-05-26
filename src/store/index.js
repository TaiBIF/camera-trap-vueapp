import Vue from 'vue';
import Vuex from 'vuex';

import account from '@/store/modules/account';
import calculator from '@/store/modules/calculator';
import config from '@/store/modules/config';
import dataFields from '@/store/modules/dataFields';
import forest from '@/store/modules/forest';
import notifications from '@/store/modules/notifications';
import projects from '@/store/modules/projects';
import upload from '@/store/modules/upload';
import uploadSessions from '@/store/modules/uploadSessions';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    account,
    config,
    dataFields,
    forest,
    calculator,
    notifications,
    ...projects,
    upload,
    uploadSessions,
  },
  strict: debug,
});
