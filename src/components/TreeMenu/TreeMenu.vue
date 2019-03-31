<template>
  <ul class="tree-menu">
    <!-- Print 出所有子項目 -->
    <tree-item
      v-for="(item, idx) in items"
      :key="`menu-${item.id}`"
      :item="item"
      :level="1"
      :idx="idx"
    />
  </ul>
</template>

<script>
import TreeItem from '@/components/TreeMenu/TreeItem';

export default {
  name: 'TreeMenu',
  props: {
    items: Array,
    defaultOpenLevel: Number,
  },
  components: { TreeItem },
};
</script>
