<template>
  <div class="modal fade" :class="{ in: open }">
    <div class="modal-dialog dialog-ui" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <img
            src="/assets/common/error-img.png"
            width="221"
            srcset="/assets/common/error-img@2x.png"
          />
          <h1 class="heading mt-0">{{ title }}</h1>
          <div class="text-left">
            {{ description }}
          </div>
          <a @click="$emit('close')" class="btn btn-default">取消</a>
          <a @click="$emit('summit')" class="btn btn-orange">是，我確定</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DoubleCheckModalWithStyle',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
  },
};
</script>
