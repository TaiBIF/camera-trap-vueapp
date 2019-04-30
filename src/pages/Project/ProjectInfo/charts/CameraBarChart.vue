<template>
  <div>
    <v-charts :options="barOption" ref="barCharts" />
    <chart-legend type="receive" />
  </div>
</template>

<script>
import ChartLegend from '@/pages/Project/ProjectInfo/charts/ChartLegend';
import VueHighcharts from 'vue2-highcharts';

export default {
  name: 'camera-bar-chart',
  components: {
    'v-charts': VueHighcharts,
    ChartLegend,
  },
  data() {
    return {
      barOption: {
        chart: {
          type: 'column',
          height: 230,
        },
        title: {
          enable: false,
          text: '',
        },
        legend: {
          enabled: false,
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
          title: {
            enable: true,
            text: '每月影像筆數',
          },
        },
        yAxis: {
          title: {
            enable: false,
            text: '',
          },
        },
        series: [],
      },
    };
  },
  mounted() {
    if (this.selectedCameraId) {
      this.loadCameraChart();
    }
  },
  computed: {
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
        // TODO: data from API
        data: [
          { value: 20, error: 0, isRemove: false },
          { value: 120, error: 10, isRemove: false },
          { value: 220, error: 100, isRemove: false },
          { value: 60, error: 0, isRemove: false },
          { value: 30, error: 1, isRemove: false },
          { value: 20, error: 0, isRemove: true },
          { value: 80, error: 0, isRemove: false },
          { value: 60, error: 1, isRemove: false },
          { value: 90, error: 0, isRemove: false },
          { value: 30, error: 0, isRemove: false },
        ].map(({ value, error, isRemove }, i) => ({
          name: i + 1 + '月',
          y: value,
          errorNumber: error,
          lastUploaded: '2018/08/16',
          color: error > 0 ? '#FEC9D4' : isRemove ? '#8C9CAB' : '#8ACFCB', // TODO: share config with ChartLegend
        })),
      };
      const barCharts = this.$refs.barCharts;
      barCharts.removeSeries();
      barCharts.addSeries(BarChartData);
    },
  },
};
</script>
<style lang="scss" scoped>
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
