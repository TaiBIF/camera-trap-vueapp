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
    <v-charts :options="barOption" ref="barCharts" />
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
      barOption: {
        chart: {
          type: 'column',
          height: 230,
        },
        colors: ['#8ACFCB'],
        title: {
          enable: false,
          text: '',
        },
        tooltip: {
          headerFormat: '',
          backgroundColor: 'rgba(0, 0, 0, .8)',
          useHTML: true,
          pointFormatter() {
            return `
              <div class="tooltip ${this.errorNumber > 0 ? 'showError' : ''}">
                <div>
                  <h5>${this.y} <small>筆</small></h5>
                  <span>${this.errorNumber} 筆資料異常</span>
                </div>
                <div>資料最新上傳日：${this.lastUploaded}</div>
              </div>
            `;
          },
        },
        plotOptions: {
          column: {
            states: {
              hover: {
                color: '#09968F',
              },
            },
          },
        },
        xAxis: {
          categories: [
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '9月',
            '9月',
            '10月',
            '11月',
            '12月',
          ],
        },
        yAxis: {
          title: {
            text: '',
          },
        },
        series: null,
      },
    };
  },
  mounted() {
    if (this.selectedCameraId) {
      this.loadCameraChart();
    }
  },
  watch: {
    selectedCameraId: function(selectedCameraId) {
      if (selectedCameraId) {
        this.loadCameraChart();
      }
    },
    selectedYear: function(year) {
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
    loadCameraChart() {
      const BarChartData = {
        name: '每月影像筆數',
        // TODO: data from API
        data: [
          { value: 20, error: 0 },
          { value: 120, error: 10 },
          { value: 220, error: 100 },
          { value: 60, error: 0 },
          { value: 30, error: 1 },
          { value: 20, error: 0 },
          { value: 80, error: 0 },
          { value: 60, error: 1 },
          { value: 90, error: 0 },
          { value: 30, error: 0 },
        ].map(({ value, error }, i) => ({
          name: i + 1 + '月',
          y: value,
          errorNumber: error,
          lastUploaded: '2018/08/16',
          color: error > 0 ? '#FEC9D4' : '#8ACFCB',
        })),
      };
      const barCharts = this.$refs.barCharts;
      barCharts.removeSeries();
      barCharts.addSeries(BarChartData);
    },
    submitErrorReport(data) {
      // TODO: wait for API,
      // TODO: close error report modal and show success modal
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
  margin-bottom: 5px;

  & > button {
    cursor: pointer;
  }
  & > a {
    position: absolute;
    right: 0;
  }
}
.tooltip {
  color: #fff;
  margin: 0;
  padding: 0;

  div:first-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  h5 {
    margin: 0;
  }
  span {
    display: none;
  }
  &.showError {
    span {
      display: inline-block;
      padding: 5px;
      margin-left: 5px;
      color: #fff;
      background-color: #db5158;
      border-radius: 3px;
      font-size: 10px;
    }
  }
}
</style>
