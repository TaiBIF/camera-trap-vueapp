<template>
  <div class="action">
    <div v-if="status === undefined || !!responseMessage" class="error">
      <span>{{ responseMessage }}</span>
    </div>
    <div v-if="status === 200" class="success">
      <span>設定儲存成功</span>
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
import getResponseMessage from '@/utils/responseMessage';

export default {
  name: 'ActionBtns',
  props: {
    cancelBtnContext: {
      type: String,
      default: '取消',
    },
    submitBtnContext: {
      type: String,
      default: '儲存設定',
    },
    response: {
      type: Object,
      default: undefined,
    },
    disabledSubmit: {
      type: Boolean,
      default: true,
    },
    status: {
      type: Number,
      default: undefined,
    },
  },
  computed: {
    responseMessage: function() {
      if (this.response && this.response.status) {
        return getResponseMessage(this.response.status);
      }
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
  & > .success > span {
    color: #2a7f60;
  }
}
</style>
