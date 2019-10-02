<template>
  <div class="project-trip">
    <div class="panel">
      <div class="panel-heading">
        <div>
          <h4>
            行程管理
          </h4>
          <button
            class="float-right btn btn-light-green"
            @click="openEditProjectTripBasic"
            v-show="showListTrip"
          >
            新增行程
          </button>
        </div>
      </div>
      <div class="project-trip-edit-basic" v-if="showEditProjectTripBasic">
        <edit-project-trip-basic
          :projectId="projectId"
          :projectStudyAreas="studyAreas"
          :cameraLocations="cameraLocations"
          :getProjectCameraLocations="getProjectCameraLocations"
          :closeEditProjectTripBasic="closeEditProjectTripBasic"
          :openEditProjectTripCamera="openEditProjectTripCamera"
          :addProjectTripRequest="addProjectTripRequest"
          :setEditProjectTrip="setEditProjectTrip"
          :editProjectTripData="editProjectTrip"
        ></edit-project-trip-basic>
      </div>
      <div class="project-trip-edit-camera" v-if="showEditProjectTripCamera">
        <edit-project-trip-camera
          :editProjectTripData="editProjectTrip"
          :projectCameras="projectCameras"
          :getProjectCameras="getProjectCameras"
          :projectId="projectId"
          :setEditProjectTrip="setEditProjectTrip"
        ></edit-project-trip-camera>
      </div>
    </div>
    <div
      class="project-trip-edit-camera-footer float-right mt-3 mb-3"
      v-show="showEditProjectTripCamera"
    >
      <button
        class="btn btn-green-border mr-3"
        @click="closeEditProjectTripCamera"
      >
        取消
      </button>
      <button class="btn btn-orange-border mr-3" @click="back">
        上一步
      </button>
      <button class="btn btn-orange" @click="checkAddProjectTripRequest">
        完成
      </button>
    </div>
    <double-check-modal-with-style
      :open="showCheckCameraDetailModal"
      title="您確定不填入相機資料嗎？"
      description="不填寫相機位置內的相機資料，往後將無法依據行程篩選資料．"
      @summit="addProjectTripRequest(true)"
      @close="closeCheckCameraDetailModal"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import DoubleCheckModalWithStyle from '@/components/Modal/DoubleCheckModalWithStyle.vue';
import EditProjectTripBasic from '@/components/ProjectEdit/Trip/EditProjectTripBasic.vue';
import EditProjectTripCamera from '@/components/ProjectEdit/Trip/EditProjectTripCamera.vue';

const projectCamera = createNamespacedHelpers('projectCamera');
const studyAreas = createNamespacedHelpers('studyAreas');
const trip = createNamespacedHelpers('trip');

export default {
  components: {
    EditProjectTripBasic,
    EditProjectTripCamera,
    DoubleCheckModalWithStyle,
  },
  data: function() {
    return {
      showListTrip: true,
      showEditProjectTripBasic: false,
      showEditProjectTripCamera: false,
      projectId: this.$route.params.projectId,
      showCheckCameraDetailModal: false,
    };
  },
  computed: {
    ...projectCamera.mapState(['projectCameras']),
    ...studyAreas.mapGetters(['studyAreas', 'cameraLocations']),
    ...trip.mapState(['editProjectTrip']),
  },
  methods: {
    ...projectCamera.mapActions(['getProjectCameras']),
    ...studyAreas.mapActions([
      'getProjectStudyAreas',
      'getProjectCameraLocations',
    ]),
    ...trip.mapActions(['addProjectTrip', 'setEditProjectTrip']),
    openEditProjectTripBasic: function() {
      this.setEditProjectTrip({});
      this.showEditProjectTripBasic = true;
    },
    closeEditProjectTripBasic: function() {
      this.showEditProjectTripBasic = false;
    },
    openEditProjectTripCamera: async function() {
      this.showEditProjectTripCamera = true;
    },
    closeEditProjectTripCamera: function() {
      this.showEditProjectTripCamera = false;
    },
    back: function() {
      this.showEditProjectTripBasic = true;
      this.closeEditProjectTripCamera();
    },
    addProjectTripRequest: async function(reGetProjectTrip) {
      await this.addProjectTrip({
        projectId: this.projectId,
        body: this.editProjectTrip,
        reGetProjectTrip,
      });
      this.closeEditProjectTripCamera();
      this.closeCheckCameraDetailModal();
    },
    openCheckCameraDetailModal() {
      this.showCheckCameraDetailModal = true;
    },
    closeCheckCameraDetailModal() {
      this.showCheckCameraDetailModal = false;
    },
    async checkAddProjectTripRequest() {
      await this.$emit('setEditProjectTripReduest');
      const emptyCameraDetail = this.editProjectTrip.studyAreas.reduce(
        (previous, current) => {
          let result = current.cameraLocations.reduce((pre, curr) => {
            if (curr.projectCameras && curr.projectCameras[0]) {
              const projectCameraDetailCount = Object.keys(
                curr.projectCameras[0],
              ).length;

              return pre || projectCameraDetailCount < 14;
            } else return pre;
          }, false);

          return previous || result;
        },
        false,
      );

      if (emptyCameraDetail) this.openCheckCameraDetailModal();
      else this.addProjectTripRequest(true);
    },
  },
  watch: {
    showEditProjectTripBasic: function(value) {
      this.showListTrip = !value;
    },
  },
  mounted() {
    this.getProjectStudyAreas(this.projectId);
  },
};
</script>
