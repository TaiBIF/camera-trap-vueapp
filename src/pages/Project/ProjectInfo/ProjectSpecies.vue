<template>
  <div class="tab-content pt-4 active">
    <div class="row">
      <div class="col-6 text-center">
        <h5 class="mt-0">本計畫已辨識物種比例</h5>
        <small class="sub-heading text-gray"
          >(依據本計畫回收的照片張數計算)</small
        >
        <v-charts :options="pieOption" ref="pieCharts" />
      </div>
      <div class="col-6">
        <h3>
          本計畫已辨識物種 <big>{{ species.length }}</big> 種
        </h3>
        <small class="sub-heading text-gray" v-if="speciesGroup.modified"
          >最後更新時間：{{ dateFormatYYYYMMDD(speciesGroup.modified) }}</small
        >
        <hr />
        <div class="row">
          <div class="col-5">
            <div
              class="speices-item"
              v-for="(specie, id) in species.slice(0, DEFAULT_DISPLAY_CATEGORY)"
              :key="`speices-item-${id}`"
            >
              <span
                class="circle"
                :style="{ backgroundColor: chartColors[id] }"
              ></span>
              <span class="text"
                >{{ specie.name }} {{ getPercentage(specie.y) }}</span
              >
            </div>
          </div>
          <div v-if="species.length > DEFAULT_DISPLAY_CATEGORY" class="col-7">
            <div class="speices-item">
              <span
                class="circle"
                :style="{
                  backgroundColor: chartColors[DEFAULT_DISPLAY_CATEGORY],
                }"
              ></span>
              <span class="text">
                其他
                <div
                  class="text-gray"
                  v-for="(specie, id) in species.slice(
                    DEFAULT_DISPLAY_CATEGORY,
                    species.length,
                  )"
                  :key="`speices-item-${id}`"
                >
                  <div class="sub-item">
                    {{ specie.name }} {{ getPercentage(specie.y) }}
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dateFormatYYYYMMDD } from '@/utils/dateHelper';
import VueHighcharts from 'vue2-highcharts';

const chartColors = [
  '#5DB897',
  '#AACAEE',
  '#7E99E5',
  '#5569B5',
  '#CC76BA',
  '#FFC8EB',
  '#BDE9A5',
];
export default {
  name: 'project-species',
  components: {
    'v-charts': VueHighcharts,
  },
  data() {
    return {
      DEFAULT_DISPLAY_CATEGORY: 6, // species more than this integrate to 其他
      chartColors: chartColors,
      pieOption: {
        chart: {
          backgroundColor: 'transparent',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          height: 340,
        },
        colors: chartColors,
        title: {
          enable: false,
          text: '',
        },
        subtitle: {
          enable: false,
          text: '',
        },
        tooltip: {
          headerFormat: '',
          backgroundColor: 'rgba(70,70,70,.8)',
          pointFormatter() {
            return `<span style="color:#FFF">${this.name}：${
              this.y
            } 筆辨識紀錄 (${this.percentage.toFixed(1)}%)</span>`;
          },
          style: {
            color: '#FFF',
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false,
            },
          },
        },
        series: null,
      },
      // TODO: get from store
      speciesGroup: {
        modified: '2019-01-01T00:00:00.000Z',
      },
      // TODO: get from store
      species: [],
    };
  },
  computed: {
    totalSpeciesPhotos: function() {
      return this.species.reduce((sum, { y }) => sum + y, 0);
    },
  },
  mounted() {
    // TODO: load data through API
    setTimeout(() => {
      this.species = [
        { name: 'Specie A', y: 65 },
        { name: 'Specie B', y: 35 },
        { name: 'Specie C', y: 15 },
        { name: 'Specie D', y: 5 },
        { name: 'Specie E', y: 2 },
        { name: 'Specie F', y: 2 },
        { name: 'Specie G1', y: 1 },
        { name: 'Specie G2', y: 1 },
        { name: 'Specie G3', y: 1 },
        { name: 'Specie G4', y: 1 },
      ];
    }, 500);
  },
  watch: {
    species: 'loadPieChart',
  },
  methods: {
    dateFormatYYYYMMDD(dateString) {
      return dateFormatYYYYMMDD(dateString);
    },
    getPercentage(num) {
      return `${(100 * (num / this.totalSpeciesPhotos)).toFixed(1)} %`;
    },
    loadPieChart(species) {
      if (!species.length) {
        return;
      }

      const chartData = [];
      this.species.forEach((specie, i) => {
        if (i < this.DEFAULT_DISPLAY_CATEGORY) {
          chartData.push(specie);
        } else {
          if (!chartData[this.DEFAULT_DISPLAY_CATEGORY]) {
            chartData[this.DEFAULT_DISPLAY_CATEGORY] = {
              name: '其他',
              y: specie.y,
            };
          } else {
            chartData[this.DEFAULT_DISPLAY_CATEGORY].y += specie.y;
          }
        }
      });
      const pieCharts = this.$refs.pieCharts;
      const PieChartOpt = {
        type: 'pie',
        name: 'speices',
        size: '80%',
        innerSize: '50%',
        data: chartData,
      };
      pieCharts.addSeries(PieChartOpt);
    },
  },
};
</script>
