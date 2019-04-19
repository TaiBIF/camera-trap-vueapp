import VTooltip from 'v-tooltip';
import VeeValidate from 'vee-validate';
import Vue from 'vue';

import App from './App';
import router from './router';
import store from './store';

import './sass/app.sass';
import 'bootstrap';

Vue.use(VeeValidate);
Vue.use(VTooltip);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
