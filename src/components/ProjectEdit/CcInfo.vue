<template>
  <div v-if="!!project">
    <label>詮釋資料: </label>
    <input
      type="radio"
      value="cc0"
      :checked="project.interpretiveDataLicense === 'cc0'"
      @change="changeProps('interpretiveDataLicense', $event.target.value)"
    />
    <label>無著作權 (CC0)</label>
    <input
      type="radio"
      value="by"
      :checked="project.interpretiveDataLicense === 'by'"
      @change="changeProps('interpretiveDataLicense', $event.target.value)"
    />
    <label>姓名標示</label>
    <input
      type="radio"
      value="by-nc"
      :checked="project.interpretiveDataLicense === 'by-nc'"
      @change="changeProps('interpretiveDataLicense', $event.target.value)"
    />
    <label>姓名標示-非商業性</label>
    <br />
    <label>鑑定資訊: </label>
    <input
      type="radio"
      value="by"
      :checked="project.identificationInformationLicense === 'by'"
      @change="
        changeProps('identificationInformationLicense', $event.target.value)
      "
    />
    <label>姓名標示</label>
    <br />
    <label>影像資料: </label>
    <input
      type="radio"
      value="cc0"
      :checked="project.videoMaterialLicense === 'cc0'"
      @change="changeProps('videoMaterialLicense', $event.target.value)"
    />
    <label>無著作權 (CC0)</label>
    <input
      type="radio"
      value="by"
      :checked="project.videoMaterialLicense === 'by'"
      @change="changeProps('videoMaterialLicense', $event.target.value)"
    />
    <label>姓名標示</label>
    <input
      type="radio"
      value="by-nc"
      :checked="project.videoMaterialLicense === 'by-nc'"
      @change="changeProps('videoMaterialLicense', $event.target.value)"
    />
    <label>姓名標示-非商業性</label>
    <br />
    <label>公開日期</label>
    <input
      type="date"
      :value="formatTime(project.publishTime)"
      @change="setProjectTime('publishTime', $event.target.value)"
    />
  </div>
</template>

<script>
import moment from 'moment';

export default {
  props: {
    project: Object,
  },
  methods: {
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
