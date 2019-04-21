<template>
  <div class="tab-content active">
    <div class="row control-bar">
      <div class="col-sm-5 col-md-4">
        <div class="form-group row mb-0">
          <label class="col-5 text-right">
            樣區：
          </label>
          <div class="col-7">
            <select
              class="form-control"
              @change="changeRoute"
              :value="selectedParentAreaId"
            >
              <option
                v-for="area in parentAreaOptions"
                :key="area.key"
                :value="area.key"
              >
                {{ area.value }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div
        class="col-sm-5 col-md-4"
        v-if="childAreaOptions && childAreaOptions.length > 0"
      >
        <div class="form-group row mb-0">
          <label class="col-5 text-right">
            子樣區：
          </label>
          <div class="col-7">
            <select
              class="form-control"
              @change="changeRoute"
              :value="selectedChildAreaId"
            >
              <option
                v-for="area in childAreaOptions"
                :key="area.key"
                :value="area.key"
              >
                {{ area.value }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="row map-container">
      <div class="col-5">
        <project-map />
      </div>
      <div class="col-7">
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-8">
            <h1 class="display-heading mt-1">
              {{ selectedStudyArea.value }}
            </h1>
            <small class="sub-heading text-gray"
              >最後更新時間：2018/08/16</small
            >
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-4 text-right">
            <div class="btn-group">
              <router-link
                class="btn btn-border-gray"
                :class="{ active: $route.params.type === 'receive' }"
                :to="
                  `/project/${projectId}/info/video/${selectedStudyAreaId}/receive`
                "
              >
                影像回收狀況
              </router-link>
              <router-link
                class="btn btn-border-gray"
                :class="{ active: $route.params.type === 'identify' }"
                :to="
                  `/project/${projectId}/info/video/${selectedStudyAreaId}/identify`
                "
              >
                影像辨識進度
              </router-link>
            </div>
          </div>
          <project-video-identify />
          <project-video-receive />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import ProjectMap from '@/pages/Project/ProjectInfo/ProjectMap.vue';
import ProjectVideoIdentify from '@/pages/Project/ProjectInfo/ProjectVideoIdentify.vue';
import ProjectVideoReceive from '@/pages/Project/ProjectInfo/ProjectVideoReceive.vue';

const studyAreas = createNamespacedHelpers('studyAreas');

export default {
  name: 'project-video',
  components: {
    ProjectMap,
    ProjectVideoReceive,
    ProjectVideoIdentify,
  },
  data() {
    return {};
  },
  computed: {
    ...studyAreas.mapGetters(['studyAreas']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    allAreas: function() {
      return this.studyAreas.reduce(
        (arr, { id, title, children }) => {
          const parentId = id;
          let firstChildrenId;
          let childrenAreas = [];

          if (children && children.length > 0) {
            firstChildrenId = children[0].id;
            childrenAreas = children.map(({ id, title }) => ({
              key: id,
              value: title,
              parentId,
              path: id,
            }));
          }
          const parentArea = {
            key: id,
            value: title,
            parentId: null,
            path: firstChildrenId || id, // if area have children, use first child id as path
          };
          return [...arr, parentArea, ...childrenAreas];
        },
        [
          {
            key: 'all',
            value: '所有樣區',
            parentId: null,
            path: 'all',
          },
        ],
      );
    },
    parentAreaOptions: function() {
      return this.allAreas.filter(({ parentId }) => !parentId);
    },
    selectedStudyAreaId: function() {
      return this.$route.params.selectedStudyAreaId || 'all';
    },
    selectedParentAreaId: function() {
      const area = this.allAreas.find(
        ({ path }) => path === this.selectedStudyAreaId,
      );
      if (area) {
        return area.parentId || area.key;
      }
      return 'all';
    },
    selectedChildAreaId: function() {
      const area = this.allAreas.find(
        ({ key }) => key === this.selectedStudyAreaId,
      );
      if (area && area.parentId) {
        return area.key;
      }
      return null;
    },
    childAreaOptions: function() {
      return this.allAreas.filter(
        ({ parentId }) => parentId === this.selectedParentAreaId,
      );
    },
    selectedStudyArea: function() {
      return this.allAreas.find(({ key }) => key === this.selectedStudyAreaId);
    },
  },
  methods: {
    changeRoute(event) {
      const studyArea = this.allAreas.find(
        ({ key }) => key === event.target.value,
      );
      if (studyArea) {
        this.$router.push({
          path: `/project/${this.projectId}/info/video/${
            studyArea.path
          }/receive`,
        });
      }
    },
  },
};
</script>
