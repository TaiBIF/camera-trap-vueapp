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
    <!-- <v-charts :options="barOption" ref="barCharts" /> -->
    <error-report-modal
      :open="showErrorReportModal"
      @close="showErrorReportModal = false"
      @submit="submitErrorReport"
    />
  </div>
</template>

<script>
import ErrorReportModal from '@/components/Modal/ErrorReportModal.vue';
import VueHighcharts from 'vue2-highcharts';

const currentYear = new Date().getFullYear();

export default {
  name: 'project-chart',
  components: {
    'v-charts': VueHighcharts,
    ErrorReportModal,
  },
  data() {
    return {
      currentYear: currentYear,
      selectedYear: currentYear,
      showErrorReportModal: false,
    };
  },
  computed: {
    selectedStudyAreaId: function() {
      return this.$route.params.selectedStudyAreaId;
    },
  },
  methods: {
    changeSelectedYear(year) {
      if (year > new Date().getFullYear()) {
        return;
      }
      this.selectedYear = year;
    },
    submitErrorReport(data) {
      // TODO: wait for API,
      // TODO: close error report modal and show success modal
    },
  },
  watch: {
    selectedYear: function(year) {
      // TODO: fetch new data
    },
  },
};
</script>
<style lang="scss" scope>
.control {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
  color: #8b8b8b;

  & > button {
    cursor: pointer;
  }
  & > a {
    position: absolute;
    right: 0;
  }
}
</style>
