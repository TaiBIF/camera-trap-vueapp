<template>
  <div>
    <div v-if="$route.meta.fullPage">
      <router-view />
    </div>
    <div v-else class="page-project">
      <aside>
        <router-link to="/project/overview" class="aside-header">
          <i class="fa fa-chevron-left"></i> 返回計畫總覽
        </router-link>
        <div
          class="aside-project"
          :class="{
            active: !$route.params.studyAreaId,
          }"
        >
          <router-link :to="`/project/${projectId}`">
            {{ projectDetail.title }}
          </router-link>
        </div>
        <study-area-sidebar
          :studyAreas="studyAreas"
          :projectId="projectId"
          :currentStudyAreaId="$route.params.studyAreaId"
        />
      </aside>
      <router-view />
      <!-- TODO: move to children route? -->
      <div class="maintain">
        <ul>
          <li>
            <router-link
              :to="{
                name: 'projectBasic',
                params: {
                  projectId,
                },
              }"
              >編輯管理</router-link
            >
          </li>
          <li>
            <router-link
              :to="{
                name: 'projectStudyAreasView',
                params: {
                  projectId,
                  studyAreaId: '5cacb8d89c37591f7dcb7d', // TODO: adapt API
                },
              }"
              >樣區資訊</router-link
            >
          </li>
          <li>
            <router-link
              :to="{
                name: 'projectUpload',
                params: {
                  projectId,
                },
              }"
              >檔案上傳</router-link
            >
          </li>
        </ul>
        <br />
        <p>當前計畫詳細資訊</p>
        <p>計畫名稱: {{ projectDetail.title }}</p>
        <p>計畫主持人: {{ projectDetail.principalInvestigator }}</p>
        <p>計畫摘要: {{ projectDetail.description }}</p>
        <p>資料欄位: {{ projectDetail.description }}</p>
        <ul>
          <li :key="field.id" v-for="field in projectDetail.dataFields">
            {{ field.description }}
          </li>
        </ul>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import StudyAreaSidebar from '@/components/StudyAreaSidebar/StudyAreaSidebar.vue';

const projects = createNamespacedHelpers('projects');
const studyAreas = createNamespacedHelpers('studyAreas');

export default {
  name: 'detail',
  components: {
    StudyAreaSidebar,
  },
  mounted() {
    this.getProjectDetail(this.projectId);
    this.getProjectStudyAreas(this.projectId);
  },
  computed: {
    ...projects.mapGetters(['projectDetail']),
    ...studyAreas.mapGetters(['studyAreas']),
    projectId: function() {
      return this.$route.params.projectId;
    },
  },
  methods: {
    ...projects.mapActions(['getProjectDetail']),
    ...studyAreas.mapActions(['getProjectStudyAreas']),
  },
};
</script>
