<template>
  <div class="modal fade" :class="{ in: open }">
    <div class="modal-dialog dialog-ui" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <slot />
          <a @click="$emit('close')" class="btn btn-default">取消</a>
          <a @click="$emit('submit')" class="btn btn-orange">確定</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
