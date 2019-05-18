<template>
  <div>
    <v-charts :options="barOption" ref="barCharts" />
    <chart-legend type="receive" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import ChartLegend from '@/pages/Project/ProjectInfo/charts/ChartLegend';
import VueHighcharts from 'vue2-highcharts';

const projects = createNamespacedHelpers('projects');

export default {
  name: 'camera-bar-chart',
  components: {
    'v-charts': VueHighcharts,
    ChartLegend,
  },
  props: {
    year: {
      type: Number,
      required: true,
    },
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
              <div class="tooltip">
                <div>
                  <h5>${this.y} <small>筆</small></h5>
                  <span class="${this.errorNumber > 0 && 'showError'}">${
              this.errorNumber
            } 筆資料異常</span>
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
    ...projects.mapGetters([
      'getCameraRetrievalData',
      'retrievalLoadingStatus',
    ]),
    selectedCameraId: function() {
      return this.$route.params.selectedCameraId;
    },
  },
  watch: {
    retrievalLoadingStatus: function(state) {
      if (state === 'loaded') this.loadCameraChart();
    },
  },
  methods: {
    loadCameraChart() {
      const BarChartData = {
        data: this.getCameraRetrievalData({
          year: this.year,
          id: this.selectedCameraId,
        }).map(
          (
            { dataCount, failures, isCameraRemove, isDataComplete, lastUpdate },
            index,
          ) => ({
            name: index + 1 + '月',
            y: dataCount,
            errorNumber: failures,
            lastUploaded: lastUpdate,
            color: isDataComplete
              ? '#BFE08E'
              : isCameraRemove
              ? '#8C9CAB'
              : '#FEC9D4', // TODO: share config with ChartLegend
          }),
        ),
      };
      const barCharts = this.$refs.barCharts;
      barCharts.removeSeries();
      barCharts.addSeries(BarChartData);
    },
  },
};
</script>
<style lang="scss">
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
  span.showError {
    display: inline-block;
    padding: 5px;
    margin-left: 5px;
    color: #fff;
    background-color: #db5158;
    border-radius: 3px;
    font-size: 10px;
  }
}
</style>
