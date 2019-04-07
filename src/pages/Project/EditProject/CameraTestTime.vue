<template>
  <div :style="{ border: '3px pink dashed' }">
    <h1>相機異常檢測</h1>
    <input v-model="dailyTestTime" />
    <button @click="submitTime">儲存</button>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import idx from 'idx';

const projects = createNamespacedHelpers('projects');

export default {
  data: function() {
    return {
      dailyTestTime: '',
    };
  },
  mounted() {
    this.dailyTestTime = idx(this.projectDetail, _ => _.dailyTestTime);
  },
  watch: {
    projectDetail: function(val) {
      this.dailyTestTime = idx(val, _ => _.dailyTestTime);
    },
  },
  computed: {
    ...projects.mapGetters(['projectDetail']),
    projectId: function() {
      return this.$route.params.projectId;
    },
  },
  methods: {
    ...projects.mapActions(['putProjectDailyTestTime']),
    submitTime() {
      this.putProjectDailyTestTime({
        id: this.projectId,
        dailyTestTime: this.dailyTestTime,
      });
    },
  },
};
</script>
