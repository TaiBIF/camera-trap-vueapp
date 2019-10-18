<template>
  <div class="container">
    <h1 class="text-green">資料篩選與下載</h1>
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
          @changePage="changeFilterResultPage"
        ></annotation-sheet>
      </div>
      <hr />
      <div class="panel-body">
        <h3>計算分析</h3>
        <calculate-filters v-on:filter="filter"></calculate-filters>
      </div>
      <hr />
      <div class="panel-body" v-if="isCalculateEnd">
        <h3>分析結果</h3>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { dateFormatYYYYMMDDHHmmss } from '@/utils/dateHelper.js';
import annotationSheet from './AnnotationsSheet';
import calculateFilters from './CalculateFilters';
import fetchWrap from '@/utils/fetch';
import filters from './Filters';
import queryString from 'query-string';
import 'vue2-timepicker/dist/VueTimepicker.css';

const projects = createNamespacedHelpers('projects');

export default {
  name: 'Search',
  components: {
    filters,
    calculateFilters,
    annotationSheet,
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
      query: {
        index: 1,
      },
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
  },
  methods: {
    ...projects.mapActions(['getAllProjects']),
    changeFilterResultPage(val) {
      this.query.index = val;
      this.filter(this.searchParams);
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
      await this.getAllProjects({ size: 100, sort: 'title' });

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
