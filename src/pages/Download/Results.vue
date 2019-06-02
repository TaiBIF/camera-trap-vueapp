<template>
  <div class="maintain page-sheet p-0" :class="{ loading: isLoading }">
    <div class="search-container">
      <div class="col-12 pt-2">
        <router-link to="/download/search">
          <small class="text-gray">
            <i class="fa fa-chevron-left"></i> 返回資料篩選及計算
          </small>
        </router-link>
        <div>
          <div class="float-right">
            <a
              class="btn btn-green-border btn-sm"
              :href="exportUrl"
              v-tooltip.bottom="'將目前頁面或篩選範圍之資料輸出為 CSV 檔並下載'"
            >
              <span class="icon"><i class="icon-download-green"></i></span>
              <span class="text">下載篩選結果</span>
            </a>
          </div>
          <h3 class="text-green mb-2 mt-2">資料篩選結果</h3>
        </div>
      </div>

      <div class="search-content">
        <div class="row search-filters">
          <div class="col-4">
            <div class="item">
              <label>資料來源：</label>
              <div class="content" v-show="isInitDone">
                <div
                  :key="cameraLocation"
                  v-for="cameraLocation in [...$route.query.cameraLocations]"
                >
                  {{ projectDetail.title }}：{{
                    studyAreaTitle($route.query.studyAreaId)
                  }}
                  - {{ cameraLocationsTitle(cameraLocation) }}
                </div>
              </div>
            </div>
            <div v-if="selectedSpecies.length" class="item">
              <label>物種：</label>
              <div class="content">
                {{ selectedSpecies.map(spec => spec.title).join('、') }}
              </div>
            </div>
            <div v-if="startTime || endTime" class="item">
              <label>資料時間：</label>
              <div class="content">{{ startTime }} ~ {{ endTime }}</div>
            </div>
          </div>

          <div class="col-4">
            <div
              v-for="(item, index) in selectedFields"
              :key="`select-fields-${index}`"
              class="item short-label"
            >
              <label>{{ item.label }}：</label>
              <div class="content">
                {{ item.value }}
              </div>
            </div>
          </div>

          <div class="col-4">
            <div class="item long-label">
              <label>拍攝時段：</label>
              <div class="content">
                {{ timeRangeStart }} ~ {{ timeRangeEnd }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="sheet-container" v-show="isInitDone">
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
      />
      <right-side
        :galleryShow="galleryShow"
        :historyShow="historyShow"
        :currentAnnotationIdx="currentAnnotationIdx"
        @currentAnnotationIdx="currentAnnotationIdx = $event"
        @changeWidth="setSheetHeight"
      />
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { generateUrl } from '@/utils/fetch';
import { getLanguage } from '@/utils/i18n';
import AnnotationsSheet from '@/pages/Project/ProjectStudyAreas/AnnotationsSheet';
import RightSide from '@/pages/Project/ProjectStudyAreas/RightSide.vue';
import moment from 'moment';
import queryString from 'query-string';

const account = createNamespacedHelpers('account');
const annotations = createNamespacedHelpers('annotations');
const dataFields = createNamespacedHelpers('dataFields');
const projects = createNamespacedHelpers('projects');
const studyAreas = createNamespacedHelpers('studyAreas');

export default {
  components: {
    AnnotationsSheet,
    RightSide,
  },
  data() {
    return {
      isLoading: true,
      isInitDone: false,
      isEdit: false,
      galleryShow: true,
      historyShow: true,
      currentAnnotationIdx: -1,
      query: Object.assign({}, { size: 50 }, this.$route.query),
    };
  },
  watch: {
    galleryShow: 'setSheetHeight',
    historyShow: 'setSheetHeight',
  },
  computed: {
    ...account.mapGetters(['species']),
    ...annotations.mapGetters(['annotations']),
    ...dataFields.mapGetters(['dataFields']),
    ...projects.mapGetters(['projectDetail']),
    ...studyAreas.mapGetters(['studyAreaTitle', 'cameraLocationsTitle']),
    startTime() {
      if (!this.$route.query.startTime) {
        return '';
      }
      return moment(this.$route.query.startTime).format('YYYY/MM/DD');
    },
    endTime() {
      if (!this.$route.query.endTime) {
        return '';
      }
      return moment(this.$route.query.endTime).format('YYYY/MM/DD');
    },
    timeRangeStart() {
      const time = new Date(+this.$route.query.timeRangeStart);
      return moment(time).format('HH:mm');
    },
    timeRangeEnd() {
      const time = new Date(+this.$route.query.timeRangeEnd);
      return moment(time).format('HH:mm');
    },
    selectedFields() {
      /*
      @return {Array<Object>}
        {
          label: "string",
          value: "string",
        }
       */
      if (
        !this.$route.query.fields ||
        !this.dataFields ||
        !this.dataFields.length
      ) {
        return [];
      }

      const fields = JSON.parse(this.$route.query.fields);
      const result = [];
      for (const dataFieldId in fields) {
        const value = fields[dataFieldId];
        const dataField = this.dataFields.find(x => x.id === dataFieldId);
        result.push({
          label: dataField.title,
          value:
            dataField.widgetType === 'select'
              ? dataField.options.find(x => x.id === value)[getLanguage()]
              : value,
        });
      }
      return result;
    },
    selectedSpecies() {
      if (!this.$route.query.species || !this.species || !this.species.length) {
        return [];
      }
      const speciesIds = Array.isArray(this.$route.query.species)
        ? this.$route.query.species
        : [this.$route.query.species];
      return speciesIds.map(speciesId =>
        this.species.find(x => x.id === speciesId),
      );
    },
    currentLanguage() {
      return getLanguage();
    },
    exportUrl() {
      return generateUrl(
        `/api/v1/annotations.csv?${queryString.stringify(this.$route.query)}`,
      );
    },
  },
  methods: {
    ...account.mapActions(['loadSpecies']),
    ...dataFields.mapActions(['getAllDataFields']),
    ...annotations.mapActions(['getAnnotations']),
    ...annotations.mapMutations(['resetAnnotations']),
    ...projects.mapActions(['getProjectDetail']),
    ...studyAreas.mapActions([
      'getProjectStudyAreas',
      'getProjectCameraLocations',
    ]),

    // AnnotationsSheet
    setPagination(val) {
      this.query.index = val.currentPage - 1;
      this.query.size = val.pageSize;
      this.doSearch();
    },
    async doSearch() {
      if (this.query.cameraLocations.length === 0) {
        this.resetAnnotations();
        return;
      }
      const { query } = this;

      this.isLoading = true;
      this.currentAnnotationIdx = -1;

      await this.getAnnotations({
        cameraLocations: query.cameraLocations,
        startTime: query.startTime,
        endTime: query.endTime,
        index: query.index,
        size: query.size,
      });
      this.isLoading = false;
    },
    setSheetHeight() {
      this.$refs.sheet.setSheetHeight();
    },
  },
  async mounted() {
    try {
      await Promise.all([
        this.loadSpecies(),
        this.getAllDataFields(),
        this.getProjectDetail(this.$route.query.projectId),
        this.getProjectStudyAreas(this.$route.query.projectId),
        this.getProjectCameraLocations({
          projectId: this.$route.query.projectId,
          studyAreaId: this.$route.query.studyAreaId,
        }),
      ]);

      await this.doSearch();
    } catch (error) {
      throw error;
    } finally {
      this.isLoading = false;
      this.isInitDone = true;
      this.setSheetHeight();
    }
  },
};
</script>

<style lang="scss">
.maintain {
  width: 100%;
}
.empty-result {
  text-align: center;
  padding-top: 5%;
  padding-bottom: 5%;
}
</style>
