<template>
  <div>
    <p v-if="errorMessage" :style="{ color: 'red' }">
      錯誤訊息: {{ errorMessage }}
    </p>
    <div class="panel">
      <div class="panel-heading">
        <h4>相機位置管理</h4>
      </div>
      <div class="panel-body camera-editor">
        <div class="sidebar" style="width: 300px">
          <study-area-sidebar
            :studyAreas="studyAreas"
            :projectId="projectId"
            :currentStudyAreaId="currentStudyAreaId"
            :isEditMode="true"
            @selectArea="selectStudyArea"
            @addArea="addStudyArea"
          />
        </div>
        <div class="maintain p-0">
          <div class="empty-result" v-if="studyAreas.length === 0">
            <img
              src="/assets/common/empty-site.png"
              width="174"
              srcset="/assets/common/empty-site@2x.png"
            />
            <h5 class="text-gray">您還沒新增任何樣區</h5>
          </div>
          <div
            class="empty-result"
            v-else-if="currentStudyAreaId === undefined"
          >
            <img
              src="/assets/common/empty-site.png"
              width="174"
              srcset="/assets/common/empty-site@2x.png"
            />
            <h5 class="text-gray">請選擇樣區</h5>
          </div>
        </div>
      </div>
    </div>

    <div class="action">
      <div @click="$router.back()" class="btn btn-default">取消</div>
      <button
        type="submit"
        @click.stop.prevent="doSubmit()"
        class="btn btn-orange"
      >
        儲存設定
      </button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import moment from 'moment';

import StudyAreaSidebar from '@/components/StudyAreaSidebar/StudyAreaSidebar.vue';

const studyAreas = createNamespacedHelpers('studyAreas');

export default {
  components: {
    StudyAreaSidebar,
  },
  data: function() {
    return {
      errorMessage: undefined,
      currentStudyAreaId: undefined,
      currentCameraLocationId: undefined,
      newCameraLocation: {},
      editCameraLocation: {},
    };
  },
  props: {
    setLoading: Function,
  },
  watch: {
    currentStudyAreaId: function(val) {
      this.currentCameraLocationId = '';
      this.getProjectCameraLocations({
        projectId: this.projectId,
        studyAreaId: val,
      });
    },
    currentCameraLocationId: function(val) {
      const obj = this.cameraLocations.find(v => v.id === val);
      Object.assign(this.editCameraLocation, obj);
      this.editCameraLocation.settingTime = moment(
        this.editCameraLocation.settingTime,
      ).format('YYYY-MM-DD');
    },
  },
  computed: {
    ...studyAreas.mapGetters(['studyAreas']),
    ...studyAreas.mapState(['cameraLocations']),
    projectId: function() {
      return this.$route.params.projectId;
    },
  },
  methods: {
    ...studyAreas.mapActions([
      'postProjectStudyAreas',
      'getProjectCameraLocations',
      'postProjectCameraLocations',
      'putProjectCameraLocations',
      'deleteProjectCameraLocations',
    ]),
    selectStudyArea(id) {
      this.currentStudyAreaId = id;
    },
    async addStudyArea(title, parent) {
      this.setLoading(true);
      try {
        await this.postProjectStudyAreas({
          id: this.projectId,
          area: { title, parent },
        });
        this.errorMessage = '';
      } catch (e) {
        this.errorMessage = JSON.stringify(e);
      }
      this.setLoading(false);
    },
    async addCameraLocation() {
      try {
        await this.postProjectCameraLocations({
          projectId: this.projectId,
          studyAreaId: this.currentStudyAreaId,
          cameraLocation: {
            ...this.newCameraLocation,
            settingTime: moment(
              this.newCameraLocation.settingTime,
            ).toISOString(),
          },
        });
        this.errorMessage = '';
      } catch (e) {
        this.errorMessage = JSON.stringify(e);
      }
    },
    async putCameraLocation() {
      try {
        await this.putProjectCameraLocations({
          projectId: this.projectId,
          studyAreaId: this.currentStudyAreaId,
          cameraLocationId: this.currentCameraLocationId,
          cameraLocation: {
            ...this.editCameraLocation,
            settingTime: moment(
              this.editCameraLocation.settingTime,
            ).toISOString(),
          },
        });
        this.errorMessage = '';
      } catch (e) {
        this.errorMessage = JSON.stringify(e);
      }
    },
    async deleteCameraLocation(cameraLocationId) {
      try {
        await this.deleteProjectCameraLocations({
          projectId: this.projectId,
          studyAreaId: this.currentStudyAreaId,
          cameraLocationId: cameraLocationId,
        });
        this.errorMessage = '';
      } catch (e) {
        this.errorMessage = JSON.stringify(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#split-view {
  display: flex;
  & > ul:nth-child(1) {
    border-right: 1px red solid;
    padding-right: 1rem;
  }
}
</style>
