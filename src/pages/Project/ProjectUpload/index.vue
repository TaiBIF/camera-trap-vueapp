<template>
  <div class="page-upload">
    <div class="container">
      <ul class="breadcrumbs">
        <li>
          <router-link to="/project/overview">計畫總覽 </router-link>
        </li>
        <li>
          <router-link :to="`/project/${projectDetail.id}`">
            {{ projectDetail.title }}
          </router-link>
        </li>
        <li><a>檔案上傳</a></li>
      </ul>

      <div class="text-right" v-show="fileList.length === 0">
        <a @click="trialModalOpen = true" class="link text-green">
          檢閱詳細上傳說明
        </a>
      </div>

      <upload-files
        v-if="fileList.length === 0"
        @change="fileList = $event"
        :disabled="disableUpload"
      />
      <edit-files
        v-else-if="isUploading === false"
        :fileList="fileList"
        @change="fileList = $event"
        @doUpload="isUploading = true"
      />
      <upload-process
        v-else-if="isUploading === true"
        :fileList="fileList"
        @change="fileList = $event"
      />
    </div>
    <!-- 上傳說明 -->
    <trail-modal :open="trialModalOpen" @close="trialModalOpen = false" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import TrailModal from '@/components/ProjectUpload/TrialModal.vue';
import UploadFiles from '@/components/ProjectUpload/UploadFiles.vue';

import EditFiles from './EditFiles.vue';
import UploadProcess from './UploadProcess.vue';

const projects = createNamespacedHelpers('projects');
const studyAreas = createNamespacedHelpers('studyAreas');

export default {
  components: {
    TrailModal,
    UploadFiles,
    EditFiles,
    UploadProcess,
  },
  mounted() {
    this.getProjectStudyAreas(this.projectId);
  },
  data() {
    return {
      trialModalOpen: false,
      fileList: [],
      isUploading: false,
    };
  },
  computed: {
    ...projects.mapGetters(['projectDetail']),
    ...studyAreas.mapGetters(['studyAreas', 'studyAreaTitle']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    disableUpload() {
      return (
        this.studyAreas.length === 0 || // 沒有樣區
        this.studyAreas.every(
          v =>
            v.cameraLocation === undefined &&
            v.children.every(c => c.cameraLocation === undefined),
        ) // 自己本身沒有相機位置以及子樣區也沒有相機位置
      );
    },
  },
  methods: {
    ...studyAreas.mapActions(['getProjectStudyAreas']),
  },
};
</script>
