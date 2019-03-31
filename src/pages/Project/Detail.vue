<template>
  <div>
    <ul>
      <li>
        <router-link
          :to="{
            name: 'projectEdit',
            params: {
              projectId,
            },
          }"
          >編輯管理</router-link
        >
      </li>
      <li>
        <router-link
          :to="{
            name: 'projectSiteView',
            params: {
              projectId,
              siteId: 'site_1',
              subsiteId: 'subsite_1',
            },
          }"
          >樣區資訊</router-link
        >
      </li>
      <li>
        <router-link
          :to="{
            name: 'projectUpload',
            params: {
              projectId,
            },
          }"
          >檔案上傳</router-link
        >
      </li>
    </ul>
    <router-view />
  </div>
</template>

<script>
export default {
  mounted() {
    console.log(this.$route.matched);
  },
  computed: {
    projectId: function() {
      return this.$route.params.projectId;
    },
  },
};
</script>
