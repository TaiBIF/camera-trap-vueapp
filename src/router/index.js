import Router from 'vue-router';
import Vue from 'vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'intro',
      component: () => import('@/pages/Intro.vue'),
    },
    // 計畫總覽
    {
      path: '/project',
      name: 'project',
      component: () => import('@/pages/Project/index.vue'),
      children: [
        // 計畫總覽
        {
          path: 'overview',
          name: 'projectOverview',
          component: () => import('@/pages/Project/Overview.vue'),
        },
        // 新增計畫
        {
          path: 'create',
          name: 'projectCreate',
          component: () => import('@/pages/Project/Create.vue'),
        },
        // 計畫詳情
        {
          path: ':projectId',
          component: () => import('@/pages/Project/Detail.vue'),
          children: [
            {
              path: '/',
              redirect: 'info',
            },
            {
              path: 'info',
              component: () =>
                import('@/pages/Project/ProjectInfo/ProjectInfo.vue'),
              children: [
                {
                  path: '/',
                  redirect: 'media/all/retrieved',
                  name: 'projectInfo',
                },
                {
                  path: 'media/:selectedStudyAreaId/:type/:selectedCameraId?',
                  name: 'projectMedia',
                  meta: { projectAside: true },
                  component: () =>
                    import('@/pages/Project/ProjectInfo/ProjectMedia.vue'),
                },
                {
                  path: 'species/:selectedStudyAreaId/:selectedCameraId?',
                  name: 'projectSpecies',
                  meta: { projectAside: true },
                  component: () =>
                    import('@/pages/Project/ProjectInfo/ProjectSpecies.vue'),
                },
              ],
            },
            // 計畫管理
            {
              path: 'edit',
              name: 'projectEdit',
              meta: { projectAside: false },
              component: () => import('@/pages/Project/EditProject/index.vue'),
              children: [
                // 基本資料
                {
                  path: 'basic',
                  name: 'projectBasic',
                  meta: { projectAside: false },
                  component: () =>
                    import('@/pages/Project/EditProject/Basic.vue'),
                },
                // 編輯設定
                {
                  path: 'setting',
                  name: 'projectSetting',
                  meta: { projectAside: false },
                  component: () =>
                    import('@/pages/Project/EditProject/Setting.vue'),
                },
                // 相機位置管理
                {
                  path: 'camera-location',
                  name: 'projectCameraLocation',
                  meta: { projectAside: false },
                  component: () =>
                    import('@/pages/Project/EditProject/CameraLocation.vue'),
                },
                // 相機管理
                {
                  path: 'camera',
                  name: 'projectCamera',
                  meta: { projectAside: false },
                  component: () =>
                    import('@/pages/Project/EditProject/Camera.vue'),
                },
                // 行程管理
                {
                  path: 'trip',
                  name: 'projectTrip',
                  meta: { projectAside: false },
                  component: () =>
                    import('@/pages/Project/EditProject/Trip.vue'),
                },
                // 計畫成員
                {
                  path: 'member',
                  name: 'projectMember',
                  meta: { projectAside: false },
                  component: () =>
                    import('@/pages/Project/EditProject/Member.vue'),
                },
                // 創用CC授權
                {
                  path: 'license',
                  name: 'projectLicense',
                  meta: { projectAside: false },
                  component: () =>
                    import('@/pages/Project/EditProject/License.vue'),
                },
              ],
            },
            {
              path: 'study-areas/:studyAreaId',
              name: 'projectStudyAreasView',
              meta: { projectAside: true },
              component: () =>
                import('@/pages/Project/ProjectStudyAreas/index.vue'),
            },
            {
              path: 'upload',
              name: 'projectUpload',
              meta: { projectAside: false },
              component: () =>
                import('@/pages/Project/ProjectUpload/index.vue'),
            },
            {
              path: 'oversight',
              name: 'projectOversight',
              meta: { projectAside: false },
              component: () =>
                import('@/pages/Project/ProjectOversight/index.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/upload-history',
      component: () => import('@/pages/UploadHistory/index.vue'),
    },
    // 篩選及計算
    {
      path: '/download',
      component: () => import('@/pages/Download/index.vue'),
      children: [
        {
          path: '/',
          redirect: 'search',
        },
        {
          path: 'search',
          component: () => import('@/pages/Download/Search.vue'),
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
        {
          path: 'member-description',
          component: () => import('@/pages/Help/MemberDescription.vue'),
        },
      ],
    },
  ],
});
