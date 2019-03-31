import Router from 'vue-router';
import Vue from 'vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/Home.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/About.vue'),
    },
  ],
});
