<template>
  <div>
    <h1>計畫總覽 Overview</h1>
    <ul>
      <li><router-link to="create">建立計畫</router-link></li>
      <br />
      <li :key="proj.id" v-for="proj in projects">
        <router-link :to="proj.id">{{
          `計畫 id: ${proj.id} / 計畫名稱: ${proj.title}`
        }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const projects = createNamespacedHelpers('projects');

export default {
  mounted() {
    this.getProjects();
  },
  computed: {
    ...projects.mapState(['projects']),
  },
  methods: {
    ...projects.mapActions(['getProjects']),
  },
};
</script>
