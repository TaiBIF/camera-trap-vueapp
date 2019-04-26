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
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const studyAreas = createNamespacedHelpers('studyAreas');
const annotations = createNamespacedHelpers('annotations');

export default {
  data() {
    return {
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
    doSearch() {
      this.getAnnotations({
        studyAreaId: this.studyAreaId,
        ...this.query,
      });
    },
  },
};
</script>
