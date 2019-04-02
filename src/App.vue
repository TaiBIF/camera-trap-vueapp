<template>
  <div id="app">
    <nav-header :is-login="true" />
    <router-view />
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader/NavHeader.vue';

export default {
  components: {
    NavHeader,
  },
};
</script>

<style lang="scss">
#app {
  padding-top: 64px;
}
</style>
