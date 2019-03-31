<template>
  <div id="app">
    <header id="nav">
      <nav-header />
    </header>
    <router-view />
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader.vue';

export default {
  components: {
    NavHeader,
  },
};
</script>

<style lang="scss">
#nav {
  background-color: #c1ffc1;
}
</style>
