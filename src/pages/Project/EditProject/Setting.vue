<template>
  <div>
    <h1>計畫管理-編輯設定</h1>
    <DataFields />
    <Species />
    <DataFieldsTemplate />
    <CameraTestTime />
  </div>
</template>

<script>
import CameraTestTime from './CameraTestTime.vue';
import DataFields from './DataFields.vue';
import DataFieldsTemplate from './DataFieldsTemplate.vue';
import Species from './Species.vue';

export default {
  components: {
    DataFields,
    Species,
    DataFieldsTemplate,
    CameraTestTime,
  },
  props: {
    setLoading: Function,
  },
};
</script>
