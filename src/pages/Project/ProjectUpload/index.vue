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

    <div class="text-right">
      <a @click="modalOpen('trialModalOpen')" class="link text-green"
        >檢閱詳細上傳說明</a
      >
    </div>

    <!-- 拖拉上傳 -->
    <div class="col-10 offset-1 upload-container">
      <vue-dropzone
        ref="myVueDropzone"
        id="dropzone"
        :options="dropzoneOptions"
        :useCustomSlot="true"
      >
        <img
          src="/assets/upinfo/upload-img.png"
          height="180"
          srcset="/assets/upinfo/upload-img@2x.png"
        />
        <h1>將檔案拖曳於此並上傳</h1>
        <p>或 <label class="text-green underline">點此瀏覽檔案</label></p>
      </vue-dropzone>

      <div class="text-center mt-2">
        <small class="text-center">
          單一檔案上傳大小制於 <b>2G</b> 以內，一次上傳中，檔案大小總合須小於
          <b>5G</b>
          <br />您可以上傳的檔案形式：內含資料檔（.csv）及其對應影像之壓縮檔
          (.zip)、影像資料壓縮檔 (.zip)、單一影像檔 及 單一資料檔（.csv）
        </small>
      </div>
    </div>

    <!-- 上傳說明 -->
    <trail-modal :open="trialModalOpen" @close="trialModalOpen = false" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import VueDropzone from 'vue2-dropzone';

import TrailModal from '@/components/ProjectUpload/TrialModal.vue';

const projects = createNamespacedHelpers('projects');

export default {
  components: {
    TrailModal,
    VueDropzone,
  },
  data() {
    return {
      trialModalOpen: false,
      dropzoneOptions: {
        url: 'localhost',
        autoProcessQueue: false,
        previewsContainer: false,
      },
    };
  },
  computed: {
    ...projects.mapGetters(['projectDetail']),
  },
};
</script>
