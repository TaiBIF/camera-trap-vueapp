<template>
  <div class="maintain page-sheet p-0">
    <div class="search-container" v-bind:class="{ loading: isLoading }">
      <!-- Edit mode -->
      <!-- Overview mode -->
      <div class="search-content">
        <a
          class="btn btn-green-border btn-sm float-right"
          v-tooltip.bottom="'將目前頁面或篩選範圍之資料輸出為 CSV 檔並下載'"
        >
          下載篩選結果
        </a>
        <h3 class="text-green mb-2">
          {{ studyAreaTitle }}
        </h3>
        <hr class="my-0" />
        <form action="" class="form form-horizontal">
          <div class="form-group mb-0">
            <label>相機位置</label>
            <div class="d-inline-block">
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  id="camera-all"
                  :checked="isCheckAllCameraLocations"
                  @click="
                    query.cameraLocations = isCheckAllCameraLocations
                      ? []
                      : cameraLocations.map(v => v.id)
                  "
                />
                <label for="camera-all">全部相機位置</label>
              </div>
              <div class="mb-2">
                <div
                  class="d-inline-block"
                  :key="camera.id"
                  v-for="(camera, index) in cameraLocations"
                >
                  <div class="checkbox checkbox-inline" v-if="index < 12">
                    <input
                      v-if="!isCheckAllCameraLocations"
                      type="checkbox"
                      v-model="query.cameraLocations"
                      :id="camera.id"
                      :value="camera.id"
                      :disabled="isCheckAllCameraLocations"
                    />
                    <input v-else type="checkbox" disabled="true" />
                    <label :for="camera.id">
                      <span class="text">{{ camera.name }}</span>
                    </label>
                  </div>
                </div>
                <div class="d-inline-block" v-if="cameraLocations.length >= 12">
                  <a
                    class="link text-gray"
                    role="button"
                    @click="CameraModalOpen = true"
                  >
                    查看更多
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group mb-2">
            <label>資料時間</label>
            <div class="d-inline-block">
              <div class="input-group-inline">
                <div class="input-group">
                  <date-picker
                    :format="'YYYY-MM-DD'"
                    :first-day-of-week="1"
                    v-model="query.startDate"
                  ></date-picker>
                  <div class="input-group-append">
                    <i class="icon icon-calendar"></i>
                  </div>
                </div>
                <div class="input-group ml-2">
                  <vue-timepicker v-model="query.startTime"></vue-timepicker>
                </div>
                <span class="input-text">到</span>
                <div class="input-group">
                  <date-picker
                    :format="'YYYY-MM-DD'"
                    :first-day-of-week="1"
                    v-model="query.endDate"
                  ></date-picker>
                  <div class="input-group-append">
                    <i class="icon icon-calendar"></i>
                  </div>
                </div>
                <div class="input-group ml-2">
                  <vue-timepicker v-model="query.endTime"></vue-timepicker>
                </div>
                <a
                  @click="doSearch"
                  class="btn btn-sm btn-green"
                  :style="{ margin: '4px' }"
                  :disabled="query.cameraLocations.length === 0"
                >
                  篩選
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="sheet-container">
      <AnnotationsSheet @changePage="setPagination" />
    </div>

    <camera-location-modal
      v-if="CameraModalOpen"
      :cameraLocations="cameraLocations"
      :selected="query.cameraLocations"
      @submit="setSelectedCamera"
      @close="CameraModalOpen = false"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import DatePicker from 'vue2-datepicker';
import VueTimepicker from 'vue2-timepicker';
import moment from 'moment';

import { getTodayDate, subNYears } from '@/utils/dateHelper.js';
import CameraLocationModal from '@/components/ProjectStudyAreas/CameraLocationModal.vue';

import AnnotationsSheet from './AnnotationsSheet';

const studyAreas = createNamespacedHelpers('studyAreas');
const annotations = createNamespacedHelpers('annotations');
const projects = createNamespacedHelpers('projects');
const dataFields = createNamespacedHelpers('dataFields');

let debounceTimeId = undefined;

export default {
  components: {
    CameraLocationModal,
    AnnotationsSheet,
    VueTimepicker,
    DatePicker,
  },
  data() {
    return {
      isLoading: false,
      CameraModalOpen: false,
      query: {
        index: 0,
        size: 50,
        cameraLocations: [],
        startDate: subNYears(getTodayDate(), 5),
        endDate: getTodayDate(),
        startTime: {
          HH: '00',
          mm: '00',
        },
        endTime: {
          HH: '23',
          mm: '59',
        },
      },
    };
  },
  mounted() {
    this.getDataFields();
    this.getProjectSpecies(this.projectId);
    this.getProjectCameraLocations({
      projectId: this.projectId,
      studyAreaId: this.studyAreaId,
    });
  },
  watch: {
    studyAreaId: function() {
      this.getProjectCameraLocations({
        projectId: this.projectId,
        studyAreaId: this.studyAreaId,
      });
    },
    'query.cameraLocations': function() {
      debounceTimeId && window.clearTimeout(debounceTimeId);

      debounceTimeId = setTimeout(() => {
        debounceTimeId = undefined;
        this.doSearch();
      }, 2000);
    },
  },
  computed: {
    ...studyAreas.mapState(['cameraLocations']),
    ...studyAreas.mapGetters(['studyAreas']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    studyAreaId: function() {
      return this.$route.params.studyAreaId;
    },
    studyAreaTitle: function() {
      let title = '';
      if (this.studyAreas.length > 0) {
        this.studyAreas.forEach(v => {
          // study area 第一層
          if (v.id === this.studyAreaId) {
            title = v.title;
          } else if (v.children.length > 0) {
            v.children.forEach(v2 => {
              // study area 第二層
              if (v2.id === this.studyAreaId) {
                title = `${v.title} - ${v2.title}`;
              }
            });
          }
        });
      }
      return title;
    },
    isCheckAllCameraLocations: function() {
      return this.query.cameraLocations.length === this.cameraLocations.length;
    },
  },
  methods: {
    ...dataFields.mapActions(['getDataFields']),
    ...projects.mapActions(['getProjectSpecies']),
    ...studyAreas.mapActions(['getProjectCameraLocations']),
    ...annotations.mapActions(['getAnnotations']),
    setSelectedCamera(val) {
      this.query.cameraLocations = val;
      this.CameraModalOpen = false;
    },
    setPagination(val) {
      this.query.index = val.currentPage - 1;
      this.query.size = val.pageSize;
      this.doSearch();
    },
    async doSearch() {
      if (this.query.cameraLocations.length === 0) {
        return;
      }
      const { query } = this;
      const getTime = (day, time) => {
        return moment(day)
          .hour(time.HH)
          .minute(time.mm)
          .toISOString();
      };

      this.isLoading = true;

      await this.getAnnotations({
        studyAreaId: this.studyAreaId,
        ...{
          cameraLocations: query.cameraLocations,
          startTime: getTime(query.startDate, query.startTime),
          endTime: getTime(query.endDate, query.endTime),
          index: query.index,
          size: query.size,
        },
      });
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
input[type='checkbox'][disabled] + label {
  color: #ccc;
}
</style>
