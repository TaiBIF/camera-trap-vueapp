<template>
  <div :style="{ border: '3px green dashed' }">
    <h1>編輯物種</h1>
    <div :style="{ border: '3px red dashed' }">
      <label>新物種</label>
      <input type="text" v-model="newSpecies" />
      <button @click="addSpecies">新增</button>
    </div>
    <br />
    <div
      :key="sp.id"
      :style="{ 'border-bottom': '3px blue dashed' }"
      v-for="sp in tempSpecies"
    >
      <p>id: {{ sp.id }}</p>
      <p>code: {{ sp.code }}</p>
      <p>title: {{ sp.title }}</p>
    </div>
    <button @click="sumbitSpecies">儲存</button>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const projects = createNamespacedHelpers('projects');

export default {
  data: function() {
    return {
      newSpecies: '',
      tempSpecies: [],
    };
  },
  mounted() {
    this.getProjectSpecies(this.projectId);
    this.tempSpecies = this.projectSpecies;
  },
  watch: {
    projectSpecies: function(val) {
      this.tempSpecies = val;
    },
  },
  computed: {
    ...projects.mapGetters(['projectSpecies']),
    projectId: function() {
      return this.$route.params.projectId;
    },
  },
  methods: {
    ...projects.mapActions(['getProjectSpecies', 'putProjectSpecies']),
    addSpecies() {
      this.tempSpecies.push({ title: this.newSpecies });
      this.newSpecies = '';
    },
    sumbitSpecies() {
      this.putProjectSpecies({ id: this.projectId, species: this.tempSpecies });
    },
  },
};
</script>
