<template>
  <div class="page-project">
    <aside
      v-if="$route.meta.projectAside"
      :style="collapse ? 'width: 248px' : ''"
    >
      <div class="accordion">
        <div class="accordion-item" :class="collapse ? 'is-open' : ''">
          <div>
            <div
              class="accordion-heading float-right"
              @click="collapse = !collapse"
            >
              <div class="icon float-right">
                <i class="icon-chevron-down"></i>
              </div>
            </div>
            <div class="accordion-body">
              <router-link to="/project/overview" class="aside-header">
                <i class="fa fa-chevron-left"></i> 返回計畫總覽
              </router-link>
            </div>
          </div>
          <div class="accordion-body">
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
              :showCameraLocation="true"
              :cameraLocations="cameraLocations"
              @setSelectedCameraLocations="setQueryCameraLocations"
            />
          </div>
        </div>
      </div>
    </aside>
    <router-view />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import StudyAreaSidebar from '@/components/StudyAreaSidebar/StudyAreaSidebar.vue';

const projects = createNamespacedHelpers('projects');
const studyAreas = createNamespacedHelpers('studyAreas');
const annotations = createNamespacedHelpers('annotations');

export default {
  name: 'detail',
  components: {
    StudyAreaSidebar,
  },
  data() {
    return {
      collapse: true,
    };
  },
  mounted() {
    this.getProjectDetail(this.projectId);
    this.getProjectStudyAreas(this.projectId);
    this.loadSpeciesGroupByStudyArea(this.projectId);
    this.fetchProjectCameraLocations();
  },
  watch: {
    selectedStudyAreaId() {
      this.fetchProjectCameraLocations();
    },
  },
  computed: {
    ...projects.mapGetters(['projectDetail']),
    ...studyAreas.mapGetters(['studyAreas', 'cameraLocations']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    selectedStudyAreaId: function() {
      return (
        this.$route.params.selectedStudyAreaId || this.$route.params.studyAreaId
      );
    },
  },
  methods: {
    ...projects.mapActions(['getProjectDetail']),
    ...studyAreas.mapActions([
      'getProjectStudyAreas',
      'getProjectCameraLocations',
      'loadSpeciesGroupByStudyArea',
      'loadSpeciesGroupByCameraLocation',
    ]),
    ...annotations.mapMutations(['setQueryCameraLocations']),
    fetchProjectCameraLocations() {
      if (this.selectedStudyAreaId && this.selectedStudyAreaId !== 'all') {
        this.getProjectStudyAreas(this.projectId);
        this.getProjectCameraLocations({
          projectId: this.projectId,
          studyAreaId: this.selectedStudyAreaId,
        });
        this.loadSpeciesGroupByCameraLocation({
          projectId: this.projectId,
          studyAreaId: this.selectedStudyAreaId,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.accordion {
  .accordion-item {
    .accordion-heading {
      border: none;
      .icon {
        transform: rotate(270deg);
      }
    }
    &.is-open .accordion-heading .icon {
      transform: rotate(90deg);
    }
    &.is-open {
      .accordion-body {
        display: block;
      }
    }
    .accordion-body {
      background: none;
      border: none;
      padding: 0px;
    }
  }
}
</style>
