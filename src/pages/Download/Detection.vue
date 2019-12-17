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
      <table class="table table-striped">
        <thead>
          <tr>
            <td>相機位置</td>
            <td>日期</td>
            <td v-if="rangeType === 'hour'">00</td>
            <td v-if="rangeType === 'hour'">01</td>
            <td v-if="rangeType === 'hour'">02</td>
            <td v-if="rangeType === 'hour'">03</td>
            <td v-if="rangeType === 'hour'">04</td>
            <td v-if="rangeType === 'hour'">05</td>
            <td v-if="rangeType === 'hour'">06</td>
            <td v-if="rangeType === 'hour'">07</td>
            <td v-if="rangeType === 'hour'">08</td>
            <td v-if="rangeType === 'hour'">09</td>
            <td v-if="rangeType === 'hour'">10</td>
            <td v-if="rangeType === 'hour'">11</td>
            <td v-if="rangeType === 'hour'">12</td>
            <td v-if="rangeType === 'hour'">13</td>
            <td v-if="rangeType === 'hour'">14</td>
            <td v-if="rangeType === 'hour'">15</td>
            <td v-if="rangeType === 'hour'">16</td>
            <td v-if="rangeType === 'hour'">17</td>
            <td v-if="rangeType === 'hour'">18</td>
            <td v-if="rangeType === 'hour'">19</td>
            <td v-if="rangeType === 'hour'">20</td>
            <td v-if="rangeType === 'hour'">21</td>
            <td v-if="rangeType === 'hour'">22</td>
            <td v-if="rangeType === 'hour'">23</td>
            <td>detection</td>
          </tr>
        </thead>
        <tr
          v-for="(row, index) in data.filter(d => d.species === currentSpecies)"
          :key="index"
        >
          <td>{{ row.title }}</td>
          <td>{{ row.date }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[0] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[1] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[2] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[3] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[4] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[5] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[6] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[7] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[8] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[9] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[10] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[11] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[12] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[13] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[14] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[15] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[16] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[17] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[18] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[19] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[20] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[21] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[22] }}</td>
          <td v-if="rangeType === 'hour'">{{ row.hours[23] }}</td>
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
