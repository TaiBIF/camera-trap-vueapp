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
          <h1 class="heading mt-0">您確定要刪除{{ projectCameraName }}嗎？</h1>
          <div class="text-left">
            刪除此計畫內的相機資料，往後行程管理將無法選擇此相機．
          </div>
          <a @click="$emit('close')" class="btn btn-default">取消</a>
          <a @click="$emit('checkDeleteProjectCamera')" class="btn btn-orange"
            >是，我確定</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckDeleteProjectCameraModal',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    projectCameraName: {
      type: String,
    },
  },
};
</script>
