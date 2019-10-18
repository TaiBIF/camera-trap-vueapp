<template>
  <div class="tab-content pt-4 active">
    <div class="row control-bar">
      <div class="col-4">
        <div class="form-group row mb-0">
          <label class="col-5 text-right">
            樣區：
          </label>
          <div class="col-7">
            <select
              class="form-control"
              @change="changeRoute"
              :value="selectedParentAreaId"
            >
              <option
                v-for="area in parentAreaOptions"
                :key="area.key"
                :value="area.key"
              >
                {{ area.value }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-4" v-if="childAreaOptions && childAreaOptions.length > 0">
        <div class="form-group row mb-0">
          <label class="col-5 text-right">
            子樣區：
          </label>
          <div class="col-7">
            <select
              class="form-control"
              @change="changeRoute"
              :value="selectedChildAreaId"
            >
              <option
                v-for="area in childAreaOptions"
                :key="area.key"
                :value="area.key"
              >
                {{ area.value }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-4" v-if="tripOptions && tripOptions.length > 0">
        <div class="form-group row mb-0">
          <label class="col-5 text-right">
            行程：
          </label>
          <div class="col-7">
            <select class="form-control" v-model="selectedTripId">
              <option
                v-for="area in tripOptions"
                :key="area.key"
                :value="area.key"
              >
                {{ area.value }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="row" style="padding-top: 20px">
      <div class="col-6 text-center">
        <h5 class="mt-0">
          {{
            selectedTripId === 'all' ? '本計畫' : selectedTrip.sn
          }}已辨識物種比例
        </h5>
        <small class="sub-heading text-gray"
          >(依據{{ selectedTripId === 'all' ? '本計畫' : '本行程'
          }}{{
            selectedCamera ? selectedCamera.name : selectedStudyArea.value
          }}回收的照片張數計算)
        </small>
        <v-charts :options="pieOption" ref="pieCharts" />
      </div>
      <div class="col-6">
        <h3>
          {{
            selectedCamera ? selectedCamera.name : selectedStudyArea.value
          }}已辨識物種 <big>{{ identifiedSpecies.length }}</big> 種
        </h3>
        <small class="sub-heading text-gray">
          <span v-show="selectedTripId === 'all'">
            最後更新時間：{{ identifiedSpeciesLastUpdate }}
          </span>
          <span v-show="selectedTripId !== 'all'">
            行程日期： {{ dateFormatYYYYMMDD(selectedTrip.date) }} <br />
            拍攝區間： {{ dateFormatYYYYMMDD(selectedTrip.date) }}
          </span>
        </small>
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
            <th>中文名稱</th>
            <th>Namecode</th>
            <th>名錄連結</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="speices-item"
            v-for="(data, id) in namecodeSpecies"
            :key="`namecode-speices-item-${id}`"
          >
            <td>{{ data.species }}</td>
            <td>{{ data.taicolData.title }}</td>
            <td>
              <div
                v-for="(taicol, id) in data.taicolData.namecodeList"
                :key="`name-code-list-${id}`"
              >
                {{ taicol.namecode }}
              </div>
            </td>
            <td>
              <div
                v-for="(taicol, id) in data.taicolData.namecodeList"
                :key="`name-code-list-${id}`"
              >
                <a :href="taicol.url" target="_blank">連結</a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { dateFormatYYYYMMDD } from '@/utils/dateHelper';
import VueHighcharts from 'vue2-highcharts';
import chartColors from '@/constant/chartColors';
import speciesNamecodeMapping from '@/constant/speciesNamecodeMapping.js';

const studyAreas = createNamespacedHelpers('studyAreas');
const projects = createNamespacedHelpers('projects');
const trip = createNamespacedHelpers('trip');

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
      selectedParentAreaId: '',
      selectedChildAreaId: '',
      selectedTripId: 'all',
      activeCameraId: '',
    };
  },
  computed: {
    ...studyAreas.mapGetters(['studyAreas', 'cameraLocations']),
    ...projects.mapGetters([
      'identifiedSpecies',
      'identifiedSpeciesLastUpdate',
    ]),
    ...trip.mapState(['trips']),
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
          const namecodeList = mapped[1].map(data => {
            return {
              namecode: data,
              url: `http://taibnet.sinica.edu.tw/chi/taibnet_species_detail.php?name_code=${data}&tree=y`,
            };
          });
          const taicolData = {
            title: mapped[0],
            namecodeList: namecodeList,
          };

          r.push({
            species: x.species,
            taicolData: taicolData,
          });
        }
      });
      return r;
    },
    selectedStudyAreaId: function() {
      return this.$route.params.selectedStudyAreaId || 'all';
    },
    selectedCameraId: function() {
      return this.$route.params.selectedCameraId;
    },
    allAreas: function() {
      return this.studyAreas.reduce(
        (arr, { id, title, children }) => {
          const parentId = id;
          let childrenAreas = [];

          if (children && children.length > 0) {
            childrenAreas = children.map(({ id, title }) => ({
              key: id,
              value: title,
              parentId,
              path: id,
            }));
          }
          const parentArea = {
            key: id,
            value: title,
            parentId: null,
            path: id, // if area have children, use first child id as path
          };
          return [...arr, parentArea, ...childrenAreas];
        },
        [
          {
            key: 'all',
            value: '全部樣區',
            parentId: null,
            path: 'all',
          },
        ],
      );
    },
    parentAreaOptions: function() {
      return this.allAreas.filter(({ parentId }) => !parentId);
    },
    childAreaOptions: function() {
      const childArea = this.allAreas.filter(
        ({ parentId }) => parentId === this.selectedParentAreaId,
      );

      return [
        {
          key: 'all',
          value: '全部子樣區',
          parentId: null,
          path: this.selectedParentAreaId,
        },
        ...childArea,
      ];
    },
    tripOptions: function() {
      return this.trips.reduce(
        (pre, trip) => {
          return [...pre, { key: trip.id, value: trip.sn }];
        },
        [
          {
            key: 'all',
            value: '全部行程',
          },
        ],
      );
    },
    selectedStudyArea: function() {
      return (
        this.allAreas.find(({ key }) => key === this.selectedStudyAreaId) || {}
      );
    },
    selectedCamera: function() {
      if (!this.selectedCameraId) {
        return null;
      }
      return this.cameraLocations.filter(
        ({ id }) => id === this.selectedCameraId,
        {},
      )[0];
    },
    selectedTrip: function() {
      if (!this.selectedTripId) {
        return null;
      }
      return this.trips.filter(({ id }) => id === this.selectedTripId)[0] || {};
    },
  },
  mounted() {
    this.loadIdentifiedSpecies(this.projectId);
    this.updateSelectArea();
    this.getProjectTrips(this.projectId);
  },
  watch: {
    identifiedSpecies: 'loadPieChart',
    allAreas: 'updateSelectArea',
    selectedStudyAreaId: 'updateSelectArea',
  },
  methods: {
    ...trip.mapActions(['getProjectTrips']),
    dateFormatYYYYMMDD(dateString) {
      return dateFormatYYYYMMDD(dateString);
    },
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
    updateSelectArea() {
      const selectedArea = this.allAreas.find(
        ({ key }) => key === this.selectedStudyAreaId,
      );
      if (selectedArea) {
        // move to next tick to wait options ready
        setTimeout(() => {
          this.selectedParentAreaId = selectedArea.parentId || selectedArea.key;
          this.selectedChildAreaId = selectedArea.parentId
            ? selectedArea.key
            : 'all';
        }, 0);
      } else {
        this.selectedParentAreaId = 'all';
        this.selectedChildAreaId = 'all';
      }
    },
    changeRoute(event) {
      const studyArea = this.allAreas.find(
        ({ key }) => key === event.target.value,
      );
      if (studyArea) {
        this.$router.push({
          name: 'projectSpecies',
          params: {
            projectId: this.projectId,
            selectedStudyAreaId: studyArea.path,
          },
        });
      }
    },
  },
};
</script>
