<template>
  <ul class="tree-menu">
    <li
      class="tree-menu-item"
      v-for="studyArea in studyAreas"
      :key="studyArea.id"
      :class="{
        'is-open': expandId === studyArea.id,
      }"
    >
      <study-area-item
        :studyArea="studyArea"
        :projectId="projectId"
        :isExpand="expandId === studyArea.id"
        :isActive="currentStudyAreaId === studyArea.id"
        @select="toggleExpand(studyArea)"
      />
      <ul
        class="tree-menu-child"
        v-for="studyArea in studyArea.children"
        :key="studyArea.id"
      >
        <li class="tree-menu-item">
          <study-area-item
            :studyArea="studyArea"
            :projectId="projectId"
            :isActive="currentStudyAreaId === studyArea.id"
          />
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import StudyAreaItem from '@/components/StudyAreaSidebar/StudyAreaItem.vue';

export default {
  name: 'study-area-sidebar',
  components: {
    StudyAreaItem,
  },
  props: {
    studyAreas: {
      type: Array,
      default: () => {
        return [];
      },
    },
    projectId: {
      type: String,
      required: true,
    },
    currentStudyAreaId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      expandId: null,
    };
  },
  methods: {
    toggleExpand(studyArea) {
      if (!studyArea.children || studyArea.children.length === 0) {
        return;
      }
      if (this.expandId === studyArea.id) {
        this.expandId = null;
      } else {
        this.expandId = studyArea.id;
      }
    },
  },
};
</script>
