<template>
  <div>
    <h1>建立計畫</h1>
    <div>
      <BasicInfo :project="project" :areas="projectAreas" @change="onChange" />
      <CcInfo :project="project" @change="onChange" />
    </div>
    <button @click="submitProject">新增</button>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import BasicInfo from '@/components/ProjectEdit/BasicInfo.vue';
import CcInfo from '@/components/ProjectEdit/CcInfo.vue';

const config = createNamespacedHelpers('config');
const projects = createNamespacedHelpers('projects');

export default {
  data: function() {
    return {
      project: {
        title: undefined,
        shortTitle: undefined,
        funder: undefined,
        code: undefined,
        principalInvestigator: undefined,
        startTime: undefined,
        endTime: undefined,
        areas: [],
        description: undefined,
        note: undefined,
        coverImageFile: undefined,
        publishTime: undefined,
        interpretiveDataLicense: undefined,
        identificationInformationLicense: undefined,
        videoMaterialLicense: undefined,
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
