<template>
  <div class="page-upload">
    <div class="container">
      <ul class="breadcrumbs">
        <li><router-link to="/project/overview">計畫總覽 </router-link></li>
        <li>
          <router-link :to="`/project/${projectDetail.id}`">
            {{ projectDetail.title }}
          </router-link>
        </li>
        <li><a>檔案上傳</a></li>
      </ul>
    </div>

    <div class="text-right" v-show="fileList.length === 0">
      <a @click="modalOpen('trialModalOpen')" class="link text-green">
        檢閱詳細上傳說明
      </a>
    </div>

    <upload-files v-show="fileList.length === 0" @change="fileList = $event" />

    <!-- 上傳說明 -->
    <trail-modal :open="trialModalOpen" @close="trialModalOpen = false" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import TrailModal from '@/components/ProjectUpload/TrialModal.vue';
import UploadFiles from '@/components/ProjectUpload/UploadFiles.vue';

const projects = createNamespacedHelpers('projects');

export default {
  components: {
    TrailModal,
    UploadFiles,
  },
  data() {
    return {
      trialModalOpen: false,
      fileList: [],
    };
  },
  watch: {
    fileList: function(val) {
      console.log(val.length);
      console.log(val);
    },
  },
  computed: {
    ...projects.mapGetters(['projectDetail']),
  },
};
</script>
