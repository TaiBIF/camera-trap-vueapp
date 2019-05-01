<template>
  <div class="legend-container">
    <div v-for="(legend, index) in selectedLegends" :key="index">
      <span :style="`background: ${legend.color}`"></span>
      {{ legend.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'chart-legend',
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      legendGroup: {
        receive: [
          { name: '當月資料完整', color: '#BFE08E' },
          { name: '當月資料不完整 (相機故障、失竊等因素)', color: '#FEC9D4' },
          { name: '相機撤除', color: '#8C9CAB' },
        ],
        identify: [
          { name: '當月資料已辨識', color: '#AACAEE' },
          { name: '當月資料已辨識，但資料未完整', color: '#8C9CAB' },
        ],
      },
    };
  },
  computed: {
    selectedLegends: function() {
      return this.legendGroup[this.type] || [];
    },
  },
};
</script>
<style lang="scss" scoped>
.legend-container {
  font-size: 8px;
  color: #8b8b8b;
  float: left;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  & > div {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-right: 10px;
  }

  span {
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 3px;
    margin-right: 2px;
  }
}
</style>
