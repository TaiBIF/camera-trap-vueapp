<template>
  <div>
    <h1>計畫樣區 - 編輯</h1>
    <p>projectId: {{ projectId }}</p>
    <p>siteId: {{ siteId }}</p>
    <p>subsiteId: {{ subsiteId }}</p>
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
