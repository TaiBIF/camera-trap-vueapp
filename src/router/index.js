import Router from 'vue-router';
import Vue from 'vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/pages/Home.vue'),
    },
    {
      path: '/project',
      component: () => import('@/pages/Project/index.vue'),
      children: [
        {
          path: 'overview',
          component: () => import('@/pages/Project/Overview.vue'),
        },
      ],
    },
    {
      path: '/upload-history',
      component: () => import('@/pages/UploadHistory/index.vue'),
    },
    {
      path: '/download',
      component: () => import('@/pages/Download/index.vue'),
    },
    {
      path: '/setting',
      component: () => import('@/pages/Setting/index.vue'),
    },
    {
      path: '/help',
      component: () => import('@/pages/Help/index.vue'),
    },
  ],
});
