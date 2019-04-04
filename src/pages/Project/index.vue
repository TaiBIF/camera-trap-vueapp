<template>
  <router-view />
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const config = createNamespacedHelpers('config');

export default {
  mounted() {
    this.getProjectAreas();
  },
  methods: {
    ...config.mapActions(['getProjectAreas']),
  },
};
</script>
