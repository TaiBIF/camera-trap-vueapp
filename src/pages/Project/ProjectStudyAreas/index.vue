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
            <button
              @click="setEdit(false)"
              :disabled="requestProcessingCount !== 0"
              class="btn btn-circle"
            >
              <i class="icon-save"></i>
            </button>
          </div>
        </div>
      </div>
      <!-- Overview mode -->
      <div v-else class="search-content accordion">
        <div class="accordion-item" :class="collapse ? 'is-open' : ''">
          <div class="accordion-heading" @click="collapse = !collapse">
            <h3 class="text-green mb-2 d-inline-block">
              {{ studyAreaTitle(studyAreaId) }}
            </h3>
            <div class="icon">
              <i class="icon-chevron-down"></i>
            </div>
            <hr class="my-0" />
          </div>
          <div class="accordion-body">
            <form action="" class="form form-horizontal">
              <div class="form-group mb-2">
                <div class="input-group-inline">
                  <label>行程</label>
                  <div class="select" style="width: 200px">
                    <v-select
                      v-model="query.trip"
                      :options="tripOptions"
                      placeholder="請選擇行程"
                    ></v-select>
                  </div>
                  <span
                    class="btn btn-text px-2 pt-3"
                    style="margin-top: -10px"
                    v-tooltip.right="{
                      content: '若無顯示物種，只能篩選資料，無法進行資料分析．',
                    }"
                  >
                    <i class="icon-info"></i>
                  </span>
                  <label class="ml-5">品質註記</label>
                  <div class="select d-inline-block" style="width: 200px">
                    <v-select
                      v-model="query.qualityNote"
                      :options="qualityNoteOptions"
                      placeholder="請為資料註記品質"
                    ></v-select>
                  </div>
                </div>
                <div class="d-inline-block">
                  <div class="input-group-inline">
                    <label>時間</label>
                    <div class="input-group">
                      <date-picker
                        :format="'YYYY-MM-DD'"
                        :first-day-of-week="1"
                        v-model="query.startDate"
                        placeholder="請選擇日期"
                        style="width: 200px"
                      ></date-picker>
                      <div class="input-group-append">
                        <i class="icon icon-calendar"></i>
                      </div>
                    </div>
                    <div class="input-group ml-2" style="width: 50px">
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
                    <div class="input-group ml-2" style="width: 50px">
                      <vue-timepicker
                        v-model="query.endTime"
                        hide-clear-button
                      ></vue-timepicker>
                    </div>
                    <button
                      @click.prevent="clickSearch"
                      class="btn btn-green"
                      :style="{ margin: '4px' }"
                      :disabled="!canSearch"
                    >
                      篩選
                    </button>
                  </div>
                </div>
                <a
                  class="btn btn-green-border float-right"
                  :style="{ margin: '4px' }"
                  style="height: 32px"
                  v-tooltip.bottom="
                    '將目前頁面或篩選範圍之資料輸出為 CSV 檔並下載'
                  "
                  :href="canSearch ? exportCSVLink : undefined"
                  target="_blank"
                  :disabled="!canSearch"
                >
                  下載篩選結果
                </a>
                <button
                  class="btn btn-green float-right"
                  :style="{ margin: '4px' }"
                  @click="setEdit(true)"
                  :disabled="disabledEdit"
                >
                  <i class="fa fa-pencil-alt"></i> 編輯模式
                </button>
              </div>
            </form>
          </div>
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
import vSelect from 'vue-select';

import {
  dateFormatYYYYMMDDHHmmss,
  getTodayDate,
  subNYears,
} from '@/utils/dateHelper.js';
import InfoModal from '@/components/Modal/InfoModal.vue';

import AnnotationsSheet from './AnnotationsSheet';
import RightSide from './RightSide.vue';
import queryString from 'query-string';

const studyAreas = createNamespacedHelpers('studyAreas');
const annotations = createNamespacedHelpers('annotations');
const projects = createNamespacedHelpers('projects');
const dataFields = createNamespacedHelpers('dataFields');
const account = createNamespacedHelpers('account');
const trip = createNamespacedHelpers('trip');

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
  trip: {},
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

const qualityNoteOptions = [
  { label: '品質註記1', value: 'qualityNote1' },
  { label: '品質註記2', value: 'qualityNote2' },
];

export default {
  components: {
    AnnotationsSheet,
    RightSide,
    VueTimepicker,
    DatePicker,
    InfoModal,
    vSelect,
  },
  data() {
    return {
      lockByOtherModal: false,
      isLoading: false,
      isEdit: false,
      galleryShow: true,
      historyShow: true,
      currentAnnotationIdx: -1, // 目前選擇的資料 index
      query: Object.assign({}, defaultQuery),
      tripOptions: [],
      qualityNoteOptions,
      collapse: true,
    };
  },
  async mounted() {
    this.getDataFields();
    this.getProjectSpecies(this.projectId);
    this.updateDateRange();
    await this.getProjectTrips(this.projectId);
    this.tripOptions = this.projectTrips.map(({ sn, id }) => ({
      label: sn,
      value: id,
    }));
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
      this.resetPagination();
    },
    '$store.state.annotations.queryCameraLocations'() {
      debounceTimeId && window.clearTimeout(debounceTimeId);

      debounceTimeId = setTimeout(() => {
        debounceTimeId = undefined;
        this.query.index = 0;
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
    ...annotations.mapState([
      'annotationsTotal',
      'requestProcessingCount',
      'queryCameraLocations',
    ]),
    ...trip.mapState(['projectTrips']),
    ...account.mapGetters(['userId']),
    ...projects.mapGetters(['projectDetail']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    studyAreaId: function() {
      return this.$route.params.studyAreaId;
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
      return this.queryCameraLocations
        .map(v => this.cameraLocations.find(c => c.id === v).name)
        .join(', ');
    },
    disabledEdit: function() {
      return (
        this.annotationsTotal === 0 ||
        this.cameraLocations
          .filter(v => this.queryCameraLocations.includes(v.id))
          .some(v => v.isLocked === true && v.lockUser.id !== this.userId)
      );
    },
    exportCSVLink: function() {
      const { query } = this;
      const queryParams = {
        studyAreaId: this.studyAreaId,
        cameraLocations: this.queryCameraLocations,
        trip: query.trip.value,
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
      return this.queryCameraLocations.length > 0;
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
    ...trip.mapActions(['getProjectTrips']),
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
    resetPagination() {
      this.$refs.sheet.resetPagination(this.query.index);
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
            cameraLocations: this.queryCameraLocations,
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
          cameraLocations: this.queryCameraLocations,
          isLock: bool,
        });

        this.isEdit = false;
      }
    },
    clickSearch() {
      this.query.index = 0;
      this.doSearch();
    },
    async doSearch() {
      this.resetPagination();
      this.currentAnnotationIdx = -1;
      if (this.queryCameraLocations.length === 0) {
        this.resetAnnotations();
        return;
      }
      const { query } = this;

      this.isLoading = true;

      await this.getAnnotations({
        studyAreaId: this.studyAreaId,
        ...{
          cameraLocations: this.queryCameraLocations,
          trip: query.trip.value,
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

.accordion {
  .accordion-item {
    .accordion-heading {
      border: none;
      .icon {
        margin: 0px 10px;
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
