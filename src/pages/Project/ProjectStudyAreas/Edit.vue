<template>
  <div>
    <h1>計畫樣區 - 編輯</h1>
    <p>projectId: {{ projectId }}</p>
    <p>studyAreaId: {{ studyAreaId }}</p>
  </div>
</template>

<script>
export default {
  computed: {
    projectId: function() {
      return this.$route.params.projectId;
    },
    studyAreaId: function() {
      return this.$route.params.studyAreaId;
    },
  },
};
</script>
