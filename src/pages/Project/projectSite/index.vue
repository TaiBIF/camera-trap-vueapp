<template>
  <div>
    <h1>計畫樣區 - 檢視</h1>
    <p>projectId: {{ projectId }}</p>
    <p>siteId: {{ siteId }}</p>
    <p>subsiteId: {{ subsiteId }}</p>
    <router-link
      :to="{
        name: 'projectSiteEdit',
        params: {
          projectId,
          siteId,
          subsiteId,
        },
      }"
    >
      編輯樣區
    </router-link>
  </div>
</template>

<script>
export default {
  computed: {
    projectId: function() {
      return this.$route.params.projectId;
    },
    siteId: function() {
      return this.$route.params.siteId;
    },
    subsiteId: function() {
      return this.$route.params.subsiteId;
    },
  },
};
</script>
