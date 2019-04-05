<template>
  <div id="app">
    <nav-header />
    <router-view />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import NavHeader from '@/components/NavHeader/NavHeader.vue';

const account = createNamespacedHelpers('account');

export default {
  components: {
    NavHeader,
  },
  methods: {
    ...account.mapActions(['loadProfile']),
  },
  created() {
    this.loadProfile();
  },
};
</script>

<style lang="scss">
#app {
  padding-top: 64px;
}
</style>
