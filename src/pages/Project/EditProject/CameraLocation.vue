<template>
  <div>
    <h1>計畫管理-相機位置管理</h1>
    <p v-if="errorMessage" :style="{ color: 'red' }">
      錯誤訊息: {{ errorMessage }}
    </p>
    <ul>
      <li :key="area.id" v-for="area in studyAreas">
        {{ `${area.title} / ${area.id}` }}
        <ul>
          <li :key="area.id" v-for="area in area.children">
            {{ `${area.title} / ${area.id}` }}
          </li>
          <li>
            <label>新增: </label
            ><input
              type="text"
              @change="addStudyArea($event.target.value, area.id)"
            />
          </li>
        </ul>
      </li>
      <li>
        <label>新增: </label
        ><input type="text" @change="addStudyArea($event.target.value)" />
      </li>
    </ul>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const studyAreas = createNamespacedHelpers('studyAreas');

export default {
  data: function() {
    return {
      errorMessage: undefined,
    };
  },
  mounted() {},
  computed: {
    ...studyAreas.mapGetters(['studyAreas']),
    projectId: function() {
      return this.$route.params.projectId;
    },
  },
  methods: {
    ...studyAreas.mapActions(['postProjectStudyAreas']),
    async addStudyArea(title, parent) {
      try {
        await this.postProjectStudyAreas({
          id: this.projectId,
          area: { title, parent },
        });
        this.errorMessage = '';
      } catch (e) {
        this.errorMessage = JSON.stringify(e);
      }
    },
  },
};
</script>
