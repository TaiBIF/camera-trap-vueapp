<template>
  <div>
    <h1>計畫樣區 - 檢視</h1>
    <p>projectId: {{ projectId }}</p>
    <p>studyAreaId: {{ studyAreaId }}</p>
    <router-link
      :to="{
        name: 'projectStudyAreasEdit',
        params: {
          projectId,
          studyAreaId,
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
    studyAreaId: function() {
      return this.$route.params.studyAreaId;
    },
  },
};
</script>
