<template>
  <div class="modal fade camera-list-modal in">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">相機位置</h4>
        </div>
        <div class="modal-body" v-if="cameraLocations.length > 0">
          <div class="row">
            <div
              class="col-3"
              :key="camera.id"
              v-for="camera in cameraLocations"
            >
              <div class="checkbox">
                <input
                  type="checkbox"
                  v-model="form"
                  :id="`modal-${camera.id}`"
                  :value="camera.id"
                />
                <label :for="`modal-${camera.id}`">
                  <span class="text">{{ camera.name }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer text-right">
          <a class="btn btn-green-border" @click="$emit('close')">取消</a>
          <a class="btn btn-orange" @click="$emit('submit', form)">確定</a>
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
    cameraLocations: {
      type: Array,
      default: () => {
        return [];
      },
    },
    selected: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      form: this.selected,
    };
  },
};
</script>
