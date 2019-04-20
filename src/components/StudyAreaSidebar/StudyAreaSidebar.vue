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
        :link="generateAreaLink(studyArea)"
        :isExpand="expandId === studyArea.id"
        :isActive="currentStudyAreaId === studyArea.id"
        @select="toggleExpand(studyArea, true)"
      />
      <ul
        class="tree-menu-child"
        v-for="studyArea in studyArea.children"
        :key="studyArea.id"
      >
        <li class="tree-menu-item">
          <study-area-item
            :studyArea="studyArea"
            :link="generateAreaLink(studyArea)"
            :isActive="currentStudyAreaId === studyArea.id"
            @select="toggleExpand(studyArea)"
          />
        </li>
      </ul>
      <ul v-show="isEditMode" class="tree-menu-child">
        <li class="tree-menu-item">
          <div class="tree-menu-link addInput">
            <label for="addSite" class="icon"><i class="fa fa-plus"></i></label>
            <div class="text">
              <input
                class="addInput"
                type="text"
                id="addSite"
                placeholder="新增子樣區"
                @keydown="addNewArea"
                :data-parent-id="studyArea.id"
              />
            </div>
          </div>
        </li>
      </ul>
    </li>
    <li v-show="isEditMode" class="tree-menu-item">
      <div class="tree-menu-link addInput">
        <label for="addSite" class="icon"><i class="fa fa-plus"></i></label>
        <div class="text">
          <input
            class="addInput"
            type="text"
            id="addSite"
            placeholder="新增樣區"
            @keydown="addNewArea"
          />
        </div>
      </div>
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
    isEditMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expandId: null,
    };
  },
  methods: {
    toggleExpand(studyArea, isParent) {
      this.$emit('selectArea', studyArea.id);
      if (!isParent) {
        return;
      }
      if (this.expandId === studyArea.id) {
        this.expandId = null;
      } else {
        this.expandId = studyArea.id;
      }
    },
    generateAreaLink(studyArea) {
      if (
        this.isEditMode ||
        (studyArea.children && studyArea.children.length > 0)
      ) {
        return '';
      }
      return `/project/${this.projectId}/study-areas/${studyArea.id}`;
    },
    addNewArea(event) {
      if (event.type === 'keydown' && event.key === 'Enter') {
        const value = event.target.value;
        const parentId = event.target.getAttribute('data-parent-id');
        if (value) {
          this.$emit('addArea', value, parentId);
          event.target.value = '';
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.addInput {
  i {
    color: #8b8b8b;
  }
  input {
    border: 0;
    font-size: 16px;
    outline: 0;
    padding: 13px 0;
    background-color: transparent;

    &:focus {
      outline: 0;
      box-shadow: inset 0px -1px lightgray;
      &::placeholder {
        opacity: 0;
      }
    }
  }
}
</style>
