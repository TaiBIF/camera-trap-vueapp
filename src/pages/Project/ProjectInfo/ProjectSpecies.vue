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
          本計畫已辨識物種 <big>{{ identifiedSpecies.length }}</big> 種
        </h3>
        <small class="sub-heading text-gray"
          >最後更新時間：{{ identifiedSpeciesLastUpdate }}</small
        >
        <hr />
        <div class="row">
          <div class="col-5">
            <div
              class="speices-item"
              v-for="(specie, id) in identifiedSpecies.slice(
                0,
                DEFAULT_DISPLAY_CATEGORY,
              )"
              :key="`speices-item-${id}`"
            >
              <span
                class="circle"
                :style="{ backgroundColor: chartColors[id] }"
              ></span>
              <span class="text"
                >{{ specie.species }} {{ getPercentage(specie.count) }}</span
              >
            </div>
          </div>
          <div
            v-if="identifiedSpecies.length > DEFAULT_DISPLAY_CATEGORY"
            class="col-7"
          >
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
                  v-for="(specie, id) in identifiedSpecies.slice(
                    DEFAULT_DISPLAY_CATEGORY,
                    identifiedSpecies.length,
                  )"
                  :key="`speices-item-${id}`"
                >
                  <div class="sub-item">
                    {{ specie.species }} {{ getPercentage(specie.count) }}
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h4>TaiCol 臺灣物種名錄對照</h4>
    <hr />
    <div class="row">
      <table>
        <thead>
          <tr>
            <th>紀錄物種</th>
            <th>物種名錄中文名稱</th>
            <th>Namecode</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="speices-item"
            v-for="(item, id) in namecodeSpecies"
            :key="`namecode-speices-item-${id}`"
          >
            <td>{{ item[0] }}</td>
            <td>{{ item[1][0] }}</td>
            <td>{{ item[1][1].join(',') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import VueHighcharts from 'vue2-highcharts';
import chartColors from '@/constant/chartColors';
import speciesNamecodeMapping from '@/constant/speciesNamecodeMapping.js';

const projects = createNamespacedHelpers('projects');

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
    };
  },
  computed: {
    ...projects.mapGetters([
      'identifiedSpecies',
      'identifiedSpeciesLastUpdate',
    ]),
    projectId: function() {
      return this.$route.params.projectId;
    },
    totalSpeciesPhotos: function() {
      return this.identifiedSpecies.reduce((sum, { count }) => sum + count, 0);
    },
    namecodeSpecies: function() {
      let r = [];
      this.identifiedSpecies.forEach(x => {
        const mapped = speciesNamecodeMapping[x['_id']];
        if (mapped) {
          r.push([x.species, mapped]);
        }
      });
      return r;
    },
  },
  mounted() {
    this.loadIdentifiedSpecies(this.projectId);
  },
  watch: {
    identifiedSpecies: 'loadPieChart',
  },
  methods: {
    getPercentage(num) {
      return `${(100 * (num / this.totalSpeciesPhotos)).toFixed(1)} %`;
    },
    ...projects.mapActions(['loadIdentifiedSpecies']),
    loadPieChart(identifiedSpecies) {
      if (!identifiedSpecies.length) {
        return;
      }

      const chartData = [];
      this.identifiedSpecies.forEach((specie, i) => {
        if (i < this.DEFAULT_DISPLAY_CATEGORY) {
          chartData.push({
            name: specie.species,
            y: specie.count,
          });
        } else {
          if (!chartData[this.DEFAULT_DISPLAY_CATEGORY]) {
            chartData[this.DEFAULT_DISPLAY_CATEGORY] = {
              name: '其他',
              y: specie.count,
            };
          } else {
            chartData[this.DEFAULT_DISPLAY_CATEGORY].count += specie.count;
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
