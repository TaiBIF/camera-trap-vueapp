<template>
  <div class="maintain">
    <ul>
      <li>
        <router-link
          :to="{
            name: 'projectBasic',
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
            name: 'projectStudyAreasView',
            params: {
              projectId,
              studyAreaId: '5cacb8d89c37591f7dcb7d', // TODO: adapt API
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
    <br />
    <p>當前計畫詳細資訊</p>
    <p>計畫名稱: {{ projectDetail.title }}</p>
    <p>計畫主持人: {{ projectDetail.principalInvestigator }}</p>
    <p>計畫摘要: {{ projectDetail.description }}</p>
    <p>資料欄位: {{ projectDetail.description }}</p>
    <ul>
      <li :key="field.id" v-for="field in projectDetail.dataFields">
        {{ field.description }}
      </li>
    </ul>
    <br />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const projects = createNamespacedHelpers('projects');

export default {
  name: 'project-info',
  computed: {
    ...projects.mapGetters(['projectDetail']),
    projectId: function() {
      return this.$route.params.projectId;
    },
  },
};
</script>
