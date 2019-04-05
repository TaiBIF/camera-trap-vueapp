<template>
  <div>
    <h1>建立計畫</h1>
    <div>
      <label>計畫名稱</label>
      <input v-model="project.title" />
      <br />
      <label>計畫簡稱</label>
      <input v-model="project.shortTitle" />
      <br />
      <label>委辦單位</label>
      <input v-model="project.funder" />
      <br />
      <label>計畫編號</label>
      <input v-model="project.code" />
      <br />
      <label>計畫主持人</label>
      <input v-model="project.principalInvestigator" />
      <br />

      <label>計畫時間 - 開始</label>
      <input
        type="date"
        @change="setProjectTime('startTime', $event.target.value)"
      />
      <br />
      <label>計畫時間 - 結束</label>
      <input
        type="date"
        @change="setProjectTime('endTime', $event.target.value)"
      />
      <br />
      <label>計畫地區</label>
      <select v-model="project.areas" multiple>
        <option :key="area.id" :value="area.id" v-for="area in projectAreas">{{
          area.title
        }}</option>
      </select>
      <br />
      <label>計畫摘要</label>
      <input v-model="project.description" />
      <br />
      <label>備註</label>
      <input v-model="project.note" />
      <br />
      <label>計畫封面</label>
      <input type="file" @change="uploadCover" />
      <br />
      <label>詮釋資料</label>
      <select v-model="project.interpretiveDataLicense">
        <option value="cc0">無著作權 (CC0)</option>
        <option value="by">姓名標示</option>
        <option value="by-nc">姓名標示-非商業性</option>
      </select>
      <br />
      <label>鑑定資訊</label>
      <select v-model="project.identificationInformationLicense">
        <option value="by">姓名標示</option>
      </select>
      <br />
      <label>影像資料</label>
      <select v-model="project.videoMaterialLicense">
        <option value="cc0">無著作權 (CC0)</option>
        <option value="by">姓名標示</option>
        <option value="by-nc">姓名標示-非商業性</option>
      </select>
      <br />
      <label>公開日期</label>
      <input
        type="date"
        @change="setProjectTime('publishTime', $event.target.value)"
      />
    </div>
    <button @click="submitProject">新增</button>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import moment from 'moment';

import { uploadFile } from '@/service';

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
  computed: {
    ...config.mapGetters(['projectAreas']),
  },
  methods: {
    ...projects.mapActions(['postProject']),
    async uploadCover(e) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      const data = await uploadFile('project-cover-image', formData);
      this.project.coverImageFile = data.id;
    },
    setProjectTime(key, t) {
      this.project[key] = moment(t).toISOString();
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
