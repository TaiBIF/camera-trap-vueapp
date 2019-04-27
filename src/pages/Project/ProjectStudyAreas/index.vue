<template>
  <div class="maintain page-sheet p-0">
    <div class="search-container">
      <!-- Edit mode -->
      <!-- Overview mode -->
      <div class="search-content">
        <a
          class="btn btn-green-border btn-sm float-right"
          v-tooltip.bottom="'將目前頁面或篩選範圍之資料輸出為 CSV 檔並下載'"
        >
          下載篩選結果
        </a>
        <h3 class="text-green mb-2">
          {{ studyAreaTitle }}
        </h3>
        <hr class="my-0" />
        <form action="" class="form form-horizontal">
          <div class="form-group mb-0">
            <label>相機位置</label>
            <div class="d-inline-block">
              <div class="checkbox checkbox-inline">
                <input
                  type="checkbox"
                  v-model="query.cameraLocations"
                  id="camera-all"
                  value="all"
                />
                <label for="camera-all">全部相機位置</label>
              </div>
              <div class="mb-2">
                <div
                  class="d-inline-block"
                  :key="camera.id"
                  v-for="(camera, index) in cameraLocations"
                >
                  <div class="checkbox checkbox-inline" v-if="index < 12">
                    <input
                      type="checkbox"
                      v-model="query.cameraLocations"
                      :id="camera.id"
                      :value="camera.id"
                      :disabled="query.cameraLocations.indexOf('all') > -1"
                    />
                    <label :for="camera.id">
                      <span class="text">{{ camera.name }}</span>
                    </label>
                  </div>
                </div>
                <div class="d-inline-block" v-if="cameraLocations.length >= 12">
                  <a
                    class="link text-gray"
                    role="button"
                    @click="CameraModalOpen = true"
                  >
                    查看更多
                  </a>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

    <camera-location-modal
      v-if="CameraModalOpen"
      :cameraLocations="cameraLocations"
      :selected="query.cameraLocations"
      @submit="setSelectedCamera"
      @close="CameraModalOpen = false"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import CameraLocationModal from '@/components/ProjectStudyAreas/CameraLocationModal.vue';

const studyAreas = createNamespacedHelpers('studyAreas');
const annotations = createNamespacedHelpers('annotations');

export default {
  components: {
    CameraLocationModal,
  },
  data() {
    return {
      CameraModalOpen: false,
      query: {
        cameraLocations: [],
      },
    };
  },
  mounted() {
    this.getProjectCameraLocations({
      projectId: this.projectId,
      studyAreaId: this.studyAreaId,
    });
  },
  watch: {
    studyAreaId: function() {
      this.getProjectCameraLocations({
        projectId: this.projectId,
        studyAreaId: this.studyAreaId,
      });
    },
  },
  computed: {
    ...studyAreas.mapState(['cameraLocations']),
    ...studyAreas.mapGetters(['studyAreas']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    studyAreaId: function() {
      return this.$route.params.studyAreaId;
    },
    studyAreaTitle: function() {
      let title = '';
      if (this.studyAreas.length > 0) {
        this.studyAreas.forEach(v => {
          // study area 第一層
          if (v.id === this.studyAreaId) {
            title = v.title;
          } else if (v.children.length > 0) {
            v.children.forEach(v2 => {
              // study area 第二層
              if (v2.id === this.studyAreaId) {
                title = `${v.title} - ${v2.title}`;
              }
            });
          }
        });
      }
      return title;
    },
  },
  methods: {
    ...studyAreas.mapActions(['getProjectCameraLocations']),
    ...annotations.mapActions(['getAnnotations']),
    setSelectedCamera(val) {
      this.query.cameraLocations = val;
      this.CameraModalOpen = false;
    },
    doSearch() {
      this.getAnnotations({
        studyAreaId: this.studyAreaId,
        ...this.query,
      });
    },
  },
};
</script>
