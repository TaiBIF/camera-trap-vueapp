<template>
  <div>
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
          :addProjectTrip="addProjectTrip"
        ></edit-project-trip-basic>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import EditProjectTripBasic from '@/components/ProjectEdit/Trip/EditProjectTripBasic.vue';

const studyAreas = createNamespacedHelpers('studyAreas');
const trip = createNamespacedHelpers('trip');

export default {
  components: {
    EditProjectTripBasic,
  },
  data: function() {
    return {
      showListTrip: true,
      showEditProjectTripBasic: false,
      projectId: this.$route.params.projectId,
    };
  },
  computed: {
    ...studyAreas.mapGetters(['studyAreas', 'cameraLocations']),
  },
  methods: {
    ...studyAreas.mapActions([
      'getProjectStudyAreas',
      'getProjectCameraLocations',
    ]),
    ...trip.mapActions(['addProjectTrip']),
    openEditProjectTripBasic: function() {
      this.showEditProjectTripBasic = true;
    },
    closeEditProjectTripBasic: function() {
      this.showEditProjectTripBasic = false;
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
