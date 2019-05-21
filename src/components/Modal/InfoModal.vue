<template>
  <div class="modal fade" :class="{ in: open }">
    <div class="modal-dialog dialog-ui" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <slot />
          <div class="action">
            <a @click="$emit('close')" class="btn btn-orange btn-block"
              >我知道了</a
            >
          </div>
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
