<template>
  <div class="maintain page-sheet p-0" :class="{ loading: isLoading }">
    <div class="search-container">
      <!-- Edit mode -->
      <div v-if="isEdit" class="edit-container">
        <div class="row">
          <div class="col-7">
            <span class="text-gray">{{ studyAreaTitle(studyAreaId) }}</span>
            <span class="divider"></span>
            <span class="text-gray">{{ queryLocation }}</span>
            <span class="divider"></span>
            <span class="text-gray">{{ queryTimeRange }}</span>
          </div>
          <div class="col-5 text-right">
            <span class="divider"></span>
            <button @click="setEdit(false)" class="btn btn-circle">
              <i class="icon-save"></i>
            </button>
            <span class="divider"></span>
            <button
              @click="setEdit(false)"
              class="btn btn-basic btn-sm"
              :disabled="requestProcessingCount !== 0"
            >
              關閉編輯模式
            </button>
          </div>
        </div>
      </div>
      <!-- Overview mode -->
      <div v-else class="search-content">
        <a
          class="btn btn-green-border btn-sm float-right"
          v-tooltip.bottom="'將目前頁面或篩選範圍之資料輸出為 CSV 檔並下載'"
          :href="canSearch ? exportCSVLink : undefined"
          target="_blank"
          :disabled="!canSearch"
        >
          下載篩選結果
        </a>
        <h3 class="text-green mb-2">
          {{ studyAreaTitle(studyAreaId) }}
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
                  :checked="isCheckedAllCameraLocations"
                  @click="
                    query.cameraLocations = isCheckedAllCameraLocations
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
                      v-if="!isCheckedAllCameraLocations"
                      type="checkbox"
                      v-model="query.cameraLocations"
                      :id="camera.id"
                      :value="camera.id"
                      :disabled="isCheckedAllCameraLocations"
                    />
                    <input v-else type="checkbox" disabled="true" />
                    <label :for="camera.id">
                      <span class="text">{{ camera.name }}</span>
                      <span class="icon" v-if="camera.isLocked">
                        <i
                          class="icon-lock align-middle"
                          v-tooltip.top="`${camera.lockUser.name} 正在編輯中`"
                        ></i>
                      </span>
                      <span class="error-label" v-if="camera.failures > 0">
                        {{ camera.failures }}
                      </span>
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
                    placeholder="請選擇日期"
                  ></date-picker>
                  <div class="input-group-append">
                    <i class="icon icon-calendar"></i>
                  </div>
                </div>
                <div class="input-group ml-2">
                  <vue-timepicker
                    v-model="query.startTime"
                    hide-clear-button
                  ></vue-timepicker>
                </div>
                <span class="input-text">到</span>
                <div class="input-group">
                  <date-picker
                    :format="'YYYY-MM-DD'"
                    :first-day-of-week="1"
                    v-model="query.endDate"
                    placeholder="請選擇日期"
                  ></date-picker>
                  <div class="input-group-append">
                    <i class="icon icon-calendar"></i>
                  </div>
                </div>
                <div class="input-group ml-2">
                  <vue-timepicker
                    v-model="query.endTime"
                    hide-clear-button
                  ></vue-timepicker>
                </div>
                <a
                  @click="doSearch"
                  class="btn btn-sm btn-green"
                  :style="{ margin: '4px' }"
                  :disabled="!canSearch"
                >
                  篩選
                </a>
              </div>
            </div>
          </div>
        </form>
        <div>
          <button
            class="btn btn-sm btn-block btn-green"
            @click="setEdit(true)"
            :disabled="disabledEdit"
          >
            <i class="fa fa-pencil-alt"></i> 進入編輯模式
          </button>
        </div>
      </div>
    </div>

    <!-- 下方編輯頁面 -->
    <div class="sheet-container">
      <AnnotationsSheet
        ref="sheet"
        :isEdit="isEdit"
        :galleryShow="galleryShow"
        :historyShow="historyShow"
        :currentAnnotationIdx="currentAnnotationIdx"
        @changePage="setPagination"
        @galleryShow="galleryShow = $event"
        @historyShow="historyShow = $event"
        @currentAnnotationIdx="currentAnnotationIdx = $event"
        @closeEdit="setEdit(false)"
      />
      <right-side
        :galleryShow="galleryShow"
        :historyShow="historyShow"
        :currentAnnotationIdx="currentAnnotationIdx"
        @historyShow="historyShow = $event"
        @currentAnnotationIdx="currentAnnotationIdx = $event"
        @changeWidth="setSheetHeight"
      />
    </div>

    <camera-location-modal
      v-if="CameraModalOpen"
      :cameraLocations="cameraLocations"
      :selected="query.cameraLocations"
      @submit="setSelectedCamera"
      @close="CameraModalOpen = false"
    />

    <info-modal :open="lockByOtherModal" @close="lockByOtherModal = false">
      <p class="text-gray">
        此相機位置剛進入鎖定狀態，無法進入編輯模式。
      </p>
    </info-modal>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import DatePicker from 'vue2-datepicker';
import VueTimepicker from 'vue2-timepicker';
import moment from 'moment';

import {
  dateFormatYYYYMMDDHHmmss,
  getTodayDate,
  subNYears,
} from '@/utils/dateHelper.js';
import CameraLocationModal from '@/components/ProjectStudyAreas/CameraLocationModal.vue';
import InfoModal from '@/components/Modal/InfoModal.vue';

import AnnotationsSheet from './AnnotationsSheet';
import RightSide from './RightSide.vue';
import queryString from 'query-string';

const studyAreas = createNamespacedHelpers('studyAreas');
const annotations = createNamespacedHelpers('annotations');
const projects = createNamespacedHelpers('projects');
const dataFields = createNamespacedHelpers('dataFields');
const account = createNamespacedHelpers('account');

let debounceTimeId = undefined;

const getTime = (day, time, second = 0, millisecond = 0) => {
  return moment(day)
    .hour(time.HH)
    .minute(time.mm)
    .second(second)
    .millisecond(millisecond);
};

const defaultQuery = {
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
};

export default {
  components: {
    CameraLocationModal,
    AnnotationsSheet,
    RightSide,
    VueTimepicker,
    DatePicker,
    InfoModal,
  },
  data() {
    return {
      lockByOtherModal: false,
      isLoading: false,
      isEdit: false,
      CameraModalOpen: false,
      galleryShow: true,
      historyShow: true,
      currentAnnotationIdx: -1, // 目前選擇的資料 index
      query: Object.assign({}, defaultQuery),
    };
  },
  mounted() {
    this.getDataFields();
    this.getProjectSpecies(this.projectId);
    this.updateDateRange();
  },
  watch: {
    galleryShow: 'setSheetHeight',
    historyShow: 'setSheetHeight',
    projectDetail: 'updateDateRange',
    $route() {
      this.isEdit = false;
      this.query = Object.assign({}, defaultQuery);
      this.resetAnnotations();
      this.updateDateRange();
    },
    'query.cameraLocations': function() {
      debounceTimeId && window.clearTimeout(debounceTimeId);

      debounceTimeId = setTimeout(() => {
        debounceTimeId = undefined;
        this.doSearch();
      }, 2000);
    },
    'query.startDate': 'swapDate',
    'query.endDate': 'swapDate',
    'query.startTime': 'swapDate',
    'query.endTime': 'swapDate',
  },
  computed: {
    ...studyAreas.mapState(['cameraLocations']),
    ...studyAreas.mapGetters(['studyAreas', 'studyAreaTitle']),
    ...annotations.mapState(['annotationsTotal', 'requestProcessingCount']),
    ...account.mapGetters(['userId']),
    ...projects.mapGetters(['projectDetail']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    studyAreaId: function() {
      return this.$route.params.studyAreaId;
    },
    isCheckedAllCameraLocations: function() {
      return (
        this.cameraLocations.length > 0 &&
        this.query.cameraLocations.length === this.cameraLocations.length
      );
    },
    queryTimeRange: function() {
      const { query } = this;
      const startTime = getTime(query.startDate, query.startTime);
      const endTime = getTime(query.endDate, query.endTime, 59, 999);

      return `${dateFormatYYYYMMDDHHmmss(
        startTime,
      )} ~ ${dateFormatYYYYMMDDHHmmss(endTime)}`;
    },
    queryLocation: function() {
      const { cameraLocations } = this.query;

      return cameraLocations
        .map(v => this.cameraLocations.find(c => c.id === v).name)
        .join(', ');
    },
    disabledEdit: function() {
      return (
        this.annotationsTotal === 0 ||
        this.cameraLocations.some(
          v => v.isLocked === true && v.lockUser.id !== this.userId,
        )
      );
    },
    exportCSVLink: function() {
      const { query } = this;
      const queryParams = {
        studyAreaId: this.studyAreaId,
        cameraLocations: query.cameraLocations,
        startTime: getTime(query.startDate, query.startTime).toISOString(),
        endTime: getTime(query.endDate, query.endTime, 59, 999).toISOString(),
        index: query.index,
        size: query.size,
      };
      // TODO, make this API URL not hard coded
      return `${
        process.env.VUE_APP_API_URL
      }/api/v1/annotations.csv?${queryString.stringify(queryParams)}`;
    },
    canSearch: function() {
      return this.query.cameraLocations.length > 0;
    },
  },
  methods: {
    ...dataFields.mapActions(['getDataFields']),
    ...projects.mapActions(['getProjectSpecies']),
    ...studyAreas.mapActions([
      'getProjectStudyAreas',
      'getProjectCameraLocations',
      'setLockProjectCameraLocations',
    ]),
    ...annotations.mapActions(['getAnnotations']),
    ...annotations.mapMutations(['resetAnnotations']),
    updateDateRange() {
      if (
        this.projectDetail.oldestAnnotationTime &&
        this.projectDetail.latestAnnotationTime
      ) {
        this.query.startDate = this.projectDetail.oldestAnnotationTime;
        this.query.endDate = this.projectDetail.latestAnnotationTime;
      }
    },
    swapDate() {
      const { query } = this;

      // 先判斷 date 如果 startTime > endTime 則先交換 date
      let startTime = getTime(query.startDate, query.startTime);
      let endTime = getTime(query.endDate, query.endTime, 59, 999);
      if (startTime > endTime) {
        const tmpDate = query.startDate;
        query.startDate = query.endDate;
        query.endDate = tmpDate;
      }

      // 如果已經交換 date 還是 startTime > endTime 則連 time 也交換
      startTime = getTime(query.startDate, query.startTime);
      endTime = getTime(query.endDate, query.endTime, 59, 999);
      if (startTime > endTime) {
        const tmpTime = query.startTime;
        query.startTime = query.endTime;
        query.endTime = tmpTime;
      }
    },
    setSelectedCamera(val) {
      this.query.cameraLocations = val;
      this.CameraModalOpen = false;
    },
    setPagination(val) {
      this.query.index = val.currentPage - 1;
      this.query.size = val.pageSize;
      this.doSearch();
    },
    async setEdit(bool) {
      if (bool === true) {
        await Promise.all([
          this.getProjectStudyAreas(this.projectId),
          this.getProjectCameraLocations({
            projectId: this.projectId,
            studyAreaId: this.studyAreaId,
          }),
        ]);

        if (this.disabledEdit === false) {
          await this.setLockProjectCameraLocations({
            projectId: this.projectId,
            studyAreaId: this.studyAreaId,
            cameraLocations: this.query.cameraLocations,
            isLock: bool,
          });
          this.isEdit = true;
        } else {
          this.lockByOtherModal = true;
        }
      } else {
        await this.setLockProjectCameraLocations({
          projectId: this.projectId,
          studyAreaId: this.studyAreaId,
          cameraLocations: this.query.cameraLocations,
          isLock: bool,
        });

        this.isEdit = false;
      }
    },
    async doSearch() {
      this.currentAnnotationIdx = -1;
      if (this.query.cameraLocations.length === 0) {
        this.resetAnnotations();
        return;
      }
      const { query } = this;

      this.isLoading = true;

      await this.getAnnotations({
        studyAreaId: this.studyAreaId,
        ...{
          cameraLocations: query.cameraLocations,
          startTime: getTime(query.startDate, query.startTime).toISOString(),
          endTime: getTime(query.endDate, query.endTime, 59, 999).toISOString(),
          index: query.index,
          size: query.size,
        },
      });
      this.isLoading = false;
    },
    setSheetHeight() {
      this.$refs.sheet.setSheetHeight();
    },
  },
};
</script>

<style lang="scss" scoped>
input[type='checkbox'][disabled] + label {
  color: #ccc;
}
</style>
