<template>
  <div>
    <h1>計畫總覽 Overview</h1>
    <ul>
      <li><router-link to="create">建立計畫</router-link></li>
      <li :key="id" v-for="id in projectId">
        <router-link :to="id">{{ `計畫首頁 id: ${id}` }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      projectId: ['project1', 'project2'],
    };
  },
};
</script>
