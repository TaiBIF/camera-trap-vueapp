<template>
  <div class="container page-article">
    <router-link :to="`/project/${projectId}`">
      &lt;&lt; {{ projectDetail.title }}
    </router-link>

    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-8">
            <h1 class="heading mt-0">
              相機樣點運作及缺失比例
            </h1>
          </div>
        </div>
        <div class="row">
          <div class="col-3">
            <div class="form-group">
              <label>年份：</label>
              <v-select
                :options="years"
                placeholder="請選擇年份"
                @input="setYear"
                v-model="selectedYear"
              />
            </div>
          </div>
        </div>
        <h3>每月相機運作比例</h3>
        <div
          :key="studyAreaIdx"
          v-for="(studyArea,
          studyAreaIdx) in projectOversight.studyAreaCameraLocations"
        >
          <h4>樣區: {{ studyArea.title }}</h4>
          <div
            :key="cameraLocationIdx"
            v-for="(cameraLocation,
            cameraLocationIdx) in studyArea.cameraLocations"
          >
            <table class="table table-striped">
              <thead>
                <tr>
                  <td>相機位置</td>
                  <td>1 月</td>
                  <td>2 月</td>
                  <td>3 月</td>
                  <td>4 月</td>
                  <td>5 月</td>
                  <td>6 月</td>
                  <td>7 月</td>
                  <td>8 月</td>
                  <td>9 月</td>
                  <td>10 月</td>
                  <td>11 月</td>
                  <td>12 月</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ cameraLocation.name }}</td>
                  <td
                    :key="i"
                    v-for="(v, i) in projectOversight.data[cameraLocation._id]"
                  >
                    <span
                      v-if="v"
                      v-tooltip.right="{
                        content: `相機有運作天數/當月天數: ${v[0]}/${v[1]}`,
                      }"
                    >
                      {{ renderPercentage(v) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div :key="i" v-for="(subStudyArea, i) in studyArea.children">
              <h5>子樣區: {{ subStudyArea.title }}</h5>
              <div
                :key="cameraLocationIdx"
                v-for="(cameraLocation,
                cameraLocationIdx) in subStudyArea.cameraLocations"
              >
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <td>相機位置</td>
                      <td>1 月</td>
                      <td>2 月</td>
                      <td>3 月</td>
                      <td>4 月</td>
                      <td>5 月</td>
                      <td>6 月</td>
                      <td>7 月</td>
                      <td>8 月</td>
                      <td>9 月</td>
                      <td>10 月</td>
                      <td>11 月</td>
                      <td>12 月</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ cameraLocation.name }}</td>
                      <td
                        :key="i"
                        v-for="(v, i) in projectOversight.data[
                          cameraLocation._id
                        ]"
                      >
                        <span
                          v-if="v"
                          v-tooltip.right="{
                            content: `相機有運作天數/當月天數: ${v[0]}/${v[1]}`,
                          }"
                        >
                          {{ renderPercentage(v) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { dateFormatYYYY } from '@/utils/dateHelper';
import vSelect from 'vue-select';

const projects = createNamespacedHelpers('projects');

export default {
  components: {
    vSelect,
  },
  data() {
    return {
      selectedYear: undefined,
    };
  },
  computed: {
    ...projects.mapState(['projectDetail', 'projectOversight']),
    projectId: function() {
      return this.$route.params.projectId;
    },
    years: function() {
      const { annotationDateTimeRange } = this.projectDetail;
      if (annotationDateTimeRange) {
        const start = parseInt(dateFormatYYYY(annotationDateTimeRange[0]), 10);
        const end = parseInt(dateFormatYYYY(annotationDateTimeRange[1]), 10);
        const yearOptions = [];
        for (let i = start; i <= end; i++) {
          yearOptions.push(i);
        }
        return yearOptions;
      }
      return [];
    },
  },
  async mounted() {
    console.log(this.projectOversight);
  },
  methods: {
    ...projects.mapActions(['getProjectOversight']),
    async setYear(v) {
      this.getProjectOversight({
        id: this.projectId,
        year: v,
      });
    },
    renderPercentage(v) {
      const d = Math.floor((v[0] / v[1]) * 10000) / 100;
      return `${d}%`;
    },
  },
};
</script>
