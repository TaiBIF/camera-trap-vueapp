<template>
  <div
    class="tree-menu-link"
    :class="{
      'is-active': isActive,
    }"
    @click="$emit('select', studyArea)"
  >
    <span class="icon">
      <i v-if="!studyArea.children" class="dot"></i>
      <i
        v-else
        class="fa"
        :class="isExpand ? 'fa-caret-down' : 'fa-caret-right'"
      ></i
    ></span>
    <router-link
      v-if="!studyArea.children || studyArea.children.length === 0"
      :to="`/project/${projectId}/study-areas/${studyArea.id}`"
      class="text"
    >
      {{ studyArea.title }}
    </router-link>
    <span class="text" v-else> {{ studyArea.title }} </span>
    <!-- TODO: adjust after API implement lock info -->
    <div class="icon float-right" v-show="studyArea.locked">
      <i class="fa fa-lock"></i>
    </div>
    <!-- TODO: adjust after API implement error info -->
    <div class="icon float-right" v-show="studyArea.hasError">
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
    projectId: {
      type: String,
      required: true,
    },
    isExpand: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
