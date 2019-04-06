<template>
  <div v-if="!!project">
    <label>計畫名稱</label>
    <input
      :value="project.title"
      @change="changeProps('title', $event.target.value)"
    />
    <br />
    <label>計畫簡稱</label>
    <input
      :value="project.shortTitle"
      @change="changeProps('shortTitle', $event.target.value)"
    />
    <br />
    <label>委辦單位</label>
    <input
      :value="project.funder"
      @change="changeProps('funder', $event.target.value)"
    />
    <br />
    <label>計畫編號</label>
    <input
      :value="project.code"
      @change="changeProps('code', $event.target.value)"
    />
    <br />
    <label>計畫主持人</label>
    <input
      :value="project.principalInvestigator"
      @change="changeProps('principalInvestigator', $event.target.value)"
    />
    <br />
    <label>計畫時間 - 開始</label>
    <input
      type="date"
      :value="formatTime(project.startTime)"
      @change="setProjectTime('startTime', $event.target.value)"
    />
    <br />
    <label>計畫時間 - 結束</label>
    <input
      type="date"
      :value="formatTime(project.endTime)"
      @change="setProjectTime('endTime', $event.target.value)"
    />
    <br />
    <label>計畫地區</label>
    <v-select
      multiple
      :value="project.areas"
      label="title"
      :options="areas"
      @change="val => changeProps('areas', val)"
    ></v-select>
    <br />
    <label>計畫摘要</label>
    <input
      :value="project.description"
      @change="changeProps('description', $event.target.value)"
    />
    <br />
    <label>備註</label>
    <input
      :value="project.note"
      @change="changeProps('note', $event.target.value)"
    />
    <br />
    <label>計畫封面</label>
    <input type="file" @change="uploadCover" />
    <br />
  </div>
</template>

<script>
import moment from 'moment';
import vSelect from 'vue-select';

import { uploadFile } from '@/service';

export default {
  components: {
    vSelect,
  },
  props: {
    project: Object,
    areas: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    async uploadCover(e) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      const data = await uploadFile('project-cover-image', formData);
      this.changeProps('coverImageFile', data.id);
    },
    formatTime(v) {
      return moment(v).format('YYYY-MM-DD');
    },
    setProjectTime(key, t) {
      this.changeProps(key, moment(t).toISOString());
    },
    changeProps(key, value) {
      this.$emit('change', Object.assign({}, this.project, { [key]: value }));
    },
  },
};
</script>
