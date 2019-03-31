<template>
  <div id="link">
    <ul>
      <li><router-link to="/">home</router-link></li>
      <li><router-link to="/project/overview">計畫總覽</router-link></li>
      <li><router-link to="/download">篩選及下載</router-link></li>
      <li><router-link to="/upload-history">上傳紀錄</router-link></li>
      <li><router-link to="/setting">設定</router-link></li>
      <li><router-link to="/help">幫助</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
#link ul li {
  display: inline;
  margin-right: 1rem;
}
</style>
