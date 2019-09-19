<template>
  <div>
    <div class="panel">
      <div class="panel-heading">
        <h4>相機管理</h4>
      </div>
      <div>
        <div class="p-0">
          <div class="empty-result" v-if="false">
            <img
              src="/assets/common/empty-site.png"
              width="174"
              srcset="/assets/common/empty-site@2x.png"
            />
            <h5 class="text-gray">
              目前您的單位沒有相機資料！<br />
              請先建立資料庫
            </h5>
            <div class="mt-5">
              <small class="text-gray">
                STEP 1. 將相機資料整理為excel表格
                <a href="#">下載示範表格</a>
                STEP 2. 將相機資料傳至CameraTrap@gmail.com
                <a href="#">傳送檔案</a>
              </small>
            </div>
          </div>
          <div class="empty-result" v-else-if="false">
            <img
              src="/assets/common/empty-site.png"
              width="174"
              srcset="/assets/common/empty-site@2x.png"
            />
            <h3 class="text-gray mt-3">您目前沒有任何相機</h3>
            <button type="submit" class="btn btn-orange" @click="handleSubmit">
              新增相機
            </button>
          </div>
          <div class="camera-list" v-else-if="true">
            <project-camera-list :projectCameraListData="projectCameras" />
          </div>
          <div class="sheet-view show" v-else></div>
        </div>
      </div>
    </div>
    <div class="step" v-show="true">
      <small class="text-gray">
        <b>找不到您要的相機資料？<br /></b>
        STEP 1. 將相機資料整理為excel表格
        <a href="#">下載示範表格</a>
        STEP 2. 將相機資料傳至CameraTrap@gmail.com
        <a href="#">傳送檔案</a>
      </small>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import ProjectCameraList from '@/components/CameraManagement/ProjectCameraList.vue';

const projectCamera = createNamespacedHelpers('projectCamera');

export default {
  components: {
    ProjectCameraList,
  },

  computed: {
    ...projectCamera.mapState(['projectCameras']),
    projectId: function() {
      return this.$route.params.projectId;
    },
  },
  methods: {
    ...projectCamera.mapActions(['getProjectCameras']),
    async getProjectCameraRequest() {
      await this.getProjectCameras({
        projectId: this.projectId,
      });
    },
  },
  mounted() {
    this.getProjectCameraRequest();
  },
};
</script>
