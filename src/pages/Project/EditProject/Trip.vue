<template>
  <div class="project-trip">
    <div class="panel">
      <div class="panel-heading">
        <div>
          <h4>
            行程管理
          </h4>
          <span class="float-right" v-show="showListTrip">
            <button
              class=" btn btn-light-green btn-sm"
              @click="openAddProjectTripBasic"
            >
              新增行程
            </button>
            <el-input
              placeholder="搜尋..."
              suffix-icon="el-icon-search"
              v-model="searchTrip"
            ></el-input>
          </span>
        </div>
      </div>
      <div
        class="project-trip-list"
        v-if="!showEditProjectTripBasic && !showEditProjectTripCamera"
      >
        <list-project-trip
          :projectId="projectId"
          :projectTripsData="projectTrips"
          :searchTrip="searchTrip"
          :cmaeraLocationEvenString="cmaeraLocationEvenString"
          :cameraStateString="cameraStateString"
          @deleteProjectTrip="deleteProjectTrip"
          @openEditProjectTripBasic="openEditProjectTripBasic"
        />
      </div>
      <div class="project-trip-edit-basic" v-if="showEditProjectTripBasic">
        <edit-project-trip-basic
          :projectId="projectId"
          :projectStudyAreas="studyAreas"
          :cameraLocations="cameraLocations"
          :getProjectCameraLocations="getProjectCameraLocations"
          :closeEditProjectTripBasic="closeEditProjectTripBasic"
          :openEditProjectTripCamera="openEditProjectTripCamera"
          :addEditProjectTripRequest="addEditProjectTripRequest"
          :setEditProjectTripData="setEditProjectTripData"
          :editProjectTripData="editProjectTripData"
        ></edit-project-trip-basic>
      </div>
      <div class="project-trip-edit-camera" v-if="showEditProjectTripCamera">
        <edit-project-trip-camera
          :editProjectTripData="editProjectTripData"
          :projectCameras="projectCameras"
          :getProjectCameras="getProjectCameras"
          :projectId="projectId"
          :setEditProjectTripData="setEditProjectTripData"
          :cmaeraLocationEvenString="cmaeraLocationEvenString"
          :cameraStateString="cameraStateString"
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
      @summit="addEditProjectTripRequest(true)"
      @close="closeCheckCameraDetailModal"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import DoubleCheckModalWithStyle from '@/components/Modal/DoubleCheckModalWithStyle.vue';
import EditProjectTripBasic from '@/components/ProjectEdit/Trip/EditProjectTripBasic.vue';
import EditProjectTripCamera from '@/components/ProjectEdit/Trip/EditProjectTripCamera.vue';
import ListProjectTrip from '@/components/ProjectEdit/Trip/ListProjectTrip.vue';

const projectCamera = createNamespacedHelpers('projectCamera');
const studyAreas = createNamespacedHelpers('studyAreas');
const trip = createNamespacedHelpers('trip');

const cmaeraLocationEvenString = {
  設置: '設置',
  替換: '替換',
};
const cameraStateString = {
  active: '正常',
  broken: '毀損',
};

export default {
  components: {
    EditProjectTripBasic,
    EditProjectTripCamera,
    DoubleCheckModalWithStyle,
    ListProjectTrip,
  },
  data: function() {
    return {
      showListTrip: true,
      showEditProjectTripBasic: false,
      showEditProjectTripCamera: false,
      projectId: this.$route.params.projectId,
      showCheckCameraDetailModal: false,
      searchTrip: '',
      cmaeraLocationEvenString,
      cameraStateString,
    };
  },
  computed: {
    ...projectCamera.mapState(['projectCameras']),
    ...studyAreas.mapGetters(['studyAreas', 'cameraLocations']),
    ...trip.mapState(['projectTrips', 'editProjectTripData']),
  },
  methods: {
    ...projectCamera.mapActions(['getProjectCameras']),
    ...studyAreas.mapActions([
      'getProjectStudyAreas',
      'getProjectCameraLocations',
    ]),
    ...trip.mapActions([
      'getProjectTrips',
      'addProjectTrip',
      'setEditProjectTripData',
      'editProjectTrip',
      'deleteProjectTrip',
    ]),
    openAddProjectTripBasic: async function() {
      await this.getProjectStudyAreas(this.projectId);
      this.setEditProjectTripData({});
      this.showEditProjectTripBasic = true;
    },
    openEditProjectTripBasic: async function(currentTrip) {
      await this.getProjectStudyAreas(this.projectId);
      this.setEditProjectTripData(currentTrip);
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
    addEditProjectTripRequest: async function(reGetProjectTrip) {
      if (this.editProjectTripData.id) {
        await this.editProjectTrip({
          projectId: this.projectId,
          tripId: this.editProjectTripData.id,
          body: this.editProjectTripData,
        });
      } else {
        await this.addProjectTrip({
          projectId: this.projectId,
          body: this.editProjectTripData,
          reGetProjectTrip,
        });
      }
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
      const emptyCameraDetail = this.editProjectTripData.studyAreas.reduce(
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
      else this.addEditProjectTripRequest(true);
    },
  },
  watch: {
    showEditProjectTripBasic: function(value) {
      this.showListTrip = !value;
      this.searchTrip = '';
    },
    showEditProjectTripCamera: function(value) {
      this.showListTrip = !value;
      this.searchTrip = '';
    },
  },
  mounted() {
    this.getProjectTrips(this.projectId);
  },
};
</script>
