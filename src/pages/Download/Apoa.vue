<template>
  <div class="container">
    <hr />
    <h4>存缺</h4>
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
      <table class="table table-striped">
        <thead>
          <tr>
            <td>hour</td>
            <td>Probability</td>
          </tr>
        </thead>
        <tr
          v-for="(row, index) in data.filter(d => d.species === currentSpecies)"
          :key="index"
        >
          <td>{{ row.hour }}</td>
          <td>{{ row.probability }}</td>
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
        this.rebuildChart(value);
      },
    },
  },
  methods: {
    changeSpecies(sid) {
      this.currentSpecies = sid;
      this.rebuildChart(this.data);
    },
    rebuildChart(value) {
      const hours = [];
      const apoa = [];
      value
        .filter(d => d.species === this.currentSpecies)
        .forEach(v => {
          apoa.push(v.probability || 0);
          hours.push(v.hour);
        });

      this.lineChartOptions = {
        xAxis: {
          data: hours,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            type: 'line',
            data: apoa,
          },
        ],
        title: {
          text: 'Monthly Stock Prices',
          x: 'center',
          textStyle: {
            fontSize: 24,
          },
        },
        color: ['#127ac2'],
      };
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
