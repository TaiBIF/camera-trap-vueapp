<template>
  <div :class="{ loading: retrievalLoadingStatus === 'loading' }">
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
    <camera-bar-chart v-if="selectedCameraId" :year="selectedYear" />
    <area-bar-chart
      v-else
      :activeCameraId="activeCameraId"
      :year="selectedYear"
    />
    <error-report-modal
      :open="showErrorReportModal"
      :errorMessage="submitErrorReportFailMessage"
      @close="closeErrorReportModal"
      @submit="submitErrorReport"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { postCameraLocationAbnormality } from '@/service';
import AreaBarChart from '@/pages/Project/ProjectInfo/charts/AreaBarChart.vue';
import CameraBarChart from '@/pages/Project/ProjectInfo/charts/CameraBarChart.vue';
import ErrorReportModal from '@/components/Modal/ErrorReportModal.vue';

const projects = createNamespacedHelpers('projects');
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
      submitErrorReportFailMessage: '',
    };
  },
  mounted() {
    this.loadRetrievealDataByCurrentSelected();
  },
  watch: {
    selectedYear: 'loadRetrievealDataByCurrentSelected',
    projectId: 'loadRetrievealDataByCurrentSelected',
    selectedStudyAreaId: 'loadRetrievealDataByCurrentSelected',
    selectedCameraId: 'loadRetrievealDataByCurrentSelected',
  },
  computed: {
    ...projects.mapGetters(['retrievalLoadingStatus']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    selectedStudyAreaId: function() {
      return this.$route.params.selectedStudyAreaId;
    },
    selectedCameraId: function() {
      return this.$route.params.selectedCameraId;
    },
  },
  methods: {
    ...projects.mapActions(['loadRetrievalData']),
    loadRetrievealDataByCurrentSelected() {
      this.loadRetrievalData({
        year: this.selectedYear,
        projectId: this.projectId,
        studyAreaId:
          this.selectedStudyAreaId !== 'all'
            ? this.selectedStudyAreaId
            : undefined,
        cameraLocationId: this.selectedCameraId,
      });
    },
    changeSelectedYear(year) {
      if (year > new Date().getFullYear()) {
        return;
      }
      this.selectedYear = year;
    },
    closeErrorReportModal() {
      this.showErrorReportModal = false;
      this.submitErrorReportFailMessage = '';
    },
    async submitErrorReport(data) {
      this.submitErrorReportFailMessage = '';
      const res = await postCameraLocationAbnormality({
        ...data,
        projectId: this.projectId,
      }).catch(() => {
        this.submitErrorReportFailMessage =
          '資料未送出，請再試一次。如持續發生請聯繫系統管理員。';
      });
      if (res) this.showErrorReportModal = false;
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
