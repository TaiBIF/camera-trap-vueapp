<template>
  <div class="dropdown" @mouseover="hint = true" @mouseleave="hint = false">
    <div class="btn-group btn-grayscale" :class="{ active: isEnable }">
      <button
        class="btn btn-xs pr-0"
        :class="{ 'gray-background': hint }"
        @click="$emit('switch')"
      >
        <span class="text">連拍自動補齊</span>
      </button>
      <button
        class="btn btn-xs btn-grayscale dropdown-toggle dropdown-toggle-split"
        :class="{ 'gray-background': hint }"
        id="continuousButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i class="fa fa-caret-down"></i>
      </button>
      <div
        class="dropdown-menu"
        aria-labelledby="continuousButton"
        style="padding-left:5px; padding-right:5px;"
      >
        當相鄰照片間隔
        <input
          type="number"
          min="1"
          max="10"
          class="form-control form-control-inline"
          style="width:3em; display:inline;"
          :value="continuousMinute"
          @change="changeMinute"
        />
        分鐘時，自動補齊所編輯的欄位資料
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hint: false,
    };
  },
  props: {
    isEnable: {
      type: Boolean,
      default: false,
    },
    continuousMinute: {
      type: Number,
      default: 3,
    },
  },
  methods: {
    changeMinute(e) {
      const value = e.target.value;

      if (value >= 1 && value <= 10) {
        this.$emit('change', Number(e.target.value));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  outline: none;
}

.gray-background {
  background-color: #8080802e;
}
</style>
