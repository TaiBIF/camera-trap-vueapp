<template>
  <div
    class="tree-menu-link"
    :class="{
      'is-active': isActive,
    }"
    @click="$emit('select')"
    @dblclick="enableEditArea"
  >
    <span class="icon">
      <i
        v-if="!studyArea.children || studyArea.children.length === 0"
        class="dot"
      ></i>
      <i
        v-else
        class="fa"
        :class="isExpand ? 'fa-caret-down' : 'fa-caret-right'"
      ></i
    ></span>
    <div v-if="isEditing">
      <input
        ref="editInput"
        v-model="editValue"
        @keydown="editArea"
        @blur="resetEdit"
      />
    </div>
    <router-link v-else-if="link" :to="link" class="text">
      {{ studyArea.title }}
    </router-link>
    <span class="text" v-else> {{ studyArea.title }} </span>
    <div
      class="icon float-right"
      v-show="!isEditMode && studyArea.isLockedAllCameraLocation"
    >
      <i class="fa fa-lock"></i>
    </div>
    <div
      class="icon float-right"
      v-show="!isEditMode && studyArea.failures > 0"
    >
      <i class="has-error"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'study-area-item',
  props: {
    studyArea: {
      type: Object,
      required: true,
    },
    link: {
      type: String,
      default: '',
    },
    isExpand: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isEditing: false,
      editValue: '',
    };
  },
  methods: {
    enableEditArea() {
      if (this.isEditMode) {
        this.isEditing = true;
        this.editValue = this.studyArea.title;
        // wait isEditing = true to render input
        setTimeout(() => {
          this.$refs.editInput.focus();
        }, 0);
      }
    },
    resetEdit() {
      this.isEditing = false;
      this.editValue = '';
    },
    editArea(event) {
      // ECS reset
      if (event.key === 'Escape') {
        this.resetEdit();
      }
      // Enter save change
      if (event.key === 'Enter') {
        this.emitEdit(event.target.value);
        this.resetEdit();
      }
    },
    emitEdit(name) {
      if (name && name !== this.studyArea.title) {
        this.$emit('editArea', name, this.studyArea.id);
      }
    },
  },
};
</script>
