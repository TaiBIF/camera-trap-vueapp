<template>
  <div>
    <div class="panel">
      <div class="panel-heading">
        <div v-show="!showAddProjectCamera && !showEditProjectCamera">
          <h4>
            相機管理
          </h4>
          <button
            class="float-right btn btn-light-green"
            @click="openAddProjectCameras"
            v-show="showListProjectCamera"
          >
            新增相機
          </button>
        </div>
        <div v-show="showAddProjectCamera">
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
        <div v-show="showEditProjectCamera">
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
          <div class="empty-result" v-if="showEmptyCamera">
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
                <a
                  href="/static/example-camera-info.xlsx"
                  class="text-green text-underline mr-3"
                  target="_blank"
                  >下載示範表格</a
                >
                STEP 2. 將相機資料傳至<a
                  href="mailto:CameraTrap@gmail.com"
                  class="text-green text-underline"
                  >CameraTrap@gmail.com</a
                >
              </small>
            </div>
          </div>
          <div class="empty-result" v-else-if="showEmptyProjectCamera">
            <img
              src="/assets/common/empty-site.png"
              width="174"
              srcset="/assets/common/empty-site@2x.png"
            />
            <h3 class="text-gray mt-3">您目前沒有任何相機</h3>
            <button class="btn btn-orange" @click="openAddProjectCameras">
              新增相機
            </button>
          </div>
          <div class="project-camera-add" v-else-if="showAddProjectCamera">
            <add-project-camera
              :cameraListData="camerasByFilter"
              :addProjectCameraList="addProjectCameraList"
              :setAddProjectCameraList="setAddProjectCameraList"
              :getCamerasByFilter="getCamerasByFilter"
              :getCameraType="getCameraType"
            />
          </div>
          <div class="project-camera-list" v-else-if="showListProjectCamera">
            <list-project-camera
              :projectCameraListData="projectCameras"
              @deleteProjectCamera="deleteProjectCameraRequest"
            />
            <div class="project-camera-list-footer mt-5 p-3">
              <button class="btn btn-orange" @click="openEditProjectCameras">
                編輯相機
              </button>
            </div>
          </div>
          <div class="project-camera-edit" v-else-if="showEditProjectCamera">
            <edit-project-camera
              :projectCameraListData="editProjectCameraList"
              :setEditProjectCameraList="setEditProjectCameraList"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="step" v-show="!showEmptyCamera">
      <small class="text-gray">
        <b>找不到您要的相機資料？<br /></b>
        STEP 1. 將相機資料整理為excel表格
        <a
          href="/static/example-camera-info.xlsx"
          class="text-green text-underline mr-3"
          target="_blank"
          >下載示範表格</a
        >
        STEP 2. 將相機資料傳至<a
          href="mailto:CameraTrap@gmail.com"
          class="text-green text-underline"
          >CameraTrap@gmail.com</a
        >
      </small>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import AddProjectCamera from '@/components/CameraManagement/AddProjectCamera.vue';
import EditProjectCamera from '@/components/CameraManagement/EditProjectCamera.vue';
import ListProjectCamera from '@/components/CameraManagement/ListProjectCamera.vue';

const camera = createNamespacedHelpers('camera');
const projectCamera = createNamespacedHelpers('projectCamera');

export default {
  components: {
    AddProjectCamera,
    ListProjectCamera,
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
      showEmptyCamera: false,
      showEmptyProjectCamera: false,
      showAddProjectCamera: false,
      showListProjectCamera: false,
      showEditProjectCamera: false,
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
      this.showEmptyProjectCamera = false;
      this.showAddProjectCamera = true;
    },
    closeAddProjectCameras() {
      this.showAddProjectCamera = false;
    },
    async addProjectsCameraRequest() {
      await this.addProjectCameras({
        projectId: this.projectId,
        payload: this.addProjectCameraList,
      });
      await this.openEditProjectCameras();
      this.closeAddProjectCameras();
    },
    // edit project camera
    async openEditProjectCameras() {
      await this.getProjectCameraRequest();
      this.setEditProjectCameraList(this.projectCameras);
      this.showEditProjectCamera = true;
    },
    closeEditProjectCameras() {
      this.showEditProjectCamera = false;
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
    setShowListProjectCamera() {
      this.showListProjectCamera =
        !this.showEmptyCamera &&
        !this.showEmptyProjectCamera &&
        !this.showAddProjectCamera &&
        !this.showEditProjectCamera;
    },
  },
  async mounted() {
    await this.getCameras();
    await this.getProjectCameraRequest();

    this.showEmptyCamera = !this.cameras.length;
    this.showEmptyProjectCamera = !this.projectCameras.length;
    this.setShowListProjectCamera();
  },
  watch: {
    showAddProjectCamera: function() {
      this.setShowListProjectCamera();
    },
    showEditProjectCamera: function() {
      this.setShowListProjectCamera();
    },
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
