<template>
  <div class="tab-content active">
    <div class="row control-bar">
      <div class="col-4">
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
      <div class="col-4" v-if="childAreaOptions && childAreaOptions.length > 0">
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
      <div class="col-4" v-if="tripOptions && tripOptions.length > 0">
        <div class="form-group row mb-0">
          <label class="col-5 text-right">
            行程：
          </label>
          <div class="col-7">
            <select class="form-control" v-model="selectedTripId">
              <option
                v-for="area in tripOptions"
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
        <project-map
          :activeCameraId="activeCameraId"
          @hoverCamera="activeCamera"
        />
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
            <small class="sub-heading text-gray">
              <span v-show="selectedTripId === 'all'">
                最後更新時間： {{ retrievalDataLastUpdate }}
              </span>
              <span v-show="selectedTripId !== 'all'">
                行程： {{ selectedTrip.sn }} <br />
                拍攝區間： {{ dateFormatYYYYMMDD(selectedTrip.date) }}
              </span>
            </small>
          </div>
          <div
            v-if="!selectedChildAreaId"
            class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-4 text-right"
          >
            <div class="btn-group">
              <router-link
                class="btn btn-border-gray"
                :class="{ active: $route.params.type === 'retrieved' }"
                :to="generateMediaPath('retrieved')"
              >
                影像回收狀況
              </router-link>
              <router-link
                class="btn btn-border-gray"
                :class="{ active: $route.params.type === 'identified' }"
                :to="generateMediaPath('identified')"
              >
                影像辨識進度
              </router-link>
            </div>
          </div>
        </div>
        <div v-if="selectedCamera" class="row">
          <div class="cameraInfo">
            <div v-if="!!selectedCamera.settingTime">
              架設日期：{{ dateFormatYYYYMMDD(selectedCamera.settingTime) }}
            </div>
            <div v-if="!!selectedCamera.longitude && !!selectedCamera.latitude">
              經緯度：{{
                `${parseFloat(selectedCamera.longitude).toFixed(
                  6,
                )}, ${parseFloat(selectedCamera.latitude).toFixed(6)}`
              }}
            </div>
            <div v-if="!!selectedCamera.altitude">
              海拔：{{ selectedCamera.altitude }}m
            </div>
            <div v-if="!!selectedCamera.vegetation">
              植披：{{ selectedCamera.vegetation }}
            </div>
            <div v-if="!!selectedCamera.landCoverType">
              土地利用型態：{{ selectedCamera.landCoverType }}
            </div>
          </div>
        </div>
        <project-chart :activeCameraId="activeCameraId" />
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
const projects = createNamespacedHelpers('projects');
const trip = createNamespacedHelpers('trip');

export default {
  name: 'project-media',
  components: {
    ProjectMap,
    ProjectChart,
  },
  data() {
    return {
      selectedParentAreaId: '',
      selectedChildAreaId: '',
      selectedTripId: 'all',
      activeCameraId: '',
    };
  },
  async mounted() {
    this.updateSelectArea();
    await this.getProjectTrips(this.projectId);
    this.setMonthRetrievedSelectedTripId(this.selectedTripId);
  },
  watch: {
    allAreas: 'updateSelectArea',
    selectedStudyAreaId: 'updateSelectArea',
    selectedTripId: 'updateMonthRetrievedSelectedTripId',
  },
  computed: {
    ...studyAreas.mapGetters(['studyAreas', 'cameraLocations']),
    ...projects.mapGetters(['retrievalDataLastUpdate']),
    ...trip.mapState(['projectTrips']),
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
      return `/project/${this.projectId}/info/media/${
        this.selectedStudyAreaId
      }/retrieved`;
    },
    allAreas: function() {
      return this.studyAreas.reduce(
        (arr, { id, title, children }) => {
          const parentId = id;
          let childrenAreas = [];

          if (children && children.length > 0) {
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
            path: id, // if area have children, use first child id as path
          };
          return [...arr, parentArea, ...childrenAreas];
        },
        [
          {
            key: 'all',
            value: '全部樣區',
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
      const childArea = this.allAreas.filter(
        ({ parentId }) => parentId === this.selectedParentAreaId,
      );

      return [
        {
          key: 'all',
          value: '全部子樣區',
          parentId: null,
          path: this.selectedParentAreaId,
        },
        ...childArea,
      ];
    },
    tripOptions: function() {
      return this.projectTrips.reduce(
        (pre, trip) => {
          return [...pre, { key: trip.id, value: trip.sn }];
        },
        [
          {
            key: 'all',
            value: '全部行程',
          },
        ],
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
      return this.cameraLocations.filter(
        ({ id }) => id === this.selectedCameraId,
        {},
      )[0];
    },
    selectedTrip: function() {
      if (!this.selectedTripId) {
        return null;
      }
      return (
        this.projectTrips.filter(({ id }) => id === this.selectedTripId)[0] ||
        {}
      );
    },
  },
  methods: {
    ...trip.mapActions(['getProjectTrips']),
    ...projects.mapMutations(['setMonthRetrievedSelectedTripId']),
    dateFormatYYYYMMDD(dateString) {
      return dateFormatYYYYMMDD(dateString);
    },
    activeCamera(cameraId) {
      this.activeCameraId = cameraId || '';
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
            : 'all';
        }, 0);
      } else {
        this.selectedParentAreaId = 'all';
        this.selectedChildAreaId = 'all';
      }
    },
    changeRoute(event) {
      const studyArea = this.allAreas.find(
        ({ key }) => key === event.target.value,
      );
      if (studyArea) {
        this.$router.push({
          name: 'projectMedia',
          params: {
            projectId: this.projectId,
            selectedStudyAreaId: studyArea.path,
            type: 'retrieved',
          },
        });
      }
    },
    generateMediaPath(type) {
      if (this.selectedCameraId) {
        return `/project/${this.projectId}/info/media/${
          this.selectedStudyAreaId
        }/${type}/${this.selectedCameraId}`;
      }
      return `/project/${this.projectId}/info/media/${
        this.selectedStudyAreaId
      }/${type}`;
    },
    updateMonthRetrievedSelectedTripId() {
      this.setMonthRetrievedSelectedTripId(this.selectedTripId);
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
