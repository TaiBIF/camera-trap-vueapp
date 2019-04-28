<template>
  <div class="page-project">
    <aside v-if="$route.meta.projectAside">
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
    this.fetchProjectCameraLocations();
  },
  watch: {
    selectedStudyAreaId() {
      this.fetchProjectCameraLocations();
    },
  },
  computed: {
    ...projects.mapGetters(['projectDetail']),
    ...studyAreas.mapGetters(['studyAreas']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    selectedStudyAreaId: function() {
      return this.$route.params.selectedStudyAreaId;
    },
  },
  methods: {
    ...projects.mapActions(['getProjectDetail']),
    ...studyAreas.mapActions([
      'getProjectStudyAreas',
      'getProjectCameraLocations',
    ]),
    fetchProjectCameraLocations() {
      if (this.selectedStudyAreaId && this.selectedStudyAreaId !== 'all') {
        this.getProjectCameraLocations({
          projectId: this.projectId,
          studyAreaId: this.selectedStudyAreaId,
        });
      }
    },
  },
};
</script>
