<template>
  <div>
    <h1>計畫管理-編輯設定</h1>
    <DataFields />
    <Species />
  </div>
</template>

<script>
import DataFields from './DataFields.vue';
import Species from './Species.vue';

export default {
  components: {
    DataFields,
    Species,
  },
};
</script>
