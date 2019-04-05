<template>
  <div>
    <h1>建立計畫</h1>
    <div>
      <label>計畫地區</label>
      <select v-model="project.areas" multiple>
        <option :key="area.id" :value="area.id" v-for="area in projectAreas">{{
          area.title
        }}</option>
      </select>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const config = createNamespacedHelpers('config');

export default {
  data: function() {
    return {
      project: {
        areas: [],
      },
    };
  },
  computed: {
    ...config.mapGetters(['projectAreas']),
  },
};
</script>
