<template>
  <div class="page-project">
    <div class="container">
      <h1 class="heading">新增計畫</h1>
      <div>
        <BasicInfo
          v-if="step === 1"
          doneBtnText="下一步"
          :project="project"
          :areas="projectAreas"
          @change="onChange"
          @done="step = 2"
        />
        <CcInfo
          v-if="step === 2"
          doneBtnText="新增計畫"
          :project="project"
          @change="onChange"
          @done="submitProject"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import moment from 'moment';

import BasicInfo from '@/components/ProjectEdit/BasicInfo.vue';
import CcInfo from '@/components/ProjectEdit/CcInfo.vue';

const config = createNamespacedHelpers('config');
const projects = createNamespacedHelpers('projects');

export default {
  data: function() {
    return {
      step: 1,
      project: {
        title: undefined,
        shortTitle: undefined,
        funder: undefined,
        code: undefined,
        principalInvestigator: undefined,
        startTime: this.getTodayDate(),
        endTime: this.plusNYears(this.getTodayDate(), 1),
        areas: [],
        description: undefined,
        note: undefined,
        coverImageFile: undefined,
        publishTime: this.plusNYears(this.getTodayDate(), 1),
        interpretiveDataLicense: 'cc0',
        identificationInformationLicense: 'by',
        videoMaterialLicense: 'cc0',
      },
    };
  },
  components: {
    BasicInfo,
    CcInfo,
  },
  computed: {
    ...config.mapGetters(['projectAreas']),
  },
  methods: {
    ...projects.mapActions(['postProject']),
    plusNYears(dateTimeString, n = 1) {
      return moment(dateTimeString).add(n, 'years');
    },
    getTodayDate() {
      return moment(Date.now());
    },
    onChange(v) {
      Object.assign(this.project, v);
    },
    submitProject() {
      this.postProject(this.project).then(() =>
        this.$router.push({
          path: '/project/overview',
        }),
      );
    },
  },
};
</script>
