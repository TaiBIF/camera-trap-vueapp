<template>
  <div class="container">
    <hr />
    <h4>捕獲回合比例</h4>
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
      <br />
      <table class="table table-striped">
        <thead>
          <tr>
            <td v-if="rangeType === 'month'">年</td>
            <td v-if="rangeType === 'month'">月</td>
            <td>拍到台天</td>
            <td>總台天</td>
            <td>捕獲回合比例</td>
          </tr>
        </thead>
        <tr
          v-for="(row, index) in data.filter(d => d.species === currentSpecies)"
          :key="index"
        >
          <td v-if="rangeType === 'month'">{{ row.year }}</td>
          <td v-if="rangeType === 'month'">{{ row.month }}</td>
          <td>{{ row.captureCount }}</td>
          <td>{{ row.totalDay }}</td>
          <td>{{ row.captureRate }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
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
        console.log(value);
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
