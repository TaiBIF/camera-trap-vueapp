<template>
  <div class="container">
    <hr />
    <h4>目擊事件</h4>
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
