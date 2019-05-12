<template>
  <div>
    <div class="control">
      <button @click="changeSelectedYear(selectedYear - 1)">
        <i class="fa fa-3 fa-caret-left"></i>
      </button>
      <span class="mx-2">{{ selectedYear }}</span>
      <button
        @click="changeSelectedYear(selectedYear + 1)"
        :disabled="selectedYear >= currentYear"
      >
        <i class="fa fa-3 fa-caret-right"></i>
      </button>
      <a
        v-if="selectedStudyAreaId !== 'all'"
        @click="showErrorReportModal = true"
        class="btn btn-sm btn-default"
      >
        相機異常回報
      </a>
    </div>
    <camera-bar-chart v-if="selectedCameraId" />
    <area-bar-chart v-else :activeCameraId="activeCameraId" />
    <error-report-modal
      :open="showErrorReportModal"
      @close="showErrorReportModal = false"
      @submit="submitErrorReport"
    />
  </div>
</template>

<script>
import AreaBarChart from '@/pages/Project/ProjectInfo/charts/AreaBarChart.vue';
import CameraBarChart from '@/pages/Project/ProjectInfo/charts/CameraBarChart.vue';
import ErrorReportModal from '@/components/Modal/ErrorReportModal.vue';

const currentYear = new Date().getFullYear();

export default {
  name: 'project-chart',
  components: {
    ErrorReportModal,
    AreaBarChart,
    CameraBarChart,
  },
  props: {
    activeCameraId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentYear: currentYear,
      selectedYear: currentYear,
      showErrorReportModal: false,
    };
  },
  mounted() {},
  watch: {
    selectedYear: function() {
      // TODO: fetch new data
    },
  },
  computed: {
    selectedStudyAreaId: function() {
      return this.$route.params.selectedStudyAreaId;
    },
    selectedCameraId: function() {
      return this.$route.params.selectedCameraId;
    },
  },
  methods: {
    changeSelectedYear(year) {
      if (year > new Date().getFullYear()) {
        return;
      }
      this.selectedYear = year;
    },
    submitErrorReport() {
      // TODO: wait for API,
      // TODO: close error report modal and show success modal
    },
  },
};
</script>
<style lang="scss" scoped>
.control {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
  color: #8b8b8b;
  margin-bottom: 5px;

  & > button {
    cursor: pointer;
  }
  & > a {
    position: absolute;
    right: 0;
  }
}
</style>
