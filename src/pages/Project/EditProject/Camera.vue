<template>
  <div>
    <div class="panel">
      <div class="panel-heading">
        <div v-show="!showAddProjectCameras && !showEditProjectCameras">
          <h4>
            相機管理
          </h4>
          <button
            class="float-right btn btn-light-green"
            @click="openAddProjectCameras"
          >
            新增相機
          </button>
        </div>
        <div v-show="showAddProjectCameras">
          <h4>
            本單位相機
          </h4>
          <button
            class="float-right btn btn-light-green"
            @click="addProjectsCameraRequest"
          >
            新增
          </button>
          <button
            class="float-right btn btn-white-border"
            @click="closeAddProjectCameras"
          >
            取消
          </button>
        </div>
        <div v-show="showEditProjectCameras">
          <h4>
            編輯相機
          </h4>
          <button
            class="float-right btn btn-light-green"
            @click="editProjectsCameraRequest"
          >
            完成
          </button>
          <button
            class="float-right btn btn-white-border"
            @click="closeEditProjectCameras"
          >
            取消
          </button>
        </div>
      </div>
      <div class="project-camera-context">
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
          <div class="project-camera-add" v-else-if="showAddProjectCameras">
            <add-project-camera
              :cameraListData="camerasByFilter"
              :addProjectCameraList="addProjectCameraList"
              :setAddProjectCameraList="setAddProjectCameraList"
              :getCamerasByFilter="getCamerasByFilter"
              :getCameraType="getCameraType"
            />
          </div>
          <div class="project-camera-list" v-else-if="!showEditProjectCameras">
            <project-camera-list
              :projectCameraListData="projectCameras"
              @deleteProjectCamera="deleteProjectCameraRequest"
            />
            <div class="project-camera-list-footer mt-5 p-3">
              <button
                type="submit"
                class="btn btn-orange"
                @click="openEditProjectCameras"
              >
                編輯相機
              </button>
            </div>
          </div>
          <div class="project-camera-edit" v-else-if="showEditProjectCameras">
            <edit-project-camera
              :projectCameraListData="editProjectCameraList"
              :setEditProjectCameraList="setEditProjectCameraList"
            />
          </div>
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

import AddProjectCamera from '@/components/CameraManagement/AddProjectCamera.vue';
import EditProjectCamera from '@/components/CameraManagement/EditProjectCamera.vue';
import ProjectCameraList from '@/components/CameraManagement/ProjectCameraList.vue';

const camera = createNamespacedHelpers('camera');
const projectCamera = createNamespacedHelpers('projectCamera');

export default {
  components: {
    AddProjectCamera,
    ProjectCameraList,
    EditProjectCamera,
  },

  computed: {
    ...camera.mapState(['cameras', 'camerasByFilter']),
    ...projectCamera.mapState([
      'projectCameras',
      'addProjectCameraList',
      'editProjectCameraList',
    ]),
    projectId: function() {
      return this.$route.params.projectId;
    },
  },
  data: function() {
    return {
      showAddProjectCameras: false,
      showEditProjectCameras: false,
    };
  },
  methods: {
    ...camera.mapActions([
      'getCameras',
      'setCamerasByFilter',
      'getCamerasByFilter',
      'getCameraType',
    ]),
    ...projectCamera.mapActions([
      'getProjectCameras',
      'setAddProjectCameraList',
      'addProjectCameras',
      'setEditProjectCameraList',
      'editProjectCameras',
      'deleteProjectCamera',
    ]),
    // get project camera
    async getProjectCameraRequest() {
      await this.getProjectCameras({
        projectId: this.projectId,
      });
    },
    // add project camera
    openAddProjectCameras() {
      this.setCamerasByFilter(this.cameras);
      this.setAddProjectCameraList([]);
      this.showAddProjectCameras = true;
    },
    closeAddProjectCameras() {
      this.showAddProjectCameras = false;
    },
    addProjectsCameraRequest() {
      this.addProjectCameras({
        projectId: this.projectId,
        payload: this.addProjectCameraList,
      });
      this.closeAddProjectCameras();
    },
    // edit project camera
    openEditProjectCameras() {
      this.setEditProjectCameraList(this.projectCameras);
      this.showEditProjectCameras = true;
    },
    closeEditProjectCameras() {
      this.showEditProjectCameras = false;
    },
    editProjectsCameraRequest() {
      this.editProjectCameras(this.editProjectCameraList);
      this.closeEditProjectCameras();
    },
    // delete project camera
    deleteProjectCameraRequest(id) {
      this.deleteProjectCamera({
        projectId: this.projectId,
        cameraId: id,
      });
    },
  },
  mounted() {
    this.getCameras();
    this.getProjectCameraRequest();
  },
};
</script>

<style lang="scss" scoped>
.project-camera-context {
  height: 455px;
  overflow: auto;
}
.project-camera-list-footer {
  float: right;
}
</style>
