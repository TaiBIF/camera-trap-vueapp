<template>
  <div class="container">
    <hr />
    <h4>偵測到/未偵測到</h4>
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
      <table class="table table-striped" v-if="rangeType === 'day'">
        <thead>
          <tr>
            <td>相機位置</td>
            <td>日期</td>
            <td>detection</td>
          </tr>
        </thead>
        <tr
          v-for="(row, index) in data.filter(d => d.species === currentSpecies)"
          :key="index"
        >
          <td>{{ row.title }}</td>
          <td>{{ row.date }}</td>
          <td>{{ row.detection }}</td>
        </tr>
      </table>

      <table class="table table-striped" v-else-if="rangeType === 'hour'">
        <thead>
          <tr>
            <td>相機位置</td>
            <td>日期</td>
            <td>00</td>
            <td>01</td>
            <td>02</td>
            <td>03</td>
            <td>04</td>
            <td>05</td>
            <td>06</td>
            <td>07</td>
            <td>08</td>
            <td>09</td>
            <td>10</td>
            <td>11</td>
            <td>12</td>
            <td>13</td>
            <td>14</td>
            <td>15</td>
            <td>16</td>
            <td>17</td>
            <td>18</td>
            <td>19</td>
            <td>20</td>
            <td>21</td>
            <td>22</td>
            <td>23</td>
            <td>detection</td>
          </tr>
        </thead>
        <tr
          v-for="(row, index) in data.filter(d => d.species === currentSpecies)"
          :key="index"
        >
          <td>{{ row.title }}</td>
          <td>{{ row.date }}</td>
          <td v-for="(h, hIndex) in row.hours" :key="hIndex">
            {{ h }}
          </td>
          <td>{{ row.detection }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
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
