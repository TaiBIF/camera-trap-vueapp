<template>
  <div>
    <CcInfo
      :project="temp"
      :areas="projectAreas"
      :status="status"
      :error="error"
      @change="change"
      @done="submitProject"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import CcInfo from '@/components/ProjectEdit/CcInfo.vue';

const config = createNamespacedHelpers('config');
const projects = createNamespacedHelpers('projects');

export default {
  data: function() {
    return {
      temp: {},
      status: undefined,
      error: undefined,
    };
  },
  props: {
    setLoading: Function,
  },
  mounted() {
    this.temp = Object.assign({}, this.projectDetail);
  },
  watch: {
    projectDetail: function(val) {
      this.temp = Object.assign({}, val);
    },
  },
  components: {
    CcInfo,
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
    async submitProject() {
      this.setLoading(true);
      this.status = 200;
      this.error = undefined;
      await this.putProject({ id: this.projectId, body: this.temp }).catch(
        e => {
          this.error = e;
        },
      );
      this.setLoading(false);
    },
  },
};
</script>
