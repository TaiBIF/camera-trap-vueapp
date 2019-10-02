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
      <button class="btn btn-orange" @click="addProjectTripRequest(true)">
        完成
      </button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import EditProjectTripBasic from '@/components/ProjectEdit/Trip/EditProjectTripBasic.vue';
import EditProjectTripCamera from '@/components/ProjectEdit/Trip/EditProjectTripCamera.vue';

const projectCamera = createNamespacedHelpers('projectCamera');
const studyAreas = createNamespacedHelpers('studyAreas');
const trip = createNamespacedHelpers('trip');

export default {
  components: {
    EditProjectTripBasic,
    EditProjectTripCamera,
  },
  data: function() {
    return {
      showListTrip: true,
      showEditProjectTripBasic: false,
      showEditProjectTripCamera: false,
      projectId: this.$route.params.projectId,
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
      await this.$emit('setEditProjectTripReduest');

      await this.addProjectTrip({
        projectId: this.projectId,
        body: this.editProjectTrip,
        reGetProjectTrip,
      });
      this.closeEditProjectTripCamera();
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
