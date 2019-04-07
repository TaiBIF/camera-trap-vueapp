<template>
  <div>
    <h1>計畫管理-基本資訊</h1>
    <BasicInfo :project="temp" :areas="projectAreas" @change="change" />
    <button @click="submitProject">儲存設定</button>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import BasicInfo from '@/components/ProjectEdit/BasicInfo.vue';

const config = createNamespacedHelpers('config');
const projects = createNamespacedHelpers('projects');

export default {
  data: function() {
    return {
      temp: undefined,
    };
  },
  mounted() {
    this.temp = this.projectDetail;
  },
  watch: {
    projectDetail: function(val) {
      this.temp = val;
    },
  },
  components: {
    BasicInfo,
  },
  computed: {
    ...config.mapGetters(['projectAreas']),
    ...projects.mapGetters(['projectDetail']),
    projectId: function() {
      return this.$route.params.projectId;
    },
  },
  methods: {
    ...projects.mapActions(['putProject']),
    change(v) {
      this.temp = v;
    },
    submitProject() {
      this.putProject({ id: this.projectId, body: this.temp });
    },
  },
};
</script>
