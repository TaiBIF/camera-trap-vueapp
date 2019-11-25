<template>
  <div class="container">
    <hr />
    <h4>OI3</h4>
    <div class="tab">
      <ul class="nav-tab" v-for="(s, index) in species" :key="index">
        <li class="tab-item" :class="{ active: currentSpecies === s._id }">
          <a role="button" v-on:click="changeSpecies(s._id)">{{
            s.title['zh-TW']
          }}</a>
        </li>
      </ul>
    </div>
    <div class="tab-content">
      <div style="text-align: center">
        <v-chart :options="lineChartOptions" />
      </div>
      <br />
      <table class="table table-striped">
        <thead>
          <tr>
            <td>相機位置</td>
            <td v-if="rangeType === 'month'">年</td>
            <td v-if="rangeType === 'month'">月</td>
            <td>OI3</td>
          </tr>
        </thead>
        <tr
          v-for="(row, index) in data.filter(d => d.species === currentSpecies)"
          :key="index"
        >
          <td>{{ row.title }}</td>
          <td v-if="rangeType === 'month'">{{ row.year }}</td>
          <td v-if="rangeType === 'month'">{{ row.month }}</td>
          <td>{{ row.count === null ? '-' : row.count }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';

export default {
  components: {
    'v-chart': ECharts,
  },
  props: {
    rangeType: {
      type: String,
      required: true,
    },
    species: {
      type: Array,
      default: () => {
        return [];
      },
    },
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data: () => {
    return {
      currentSpecies: '',
      lineChartOptions: {},
    };
  },
  watch: {
    species: {
      handler: function(value) {
        if (!value.length) {
          return;
        }
        this.currentSpecies = value[0]._id;
      },
      deep: true,
      immediate: true,
    },
    data: {
      deep: true,
      immediate: true,
      handler: function(value) {
        const uniqueMonth = [
          ...new Set(value.map(d => `${d.year}-${d.month}`)),
        ];
        const uniqueCameraLocations = [...new Set(value.map(d => d.title))];
        const chartData = uniqueCameraLocations.map(cname => {
          const data = [];
          value
            .filter(v => v.title == cname)
            .forEach(v => {
              data.push(v.count || 0);
            });
          return {
            name: cname,
            type: 'line',
            data,
          };
        });
        this.lineChartOptions = {
          title: {
            text: 'OI各相機位置折線圖',
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            show: true,
            data: uniqueCameraLocations,
          },
          grid: {
            width: '100%',
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: uniqueMonth,
          },
          yAxis: {
            type: 'value',
          },
          series: chartData,
        };
      },
    },
  },
  methods: {
    changeSpecies(sid) {
      this.currentSpecies = sid;
    },
  },
};
</script>
<style lang="scss" scoped>
.tab {
  display: flex;
  .nav-tab {
    flex: 1;
  }
}
</style>
