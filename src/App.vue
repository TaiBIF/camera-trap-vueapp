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
  beforeMount() {
    if (this.$validator.dictionary.hasLocale('zh_TW')) {
      this.$validator.localize('zh_TW');
    } else {
      import('vee-validate/dist/locale/zh_TW').then(locale => {
        this.$validator.localize('zh_TW', locale);
      });
    }
  },
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
