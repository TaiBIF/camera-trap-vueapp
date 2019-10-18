<template>
  <div class="sheet-container" v-show="isInitDone">
    <AnnotationsSheet
      ref="sheet"
      :isEdit="isEdit"
      :galleryShow="false"
      :historyShow="false"
      :currentAnnotationIdx="currentAnnotationIdx"
      @changePage="setPagination"
      @galleryShow="() => {}"
      @historyShow="() => {}"
      @currentAnnotationIdx="currentAnnotationIdx = $event"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { generateUrl } from '@/utils/fetch';
import { getLanguage } from '@/utils/i18n';
import AnnotationsSheet from '@/pages/Project/ProjectStudyAreas/AnnotationsSheet';
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
  },
  props: {
    annotations,
  },
  data() {
    return {
      isLoading: true,
      isInitDone: false,
      isEdit: false,
      galleryShow: false,
      historyShow: false,
      currentAnnotationIdx: -1,
      query: Object.assign({}, { size: 50 }, this.$route.query),
    };
  },
  watch: {
    galleryShow: 'setSheetHeight',
    historyShow: 'setSheetHeight',
    annotations() {
      console.log(this.annotations);
      this.setAnnotations({
        items: this.annotations,
        total: this.annotations.length,
      });
    },
  },
  computed: {
    ...account.mapGetters(['species']),
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

    // AnnotationsSheet
    setPagination(val) {
      this.query.index = val.currentPage - 1;
      this.query.size = val.pageSize;
      this.doSearch();
    },
  },
  setSheetHeight() {
    this.$refs.sheet.setSheetHeight();
  },
  async mounted() {
    this.currentAnnotationIdx = -1;
    this.isLoading = false;
    this.isInitDone = true;
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
