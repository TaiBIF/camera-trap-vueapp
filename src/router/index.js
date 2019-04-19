import Router from 'vue-router';
import Vue from 'vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/pages/Intro.vue'),
    },
    {
      path: '/project',
      component: () => import('@/pages/Project/index.vue'),
      children: [
        {
          path: 'overview',
          component: () => import('@/pages/Project/Overview.vue'),
        },
        {
          path: 'create',
          component: () => import('@/pages/Project/Create.vue'),
        },
        {
          path: ':projectId',
          component: () => import('@/pages/Project/Detail.vue'),
          children: [
            {
              path: 'edit',
              name: 'projectEdit',
              meta: { fullPage: true },
              component: () => import('@/pages/Project/EditProject/index.vue'),
              children: [
                {
                  path: 'basic',
                  name: 'projectBasic',
                  component: () =>
                    import('@/pages/Project/EditProject/Basic.vue'),
                },
                {
                  path: 'setting',
                  name: 'projectSetting',
                  component: () =>
                    import('@/pages/Project/EditProject/Setting.vue'),
                },
                {
                  path: 'camera-location',
                  name: 'projectCameraLocation',
                  component: () =>
                    import('@/pages/Project/EditProject/CameraLocation.vue'),
                },
                {
                  path: 'member',
                  name: 'projectMember',
                  component: () =>
                    import('@/pages/Project/EditProject/Member.vue'),
                },
                {
                  path: 'license',
                  name: 'projectLicense',
                  component: () =>
                    import('@/pages/Project/EditProject/License.vue'),
                },
              ],
            },
            {
              path: 'study-areas/:studyAreaId',
              name: 'projectStudyAreasView',
              meta: { fullPage: false },

              component: () =>
                import('@/pages/Project/ProjectStudyAreas/index.vue'),
            },
            {
              path: 'study-areas/:studyAreaId/edit',
              name: 'projectStudyAreasEdit',
              meta: { fullPage: false },
              component: () =>
                import('@/pages/Project/ProjectStudyAreas/Edit.vue'),
            },
            {
              path: 'upload',
              name: 'projectUpload',
              meta: { fullPage: true },
              component: () =>
                import('@/pages/Project/ProjectUpload/index.vue'),
            },
          ],
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
      children: [
        {
          path: 'search',
          component: () => import('@/pages/Download/Search.vue'),
        },
        {
          path: 'result',
          component: () => import('@/pages/Download/Result.vue'),
        },
        {
          path: 'calculate',
          component: () => import('@/pages/Download/Calculate.vue'),
        },
      ],
    },
    {
      path: '/setting',
      component: () => import('@/pages/Setting/index.vue'),
    },
    {
      path: '/help',
      component: () => import('@/pages/Help/index.vue'),
      children: [
        {
          path: 'faq',
          component: () => import('@/pages/Help/Faq.vue'),
        },
        {
          path: 'contact-us',
          component: () => import('@/pages/Help/ContactUs.vue'),
        },
        {
          path: 'privacy',
          component: () => import('@/pages/Help/Privacy.vue'),
        },
        {
          path: 'contribution-protocol',
          component: () => import('@/pages/Help/ContributionProtocol.vue'),
        },
      ],
    },
  ],
});
