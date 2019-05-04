<template>
  <div class="system-announcement">
    <div><i class="fa fa-exclamation"></i></div>
    <span>{{ message }}</span>
  </div>
</template>

<script>
export default {
  name: 'system-announcement',
  props: {
    message: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.system-announcement {
  height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #fec9d4;
  color: #8b8b8b;
  & > div {
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #d80c37;
    color: white;
    margin: 0 10px;

    & > i {
      font-size: 8px;
    }
  }
}
</style>
