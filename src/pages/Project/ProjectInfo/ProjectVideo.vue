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
        <div v-if="selectedCameraId" class="backLink">
          <router-link :to="backToAreaLink">{{
            `＜ 返回 ${selectedStudyArea.value}`
          }}</router-link>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-8">
            <h1 class="display-heading mt-1">
              {{
                selectedCamera ? selectedCamera.name : selectedStudyArea.value
              }}
            </h1>
            <!-- TODO: wait for API -->
            <small class="sub-heading text-gray"
              >最後更新時間：2018/08/16</small
            >
          </div>
          <div
            v-if="!selectedCameraId"
            class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-4 text-right"
          >
            <div class="btn-group">
              <router-link
                class="btn btn-border-gray"
                :class="{ active: $route.params.type === 'receive' }"
                :to="generateVideoPath('receive')"
              >
                影像回收狀況
              </router-link>
              <router-link
                class="btn btn-border-gray"
                :class="{ active: $route.params.type === 'identify' }"
                :to="generateVideoPath('identify')"
              >
                影像辨識進度
              </router-link>
            </div>
          </div>
        </div>
        <div v-if="selectedCamera" class="row">
          <div class="cameraInfo">
            <div>
              架設日期：{{ dateFormatYYYYMMDD(selectedCamera.settingTime) }}
            </div>
            <div>
              經緯度：{{
                `${parseFloat(selectedCamera.longitude).toFixed(
                  6,
                )}, ${parseFloat(selectedCamera.latitude).toFixed(6)}`
              }}
            </div>
            <div>海拔：{{ selectedCamera.altitude }}m</div>
            <div>植披：{{ selectedCamera.vegetation }}</div>
            <div>土地利用型態：{{ selectedCamera.landCover }}</div>
          </div>
        </div>
        <project-chart />
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { dateFormatYYYYMMDD } from '@/utils/dateHelper';
import ProjectChart from '@/pages/Project/ProjectInfo/ProjectChart.vue';
import ProjectMap from '@/pages/Project/ProjectInfo/ProjectMap.vue';

const studyAreas = createNamespacedHelpers('studyAreas');

export default {
  name: 'project-video',
  components: {
    ProjectMap,
    ProjectChart,
  },
  data() {
    return {
      selectedParentAreaId: '',
      selectedChildAreaId: '',
    };
  },
  computed: {
    ...studyAreas.mapGetters(['studyAreas', 'cameraLocations']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    selectedStudyAreaId: function() {
      return this.$route.params.selectedStudyAreaId || 'all';
    },
    selectedCameraId: function() {
      return this.$route.params.selectedCameraId;
    },
    backToAreaLink: function() {
      return `/project/${this.projectId}/info/video/${
        this.selectedStudyAreaId
      }/receive`;
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
    childAreaOptions: function() {
      return this.allAreas.filter(
        ({ parentId }) => parentId === this.selectedParentAreaId,
      );
    },
    selectedStudyArea: function() {
      return (
        this.allAreas.find(({ key }) => key === this.selectedStudyAreaId) || {}
      );
    },
    selectedCamera: function() {
      if (!this.selectedCameraId) {
        return null;
      }
      return (
        this.cameraLocations.find(({ id }) => id === this.selectedCameraId) ||
        {}
      );
    },
  },
  watch: {
    allAreas: 'updateSelectArea',
    selectedStudyAreaId: 'updateSelectArea',
  },
  methods: {
    dateFormatYYYYMMDD(dateString) {
      return dateFormatYYYYMMDD(dateString);
    },
    updateSelectArea() {
      const selectedArea = this.allAreas.find(
        ({ key }) => key === this.selectedStudyAreaId,
      );
      if (selectedArea) {
        // move to next tick to wait options ready
        setTimeout(() => {
          this.selectedParentAreaId = selectedArea.parentId || selectedArea.key;
          this.selectedChildAreaId = selectedArea.parentId
            ? selectedArea.key
            : '';
        }, 0);
      } else {
        this.selectedParentAreaId = 'all';
      }
    },
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
    generateVideoPath(type) {
      if (this.selectedCameraId) {
        return `/project/${this.projectId}/info/video/${
          this.selectedStudyAreaId
        }/${type}/${this.selectedCameraId}`;
      }
      return `/project/${this.projectId}/info/video/${
        this.selectedStudyAreaId
      }/${type}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.backLink {
  margin: 0 -15px 5px;

  & > a {
    color: #8b8b8b;
  }
}
.cameraInfo {
  width: 100%;
  padding: 10px;
  background-color: #f6f5f5;
  color: #8b8b8b;
  margin: 10px;
  box-sizing: border-box;
}
</style>
