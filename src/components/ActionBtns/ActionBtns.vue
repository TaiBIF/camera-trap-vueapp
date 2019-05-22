<template>
  <div class="action">
    <div class="error">
      <span v-if="!!errorMessage">{{ errorMessage }}</span>
    </div>
    <div>
      <div class="btn btn-default" @click="$emit('cancel')">
        {{ cancelBtnContext }}
      </div>
      <button
        type="submit"
        class="btn btn-orange"
        @click.stop.prevent="$emit('submit')"
        :disabled="disabledSubmit"
      >
        {{ submitBtnContext }}
      </button>
    </div>
  </div>
</template>

<script>
import getErrorMessage from '@/utils/errorMessage';

export default {
  name: 'ActionBtns',
  props: {
    cancelBtnContext: {
      type: String,
      default: '取消',
    },
    submitBtnContext: {
      type: String,
      default: '儲存設定xxxx',
    },
    error: {
      type: Object,
      default: undefined,
    },
    disabledSubmit: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    errorMessage: function() {
      if (this.error && this.error.status)
        return getErrorMessage(this.error.status);

      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
.action {
  display: flex;
  justify-content: space-between;

  & > .error > span {
    color: #d80c37;
  }
}
</style>
