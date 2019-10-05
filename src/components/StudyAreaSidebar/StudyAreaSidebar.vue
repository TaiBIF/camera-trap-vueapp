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
        :isEditMode="isEditMode"
        @select="toggleExpand(studyArea, true)"
        @editArea="editArea"
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
            :isEditMode="isEditMode"
            @select="toggleExpand(studyArea)"
            @editArea="editArea"
          />
        </li>
      </ul>
      <ul v-show="isEditMode" class="tree-menu-child">
        <li class="tree-menu-item">
          <div class="tree-menu-link">
            <label :for="`addArea_${studyArea.id}`" class="icon"
              ><i class="fa fa-plus"></i
            ></label>
            <div class="text">
              <input
                type="text"
                :id="`addArea_${studyArea.id}`"
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
      <div class="tree-menu-link">
        <label for="addParentArea" class="icon"
          ><i class="fa fa-plus"></i
        ></label>
        <div class="text">
          <input
            type="text"
            id="addParentArea"
            placeholder="新增樣區"
            v-model="newArea"
            @keydown.enter="addNewArea"
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
      newArea: '',
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
    addNewArea({ target }) {
      if (!this.newArea) {
        return;
      }

      const value = this.newArea;
      const parentId = target.getAttribute('data-parent-id');

      this.$emit('addArea', value, parentId);
      this.$emit('handleSubmitBtnState', true);

      // reset new area value
      this.newArea = '';
    },
    editArea(name, id) {
      this.$emit('editArea', name, id);
    },
  },
};
</script>

<style lang="scss">
.tree-menu-link {
  i {
    color: #8b8b8b;
    cursor: pointer;
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
