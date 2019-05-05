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

    <!-- 上傳說明 -->
    <trail-modal :open="trialModalOpen" @close="trialModalOpen = false" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import TrailModal from '@/components/ProjectUpload/TrialModal.vue';

const projects = createNamespacedHelpers('projects');

export default {
  components: {
    TrailModal,
  },
  data() {
    return {
      trialModalOpen: true,
    };
  },
  computed: {
    ...projects.mapGetters(['projectDetail']),
  },
};
</script>
