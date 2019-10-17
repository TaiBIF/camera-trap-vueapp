import ElementUI from 'element-ui';
import VTooltip from 'v-tooltip';
import VeeValidate from 'vee-validate';
import Vue from 'vue';

import App from './App';
import router from './router';
import store from './store';

import locale from 'element-ui/lib/locale/lang/zh-TW';
import './sass/app.sass';
import 'bootstrap';
import 'element-ui/lib/theme-chalk/index.css';
import 'handsontable/languages/zh-TW';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';

Vue.use(VeeValidate);
Vue.use(VTooltip);
Vue.use(ElementUI, { locale });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
