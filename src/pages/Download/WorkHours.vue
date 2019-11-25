<template>
  <div class="container">
    <hr />
    <h4>相機有效工作時數</h4>
    <div class="panel">
      <table class="table table-striped">
        <thead>
          <tr>
            <td>相機位置</td>
            <td v-if="rangeType === 'month'">年</td>
            <td v-if="rangeType === 'month'">月</td>
            <td>Work hours (hr)</td>
          </tr>
        </thead>
        <tr v-for="(row, index) in data" :key="index">
          <td>{{ row.title }}</td>
          <td v-if="rangeType === 'month'">{{ row.year }}</td>
          <td v-if="rangeType === 'month'">{{ row.month }}</td>
          <td>{{ row.workHours }}</td>
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
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>
