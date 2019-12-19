<template>
  <div class="container">
    <h1 class="text-green">資料篩選與計算</h1>
    <div :class="{ loading: isLoading, panel: true }">
      <div class="panel-body">
        <h3>篩選條件</h3>
        <filters v-on:filter="filter" :dataFields.sync="dataFields"></filters>
      </div>
      <hr />
      <div class="panel-body" v-if="isSearchEnd">
        <h3>篩選結果</h3>
        <annotation-sheet
          :dataFields.sync="dataFields"
          :annotations.sync="annotations"
          :annotationsTotal.sync="annotationsTotal"
          :currentAnnotationIdx="0"
          :downloadLink="downloadLink"
          @changePage="changeFilterResultPage"
        ></annotation-sheet>
      </div>
      <hr />
      <info-modal
        v-if="!!showInfoModal"
        :open="!!showInfoModal"
        @close="showInfoModal = false"
      >
        <h1 class="text-green">
          計算項目的說明
        </h1>
        <div style="text-align: left;">
          <ul>
            <li>
              <div><strong>相機工作時數：</strong></div>
              為每台相機實際工作的時數。由使用者於行程管理中所設定的相機有效開始工作時間及結束時間的範圍相減，計算至小時。
            </li>
            <li>
              <div><strong>有效照片數：</strong></div>
              在自訂的「時間判定間隔」內，無法辨識個體的同物種照片，視為一有效照片，也就是
              (總照片數)–(連拍同一隻動物的照片數) = 有效照片數。
            </li>
            <li>
              <div><strong>目擊事件：</strong></div>
              此指標計算每台相機捕獲到動物的總事件數（e），並除以該相機之總工作時數（L）做標準化，亦即e
              / L。事件數定義為：前後相鄰兩張同種之動物照片若間隔 m
              分鐘內視為同一事件，不考慮同一張照片內之個體數，亦不辨識個體。其中
              m 可從「時間判定間隔」選擇。
            </li>
            <li>
              <div><strong>OI_1：</strong></div>
              原始OI值定義，考慮每張照片所拍攝之個體數，並辨識不同照片之間的個體是否相同，須有「個體
              ID」欄位的資料才能計算。
            </li>
            <li>
              <div><strong>OI_2：</strong></div>
              考慮每張照片所拍攝之個體數，但不辨識不同照片之間的個體是否相同，以本系統提供的「隻數」資料欄位運算。
            </li>
            <li>
              <div><strong>OI_3：</strong></div>
              為一般使用的 OI 值定義，計算方式為
              (有效照片數)/(相機工作時數)＊１０００捕獲回合比例：此項指標將每台相機於每回合（可選擇資料之時間範圍全部
              或
              依每月計算）中的拍攝視為一個試驗（trial），每次的試驗區分為成功（拍攝到動物，不計個體數或頻率）或不成功（未拍攝到動物）兩種結果，並計算每回合每台相機的成功機率（成功次數/試驗次數，亦即相機捕獲動物之回合數/當期回合數），再計算所有相機的平均成功機率。
            </li>
            <li>
              <div><strong>偵測到/未偵測到：</strong></div>
              在使用者定義的捕獲回合的時間單位（選取資料之全部時間範圍/月）內，動物被偵測與否的指標（detection,
              d）；若動物存在（被相機拍攝到，且不計頻率）則d為1，不存在則d為0。
            </li>
            <li>
              <div>
                <strong
                  >活動機率（apparent probability of activity, APOA）：</strong
                >
              </div>
              動物在每小時當中被拍攝到的機率。此指標定義為「累計所有相機在每個小時的d
              值（detection,
              同上），並除以每個小時的取樣次數」。依此定義，每個小時的APOA最小值為0，最大值為1。
            </li>
          </ul>
        </div></info-modal
      >
      <div class="panel-body">
        <h3>
          計算分析
          <button class="btn btn-default" @click="showInfoModal = true">
            說明
          </button>
        </h3>
        <calculate-filters v-on:calculate="calculate"></calculate-filters>
      </div>
      <hr />
      <div class="panel-body" v-if="isCalculateEnd">
        <h3>分析結果</h3>
        <work-hours
          v-if="calculateType === 'work-hours'"
          :rangeType="calculateRangeType"
          :data="calculateData"
        ></work-hours>
        <valid-pics
          v-else-if="calculateType === 'valid-pics'"
          :rangeType="calculateRangeType"
          :species="calculateData.species"
          :data="calculateData.data"
        ></valid-pics>
        <events
          v-else-if="calculateType === 'events'"
          :rangeType="calculateRangeType"
          :species="calculateData.species"
          :data="calculateData.data"
        >
        </events>
        <oi1
          v-else-if="calculateType === 'oi1'"
          :rangeType="calculateRangeType"
          :species="calculateData.species"
          :data="calculateData.data"
        >
        </oi1>
        <oi2
          v-else-if="calculateType === 'oi2'"
          :rangeType="calculateRangeType"
          :species="calculateData.species"
          :data="calculateData.data"
        >
        </oi2>
        <oi3
          v-else-if="calculateType === 'oi3'"
          :rangeType="calculateRangeType"
          :species="calculateData.species"
          :data="calculateData.data"
        >
        </oi3>
        <capture-rate
          v-else-if="calculateType === 'capture-rate'"
          :rangeType="calculateRangeType"
          :species="calculateData.species"
          :data="calculateData.data"
        >
        </capture-rate>
        <detection
          v-else-if="calculateType === 'detection'"
          :rangeType="calculateRangeType"
          :species="calculateData.species"
          :data="calculateData.data"
        >
        </detection>
        <apoa
          v-else-if="calculateType === 'apoa'"
          :rangeType="calculateRangeType"
          :species="calculateData.species"
          :data="calculateData.data"
        >
        </apoa>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { dateFormatYYYYMMDDHHmmss } from '@/utils/dateHelper.js';
import InfoModal from '@/components/Modal/InfoModal.vue';
import annotationSheet from './AnnotationsSheet';
import apoa from './Apoa';
import calculateFilters from './CalculateFilters';
import captureRate from './CaptureRate';
import detection from './Detection';
import events from './Events';
import fetchWrap from '@/utils/fetch';
import filters from './Filters';
import oi1 from './Oi1';
import oi2 from './Oi2';
import oi3 from './Oi3';
import queryString from 'query-string';
import validPics from './ValidPics';
import workHours from './WorkHours';
import 'vue2-timepicker/dist/VueTimepicker.css';

const projects = createNamespacedHelpers('projects');

export default {
  name: 'Search',
  components: {
    filters,
    calculateFilters,
    annotationSheet,
    workHours,
    validPics,
    events,
    captureRate,
    detection,
    oi1,
    oi2,
    oi3,
    apoa,
    InfoModal,
  },
  data() {
    return {
      isLoading: true,
      isSearchEnd: false,
      isCalculateEnd: false,
      isAdvanceSearch: false,
      dataFields: [],
      annotations: [],
      annotationsTotal: 0,
      searchParams: {},
      calculateData: [],
      calculateRangeType: '',
      query: {
        index: 1,
      },
      showInfoModal: false,
    };
  },
  computed: {
    ...projects.mapState(['projects']),
    projectOptions() {
      return this.projects.map(project => ({
        label: project.title,
        value: project.id,
      }));
    },
    downloadLink: function() {
      let params = this.searchParams;
      let studyAreaIds = [];
      params.projects.forEach(project => {
        studyAreaIds = studyAreaIds.concat(
          project.studyAreas.map(s => s.value),
        );
      });
      let cameraLocations = [];
      params.projects.forEach(project => {
        cameraLocations = cameraLocations.concat(
          project.cameraLocations.map(c => c.value),
        );
      });

      const query = {
        index: this.query.index,
        'cameraLocationIds[]': cameraLocations,
        'speciesIds[]': params.species.map(x => x.value),
        'projectIds[]': params.projects.map(p => p.project.value),
        ...params.others,
        startDateTime: params.startDateTime,
        endDateTime: params.endDateTime,
      };
      return `${
        process.env.VUE_APP_API_URL
      }/api/v1/simple-annotations.csv?${queryString.stringify(query)}`;
    },
  },
  methods: {
    ...projects.mapActions(['getPublicProjects']),
    changeFilterResultPage(val) {
      this.query.index = val;
      this.filter(this.searchParams);
    },
    async calculate(typeObject, rangeTypeObject, params) {
      let studyAreaIds = [];
      this.searchParams.projects.forEach(project => {
        studyAreaIds = studyAreaIds.concat(
          project.studyAreas.map(s => s.value),
        );
      });

      let cameraLocations = [];
      this.searchParams.projects.forEach(project => {
        cameraLocations = cameraLocations.concat(
          project.cameraLocations.map(c => c.value),
        );
      });

      const query = {
        index: this.query.index,
        'cameraLocationIds[]': cameraLocations,
        'speciesIds[]': this.searchParams.species.map(x => x.value),
        'projectIds[]': this.searchParams.projects.map(p => p.project.value),
        ...this.searchParams.others,
        startDateTime: this.searchParams.startDateTime,
        endDateTime: this.searchParams.endDateTime,
      };

      this.calculateType = typeObject.value;
      this.calculateRangeType = rangeTypeObject.value;
      query.range = this.calculateRangeType;
      query.calculateTimeIntervel = params.calculateTimeIntervel.value;

      const data = await fetchWrap({
        url: `/api/v1/calculator/${this.calculateType}?${queryString.stringify(
          query,
        )}`,
        method: 'GET',
      });
      this.isCalculateEnd = true;
      this.calculateData = data;
    },
    async filter(params) {
      this.searchParams = params;
      let studyAreaIds = [];
      params.projects.forEach(project => {
        studyAreaIds = studyAreaIds.concat(
          project.studyAreas.map(s => s.value),
        );
      });

      let cameraLocations = [];
      params.projects.forEach(project => {
        cameraLocations = cameraLocations.concat(
          project.cameraLocations.map(c => c.value),
        );
      });

      const query = {
        index: this.query.index,
        'cameraLocationIds[]': cameraLocations,
        'speciesIds[]': params.species.map(x => x.value),
        'projectIds[]': params.projects.map(p => p.project.value),
        ...params.others,
        startDateTime: params.startDateTime,
        endDateTime: params.endDateTime,
      };

      const { items: annotations, total } = await fetchWrap({
        url: `/api/v1/simple-annotations?${queryString.stringify(query)}`,
        method: 'GET',
      });

      this.annotationsTotal = total;
      this.annotations = annotations.map(v => ({
        id: v.id,
        studyArea: v.studyArea,
        cameraLocation: v.cameraLocation,
        filename: v.filename,
        time: dateFormatYYYYMMDDHHmmss(v.time),
        species: v.species ? v.species.title : '',
        ...v.fields.reduce((pre, current) => {
          pre[current.dataField] = current.value;
          return pre;
        }, {}),
      }));
      this.isSearchEnd = true;
    },
  },
  async mounted() {
    try {
      //await this.getAllProjects({ size: 100, sort: 'title' });
      await this.getPublicProjects({ size: 100, sort: 'title' });

      // dataFields
      const { items: dataFields } = await fetchWrap({
        method: 'GET',
        url: `/api/v1/data-fields?filter=custom`,
      });
      this.dataFields = dataFields;
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      throw error;
    }
  },
};
</script>

<style lang="scss">
.v-tooltip-open {
  width: 600px;
}
.search-columns {
  input.filter-input {
    height: 32px !important;
  }

  .mx-datepicker {
    width: 100%;
    display: inline-block;
  }
}
</style>
